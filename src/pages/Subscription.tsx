
import { Check } from "lucide-react";
import Sidebar from "@/components/sidebar/Sidebar";
import MiniPlayer from "@/components/Player/MiniPlayer";

const Subscription = () => {
  const plans = [
    {
      name: "Free",
      price: "$0",
      features: [
        "Ad-supported listening",
        "Basic audio quality",
        "Mobile app access",
        "Limited skips",
      ],
      color: "from-gray-500 to-gray-600",
    },
    {
      name: "Premium",
      price: "$9.99",
      features: [
        "Ad-free listening",
        "High-quality audio",
        "Offline mode",
        "Unlimited skips",
        "Group sessions",
        "Custom playlists",
      ],
      color: "from-primary to-purple-600",
      popular: true,
    },
    {
      name: "Family",
      price: "$14.99",
      features: [
        "Up to 6 accounts",
        "Ad-free listening",
        "High-quality audio",
        "Parental controls",
        "Group sessions",
        "Shared playlists",
      ],
      color: "from-pink-500 to-rose-600",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="ml-0 md:ml-60 p-4 md:p-8 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
              Choose Your Plan
            </h1>
            <p className="text-lg text-muted-foreground">
              Unlock the full potential of your music experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div
                key={plan.name}
                className={`glass rounded-2xl p-6 transition-all duration-300 hover:scale-105 animate-fade-in`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div
                  className={`h-2 w-full bg-gradient-to-r ${plan.color} rounded-full mb-6`}
                />
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-3xl font-bold mb-6">{plan.price}<span className="text-sm text-muted-foreground">/month</span></p>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check size={16} className="text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button className="mt-8 w-full bg-primary/10 hover:bg-primary/20 text-primary font-medium py-3 rounded-lg transition-colors">
                  Choose Plan
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
      <MiniPlayer />
    </div>
  );
};

export default Subscription;
