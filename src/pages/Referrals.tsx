
import { useState, useEffect } from "react";
import { Gift, Share, Check, Loader2, Users, Award, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import Sidebar from "@/components/sidebar/Sidebar";
import MiniPlayer from "@/components/Player/MiniPlayer";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import CopyToClipboardButton from "@/components/CopyToClipboardButton";

interface ReferralCode {
  id: string;
  code: string;
  created_at: string;
  expires_at: string | null;
  uses_left: number;
  max_uses: number;
}

interface ReferralHistory {
  id: string;
  friend_name: string;
  date: string;
  reward: string;
}

// Sample referral history for UI demo
const sampleReferralHistory: ReferralHistory[] = [
  {
    id: "1",
    friend_name: "Alex Johnson",
    date: "2023-10-15",
    reward: "7 days premium"
  },
  {
    id: "2",
    friend_name: "Sam Williams",
    date: "2023-09-30",
    reward: "7 days premium"
  }
];

const Referrals = () => {
  const [loading, setLoading] = useState(false);
  const [generatingCode, setGeneratingCode] = useState(false);
  const [referralCodes, setReferralCodes] = useState<ReferralCode[]>([]);
  const [referralCode, setReferralCode] = useState("");
  const [applyingCode, setApplyingCode] = useState(false);
  const [codeInput, setCodeInput] = useState("");
  const [referralHistory, setReferralHistory] = useState<ReferralHistory[]>(sampleReferralHistory);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

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

  // Function to share referral code
  const shareReferralCode = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join me on Nebula Music',
          text: `Use my referral code ${referralCode} to get 7 days of Nebula Premium!`,
          url: window.location.origin,
        });
        toast.success("Shared successfully!");
      } catch (error) {
        console.error("Error sharing:", error);
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  // Function to copy referral code to clipboard
  const copyToClipboard = () => {
    const textToCopy = `Join me on Nebula Music! Use my referral code ${referralCode} to get 7 days of premium.`;
    
    navigator.clipboard.writeText(textToCopy).then(
      () => {
        toast.success("Invitation copied to clipboard");
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
        
        // Add to referral history (for UI demo)
        setReferralHistory(prev => [
          {
            id: Date.now().toString(),
            friend_name: "New Friend",
            date: new Date().toISOString().split('T')[0],
            reward: "7 days premium"
          },
          ...prev
        ]);
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
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Space-themed animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="stars-bg"></div>
        <div className="nebula-glow"></div>
        <div className="absolute top-1/4 left-1/3 w-[100px] h-[100px] rounded-full bg-primary/10 blur-3xl animate-pulse"></div>
        <div className="absolute top-2/3 right-1/4 w-[150px] h-[150px] rounded-full bg-purple-600/10 blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <Sidebar />
      <main className="ml-0 md:ml-60 p-4 md:p-8 pb-24 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-8 animate-fade-in">
            <div className="relative">
              <Gift className="w-10 h-10 mr-4 text-primary" />
              <div className="absolute -inset-1 rounded-full bg-primary/20 blur-sm animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold animate-glow">Referrals</h1>
              <p className="text-muted-foreground">
                Share Nebula with friends and get rewards
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Your referral code */}
            <Card className="md:col-span-2 bg-gradient-to-br from-purple-900/30 to-primary/10 glass border-primary/20 animate-fade-in hover:shadow-lg hover:shadow-primary/5 transition-all">
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl animate-glow">Your Referral Code</CardTitle>
                <CardDescription>
                  Share this code with friends to give them 7 days of premium access
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center p-4">
                    <Loader2 className="animate-spin text-primary h-8 w-8" />
                  </div>
                ) : referralCode ? (
                  <div className="flex flex-col md:flex-row gap-2">
                    <div className="relative flex-grow group">
                      <Input
                        value={referralCode}
                        readOnly
                        className="font-mono text-lg tracking-wider pr-10 bg-card/50 border-white/10 transition-all group-hover:border-primary/50"
                      />
                      <div className="absolute inset-0 rounded-md pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 animate-pulse"></div>
                      </div>
                      <CopyToClipboardButton
                        text={referralCode}
                        variant="ghost"
                        className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-primary/10 transition-colors"
                        successMessage="Code copied to clipboard!"
                      />
                    </div>
                    <Button
                      className="gap-2 mt-2 md:mt-0 group relative overflow-hidden"
                      onClick={shareReferralCode}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity animate-pulse"></div>
                      <Share size={16} />
                      <span>Share</span>
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={generateReferralCode}
                    disabled={generatingCode}
                    className="w-full group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity animate-pulse"></div>
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
                <CardFooter className="flex flex-col sm:flex-row justify-between w-full">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-primary">{referralCodes[0]?.uses_left}</span> / {referralCodes[0]?.max_uses} uses remaining
                  </p>
                  <p className="text-sm text-muted-foreground mt-2 sm:mt-0">
                    Expires: {referralCodes[0]?.expires_at
                      ? new Date(referralCodes[0].expires_at).toLocaleDateString()
                      : "Never"}
                  </p>
                </CardFooter>
              )}
            </Card>

            {/* Apply a referral code */}
            <Card className="h-fit animate-fade-in hover:shadow-lg transition-all" style={{animationDelay: '0.1s'}}>
              <CardHeader>
                <CardTitle>Apply Referral Code</CardTitle>
                <CardDescription>
                  Enter a friend's code to get 7 days of premium
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <div className="relative flex-grow">
                    <Input
                      placeholder="Enter code (e.g. ABC-123-XYZ)"
                      value={codeInput}
                      onChange={(e) => setCodeInput(e.target.value)}
                      className="font-mono transition-all focus:border-primary/50"
                    />
                    <div className="absolute inset-0 rounded-md pointer-events-none opacity-0 focus-within:opacity-100 transition-opacity">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 animate-pulse"></div>
                    </div>
                  </div>
                  <Button
                    onClick={applyReferralCode}
                    disabled={applyingCode || !codeInput}
                    className="flex-shrink-0 relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity animate-pulse"></div>
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

            {/* Referral History */}
            <Card className="h-fit animate-fade-in hover:shadow-lg transition-all" style={{animationDelay: '0.2s'}}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle>Referral History</CardTitle>
                  <CardDescription>
                    People who used your referral code
                  </CardDescription>
                </div>
                <div className="relative">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <div className="absolute -inset-1 rounded-full bg-primary/10 blur-sm opacity-0 group-hover:opacity-100"></div>
                </div>
              </CardHeader>
              <CardContent>
                {referralHistory.length > 0 ? (
                  <ul className="space-y-2">
                    {referralHistory.map((referral, index) => (
                      <li 
                        key={referral.id}
                        className="flex items-center justify-between p-2 rounded-md bg-card/50 hover:bg-card/80 transition-colors hover:scale-[1.01] transform"
                        style={{animationDelay: `${0.1 * index}s`}}
                      >
                        <div className="flex items-center gap-2">
                          <div className="rounded-full bg-primary/10 p-1 relative">
                            <Users size={16} className="text-primary" />
                            <div className="absolute -inset-1 rounded-full bg-primary/5 blur-sm opacity-0 group-hover:opacity-100"></div>
                          </div>
                          <div>
                            <p className="text-sm font-medium">{referral.friend_name}</p>
                            <p className="text-xs text-muted-foreground">{referral.date}</p>
                          </div>
                        </div>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                          {referral.reward}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    <p>No referrals yet</p>
                    <p className="text-sm">Share your code to get started</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Rewards explanation */}
          <Card className="mt-6 animate-fade-in hover:shadow-lg transition-all" style={{animationDelay: '0.3s'}}>
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-card/50 transition-all hover:bg-card/70 hover:translate-y-[-2px] group">
                  <div className="rounded-full bg-primary/10 w-10 h-10 flex items-center justify-center mb-3 relative">
                    <Gift className="h-5 w-5 text-primary" />
                    <div className="absolute -inset-1 rounded-full bg-primary/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <h3 className="font-medium mb-1">1. Share Your Code</h3>
                  <p className="text-sm text-muted-foreground">
                    Give your unique referral code to friends and family
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-card/50 transition-all hover:bg-card/70 hover:translate-y-[-2px] group">
                  <div className="rounded-full bg-primary/10 w-10 h-10 flex items-center justify-center mb-3 relative">
                    <Users className="h-5 w-5 text-primary" />
                    <div className="absolute -inset-1 rounded-full bg-primary/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <h3 className="font-medium mb-1">2. Friends Sign Up</h3>
                  <p className="text-sm text-muted-foreground">
                    They create an account and apply your referral code
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-card/50 transition-all hover:bg-card/70 hover:translate-y-[-2px] group">
                  <div className="rounded-full bg-primary/10 w-10 h-10 flex items-center justify-center mb-3 relative">
                    <Award className="h-5 w-5 text-primary" />
                    <div className="absolute -inset-1 rounded-full bg-primary/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <h3 className="font-medium mb-1">3. Both Get Rewarded</h3>
                  <p className="text-sm text-muted-foreground">
                    You both receive 7 days of Nebula Premium
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Premium Benefits */}
          <Card className="mt-6 overflow-hidden animate-fade-in hover:shadow-lg transition-all" style={{animationDelay: '0.4s'}}>
            <CardHeader className="bg-gradient-to-r from-primary/20 to-purple-500/20 relative">
              <div className="absolute inset-0 opacity-30">
                <div className="absolute top-0 right-0 w-40 h-40 bg-purple-600/20 rounded-full blur-3xl transform-gpu"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-primary/20 rounded-full blur-3xl transform-gpu"></div>
              </div>
              <div className="relative z-10">
                <CardTitle>Premium Benefits</CardTitle>
                <CardDescription>
                  What you and your friends get with Premium access
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ul className="divide-y divide-white/5">
                <li className="flex items-center justify-between p-4 hover:bg-card/60 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-primary/10 p-2 relative">
                      <Check size={16} className="text-primary" />
                      <div className="absolute -inset-1 rounded-full bg-primary/10 blur-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    <span>Ad-free listening</span>
                  </div>
                  <ChevronRight size={16} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </li>
                <li className="flex items-center justify-between p-4 hover:bg-card/60 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-primary/10 p-2 relative">
                      <Check size={16} className="text-primary" />
                      <div className="absolute -inset-1 rounded-full bg-primary/10 blur-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    <span>Higher quality audio</span>
                  </div>
                  <ChevronRight size={16} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </li>
                <li className="flex items-center justify-between p-4 hover:bg-card/60 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-primary/10 p-2 relative">
                      <Check size={16} className="text-primary" />
                      <div className="absolute -inset-1 rounded-full bg-primary/10 blur-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    <span>Unlimited skips</span>
                  </div>
                  <ChevronRight size={16} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </li>
                <li className="flex items-center justify-between p-4 hover:bg-card/60 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-primary/10 p-2 relative">
                      <Check size={16} className="text-primary" />
                      <div className="absolute -inset-1 rounded-full bg-primary/10 blur-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    <span>Offline listening</span>
                  </div>
                  <ChevronRight size={16} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
      <MiniPlayer />
    </div>
  );
};

export default Referrals;
