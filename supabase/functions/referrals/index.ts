import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ReferralRequest {
  action: "create" | "verify" | "use";
  code?: string;
  userId?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY") as string;
    const supabaseAdmin = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
    
    // Create Supabase clients
    const supabase = createClient(supabaseUrl, supabaseKey);
    const adminClient = createClient(supabaseUrl, supabaseAdmin);
    
    // Parse the request body
    const requestData: ReferralRequest = await req.json();
    const { action, code, userId } = requestData;
    
    // Generate a new referral code
    if (action === "create" && userId) {
      const generatedCode = generateReferralCode();
      
      // First check if user already has a code
      const { data: existingCodes, error: checkError } = await supabase
        .from("referral_codes")
        .select("*")
        .eq("user_id", userId);
      
      if (checkError) {
        console.error("Error checking existing referral codes:", checkError);
        return new Response(
          JSON.stringify({ error: "Failed to check existing referral codes" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
        );
      }
      
      // If user already has a code that's still valid, return it
      const validExistingCode = existingCodes?.find(code => 
        (code.expires_at === null || new Date(code.expires_at) > new Date()) && 
        code.uses_left > 0
      );
      
      if (validExistingCode) {
        return new Response(
          JSON.stringify({ success: true, code: validExistingCode.code }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      // Otherwise create a new code
      const { data, error } = await supabase
        .from("referral_codes")
        .insert({
          user_id: userId,
          code: generatedCode,
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days expiry
        })
        .select("code")
        .single();
      
      if (error) {
        console.error("Error creating referral code:", error);
        return new Response(
          JSON.stringify({ error: "Failed to create referral code" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
        );
      }
      
      return new Response(
        JSON.stringify({ success: true, code: data.code }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Verify a referral code
    if (action === "verify" && code) {
      const { data, error } = await supabase
        .from("referral_codes")
        .select("*")
        .eq("code", code)
        .gte("expires_at", new Date().toISOString())
        .gt("uses_left", 0)
        .single();
      
      if (error || !data) {
        return new Response(
          JSON.stringify({ valid: false, error: "Invalid or expired referral code" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({ valid: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Use a referral code
    if (action === "use" && code && userId) {
      // First verify the code
      const { data: referralCode, error: verifyError } = await supabase
        .from("referral_codes")
        .select("*")
        .eq("code", code)
        .gte("expires_at", new Date().toISOString())
        .gt("uses_left", 0)
        .single();
      
      if (verifyError || !referralCode) {
        return new Response(
          JSON.stringify({ success: false, error: "Invalid or expired referral code" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
        );
      }
      
      // Check that user is not using their own code
      if (referralCode.user_id === userId) {
        return new Response(
          JSON.stringify({ success: false, error: "Cannot use your own referral code" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
        );
      }
      
      // Check if this user has already used a referral code
      const { data: existingUse, error: checkError } = await supabase
        .from("referral_uses")
        .select("*")
        .eq("referred_user_id", userId)
        .single();
      
      if (existingUse) {
        return new Response(
          JSON.stringify({ success: false, error: "You have already used a referral code" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
        );
      }
      
      // Begin transaction - must use admin client for this
      // 1. Decrement uses_left on the referral code
      const { error: updateError } = await adminClient
        .from("referral_codes")
        .update({ uses_left: referralCode.uses_left - 1 })
        .eq("id", referralCode.id);
      
      if (updateError) {
        console.error("Error updating referral code:", updateError);
        return new Response(
          JSON.stringify({ success: false, error: "Failed to use referral code" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
        );
      }
      
      // 2. Record the referral use
      const { error: useError } = await adminClient
        .from("referral_uses")
        .insert({
          referral_code_id: referralCode.id,
          referred_user_id: userId
        });
      
      if (useError) {
        console.error("Error recording referral use:", useError);
        // Try to revert the uses_left decrement
        await adminClient
          .from("referral_codes")
          .update({ uses_left: referralCode.uses_left })
          .eq("id", referralCode.id);
          
        return new Response(
          JSON.stringify({ success: false, error: "Failed to record referral use" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
        );
      }
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Referral code applied successfully" 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    return new Response(
      JSON.stringify({ error: "Invalid action" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
    );
  } catch (error) {
    console.error("Error processing referral request:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});

// Helper function to generate a random, readable referral code
function generateReferralCode(): string {
  const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Removed confusing characters (I, O, 0, 1)
  let code = "";
  
  // Generate 3 groups of 3 characters separated by hyphens (e.g. ABC-123-XYZ)
  for (let group = 0; group < 3; group++) {
    for (let i = 0; i < 3; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters.charAt(randomIndex);
    }
    
    if (group < 2) {
      code += "-";
    }
  }
  
  return code;
}
