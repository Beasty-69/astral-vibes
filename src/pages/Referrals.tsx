
import { useState, useEffect } from "react";
import { Gift, Copy, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Sidebar from "@/components/sidebar/Sidebar";
import MiniPlayer from "@/components/Player/MiniPlayer";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";

interface ReferralCode {
  id: string;
  code: string;
  created_at: string;
  expires_at: string | null;
  uses_left: number;
  max_uses: number;
}

const Referrals = () => {
  const [loading, setLoading] = useState(false);
  const [generatingCode, setGeneratingCode] = useState(false);
  const [referralCodes, setReferralCodes] = useState<ReferralCode[]>([]);
  const [referralCode, setReferralCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [applyingCode, setApplyingCode] = useState(false);
  const [codeInput, setCodeInput] = useState("");

  // Fetch user's referral codes
  useEffect(() => {
    const fetchReferralCodes = async () => {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Use REST endpoint for tables that aren't in the database types yet
          const response = await fetch(`https://voccnacfmhzarimobvcd.supabase.co/rest/v1/referral_codes?user_id=eq.${user.id}&select=*`, {
            headers: {
              'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvY2NuYWNmbWh6YXJpbW9idmNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAyMDQ3MzUsImV4cCI6MjA1NTc4MDczNX0.Bgc3clgCVJF30Ac00R0Xie8Qm14-WW652SXPAtwVu1s',
              'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
            }
          });
          
          if (response.ok) {
            const codes = await response.json();
            setReferralCodes(codes);
            if (codes.length > 0) {
              setReferralCode(codes[0].code);
            }
          } else {
            console.error('Failed to fetch referral codes:', response.statusText);
          }
        }
      } catch (error) {
        console.error("Error fetching referral codes:", error);
        toast.error("Failed to load referral codes");
      } finally {
        setLoading(false);
      }
    };

    fetchReferralCodes();
  }, []);

  // Function to generate a new referral code
  const generateReferralCode = async () => {
    try {
      setGeneratingCode(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Please login to generate a referral code");
        return;
      }
      
      const response = await fetch('https://voccnacfmhzarimobvcd.functions.supabase.co/referrals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify({
          action: 'create',
          userId: user.id
        })
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success && result.code) {
        setReferralCode(result.code);
        // Refresh referral codes list
        const newCodesResponse = await fetch(`https://voccnacfmhzarimobvcd.supabase.co/rest/v1/referral_codes?user_id=eq.${user.id}&select=*`, {
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvY2NuYWNmbWh6YXJpbW9idmNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAyMDQ3MzUsImV4cCI6MjA1NTc4MDczNX0.Bgc3clgCVJF30Ac00R0Xie8Qm14-WW652SXPAtwVu1s',
            'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
          }
        });
        
        if (newCodesResponse.ok) {
          const codes = await newCodesResponse.json();
          setReferralCodes(codes);
        }
        
        toast.success("Referral code generated successfully");
      } else {
        toast.error(result.error || "Failed to generate referral code");
      }
    } catch (error) {
      console.error("Error generating referral code:", error);
      toast.error("Failed to generate referral code");
    } finally {
      setGeneratingCode(false);
    }
  };

  // Function to copy referral code to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralCode).then(
      () => {
        setCopied(true);
        toast.success("Copied to clipboard");
        setTimeout(() => setCopied(false), 2000);
      },
      () => {
        toast.error("Failed to copy to clipboard");
      }
    );
  };

  // Function to apply a referral code
  const applyReferralCode = async () => {
    if (!codeInput) {
      toast.error("Please enter a referral code");
      return;
    }
    
    try {
      setApplyingCode(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Please login to use a referral code");
        return;
      }
      
      // First verify the code
      const verifyResponse = await fetch('https://voccnacfmhzarimobvcd.functions.supabase.co/referrals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify({
          action: 'verify',
          code: codeInput
        })
      });
      
      if (!verifyResponse.ok) {
        throw new Error(`Error: ${verifyResponse.status}`);
      }
      
      const verifyResult = await verifyResponse.json();
      
      if (!verifyResult.valid) {
        toast.error(verifyResult.error || "Invalid or expired referral code");
        return;
      }
      
      // Now use the code
      const useResponse = await fetch('https://voccnacfmhzarimobvcd.functions.supabase.co/referrals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify({
          action: 'use',
          code: codeInput,
          userId: user.id
        })
      });
      
      if (!useResponse.ok) {
        throw new Error(`Error: ${useResponse.status}`);
      }
      
      const useResult = await useResponse.json();
      
      if (useResult.success) {
        toast.success(useResult.message || "Referral code applied successfully");
        setCodeInput("");
      } else {
        toast.error(useResult.error || "Failed to apply referral code");
      }
    } catch (error) {
      console.error("Error applying referral code:", error);
      toast.error("Failed to apply referral code");
    } finally {
      setApplyingCode(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="ml-0 md:ml-60 p-4 md:p-8 pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-8">
            <Gift className="w-12 h-12 mr-4 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Referrals</h1>
              <p className="text-muted-foreground">
                Share Nebula with friends and get rewards
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Your referral code */}
            <Card>
              <CardHeader>
                <CardTitle>Your Referral Code</CardTitle>
                <CardDescription>
                  Share this code with friends to give them 7 days of premium
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center p-4">
                    <Loader2 className="animate-spin text-primary h-8 w-8" />
                  </div>
                ) : referralCode ? (
                  <div className="flex gap-2">
                    <Input
                      value={referralCode}
                      readOnly
                      className="font-mono text-lg tracking-wider"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={copyToClipboard}
                      className="flex-shrink-0"
                    >
                      {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={generateReferralCode}
                    disabled={generatingCode}
                    className="w-full"
                  >
                    {generatingCode ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      "Generate Referral Code"
                    )}
                  </Button>
                )}
              </CardContent>
              {referralCodes.length > 0 && (
                <CardFooter className="flex flex-col items-start">
                  <p className="text-sm text-muted-foreground mb-2">
                    Uses remaining: {referralCodes[0]?.uses_left} / {referralCodes[0]?.max_uses}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Expires: {referralCodes[0]?.expires_at
                      ? new Date(referralCodes[0].expires_at).toLocaleDateString()
                      : "Never"}
                  </p>
                </CardFooter>
              )}
            </Card>

            {/* Apply a referral code */}
            <Card>
              <CardHeader>
                <CardTitle>Apply Referral Code</CardTitle>
                <CardDescription>
                  Enter a friend's code to get 7 days of premium
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter code (e.g. ABC-123-XYZ)"
                    value={codeInput}
                    onChange={(e) => setCodeInput(e.target.value)}
                    className="font-mono"
                  />
                  <Button
                    onClick={applyReferralCode}
                    disabled={applyingCode || !codeInput}
                    className="flex-shrink-0"
                  >
                    {applyingCode ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Apply"
                    )}
                  </Button>
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">
                  You can only use one referral code per account
                </p>
              </CardFooter>
            </Card>
          </div>

          {/* Rewards explanation */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-card/50">
                  <div className="rounded-full bg-primary/10 w-10 h-10 flex items-center justify-center mb-3">
                    <Gift className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-medium mb-1">1. Share Your Code</h3>
                  <p className="text-sm text-muted-foreground">
                    Give your unique referral code to friends and family
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-card/50">
                  <div className="rounded-full bg-primary/10 w-10 h-10 flex items-center justify-center mb-3">
                    <Gift className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-medium mb-1">2. Friends Sign Up</h3>
                  <p className="text-sm text-muted-foreground">
                    They create an account and apply your referral code
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-card/50">
                  <div className="rounded-full bg-primary/10 w-10 h-10 flex items-center justify-center mb-3">
                    <Gift className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-medium mb-1">3. Both Get Rewarded</h3>
                  <p className="text-sm text-muted-foreground">
                    You both receive 7 days of Nebula Premium
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <MiniPlayer />
    </div>
  );
};

export default Referrals;
