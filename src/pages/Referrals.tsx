
import { useState, useEffect } from "react";
import { Copy, Gift, RefreshCw, CheckCircle, XCircle } from "lucide-react";
import Sidebar from "@/components/sidebar/Sidebar";
import MiniPlayer from "@/components/Player/MiniPlayer";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const Referrals = () => {
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [codeInput, setCodeInput] = useState("");
  const [isLoadingCode, setIsLoadingCode] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Get user's current referral code on load
  useEffect(() => {
    const fetchReferralCode = async () => {
      setIsLoadingCode(true);
      try {
        const { data, error } = await supabase
          .from("referral_codes")
          .select("code")
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (data) {
          setReferralCode(data.code);
        }
      } catch (error) {
        console.error("Error fetching referral code:", error);
      } finally {
        setIsLoadingCode(false);
      }
    };

    fetchReferralCode();
  }, []);

  const generateReferralCode = async () => {
    setIsLoadingCode(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData?.user?.id) {
        toast.error("You need to be logged in to generate a referral code");
        return;
      }

      const response = await supabase.functions.invoke("referrals", {
        body: {
          action: "create",
          userId: userData.user.id
        }
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      setReferralCode(response.data.code);
      toast.success("New referral code generated!");
    } catch (error) {
      console.error("Error generating referral code:", error);
      toast.error("Failed to generate referral code");
    } finally {
      setIsLoadingCode(false);
    }
  };

  const copyReferralCode = () => {
    if (referralCode) {
      navigator.clipboard.writeText(referralCode);
      toast.success("Referral code copied to clipboard!");
    }
  };

  const verifyReferralCode = async () => {
    if (!codeInput) {
      toast.error("Please enter a referral code");
      return;
    }

    setIsVerifying(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData?.user?.id) {
        toast.error("You need to be logged in to use a referral code");
        return;
      }

      const response = await supabase.functions.invoke("referrals", {
        body: {
          action: "use",
          code: codeInput,
          userId: userData.user.id
        }
      });

      if (response.error) {
        toast.error(response.error.message || "Invalid referral code");
        return;
      }

      toast.success("Referral code applied successfully!");
      setCodeInput("");
      setIsDialogOpen(false);
    } catch (error: any) {
      console.error("Error verifying referral code:", error);
      toast.error(error.message || "Failed to verify referral code");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="ml-0 md:ml-60 p-4 md:p-8 pb-24">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Referrals</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Your Referral Code</CardTitle>
                <CardDescription>
                  Share your code with friends to earn rewards
                </CardDescription>
              </CardHeader>
              <CardContent>
                {referralCode ? (
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="bg-card p-3 rounded-l-md border border-r-0 border-white/10 flex-1">
                        <span className="font-mono text-xl">{referralCode}</span>
                      </div>
                      <button
                        className="p-3 bg-primary text-primary-foreground rounded-r-md border border-primary hover:bg-primary/90 transition-colors"
                        onClick={copyReferralCode}
                      >
                        <Copy size={20} />
                      </button>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={generateReferralCode}
                      disabled={isLoadingCode}
                    >
                      {isLoadingCode ? (
                        <>
                          <RefreshCw size={16} className="mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <RefreshCw size={16} className="mr-2" />
                          Generate New Code
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <Button onClick={generateReferralCode} disabled={isLoadingCode}>
                      {isLoadingCode ? (
                        <>
                          <RefreshCw size={16} className="mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Gift size={16} className="mr-2" />
                          Generate Referral Code
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Use a Referral Code</CardTitle>
                <CardDescription>
                  Enter a friend's code to get benefits
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full">
                      <Gift size={16} className="mr-2" />
                      Enter Referral Code
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Enter Referral Code</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <Input
                        placeholder="Enter code (e.g. ABC-123-XYZ)"
                        value={codeInput}
                        onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
                      />
                      <Button 
                        onClick={verifyReferralCode} 
                        className="w-full"
                        disabled={isVerifying}
                      >
                        {isVerifying ? (
                          <>
                            <RefreshCw size={16} className="mr-2 animate-spin" />
                            Verifying...
                          </>
                        ) : (
                          "Apply Code"
                        )}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <div className="mt-6 space-y-4">
                  <h3 className="font-medium">Referral Benefits:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <CheckCircle size={16} className="mr-2 text-green-400" />
                      Premium features for 7 days
                    </li>
                    <li className="flex items-center">
                      <CheckCircle size={16} className="mr-2 text-green-400" />
                      Unlimited song downloads
                    </li>
                    <li className="flex items-center">
                      <CheckCircle size={16} className="mr-2 text-green-400" />
                      Access to exclusive content
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>How Referrals Work</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-4 list-decimal pl-5">
                  <li>Generate your unique referral code</li>
                  <li>Share your code with friends</li>
                  <li>When they sign up using your code, both of you get rewards</li>
                  <li>Each code can be used up to 10 times</li>
                </ol>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <MiniPlayer />
    </div>
  );
};

export default Referrals;
