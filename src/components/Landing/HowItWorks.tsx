import {
  ArrowRight,
  UserPlus,
  Target,
  MessageSquare,
  Trophy,
} from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Join or Create",
    description:
      "Start by creating a new debate topic or join an existing debate room.",
    step: "01",
  },
  {
    icon: Target,
    title: "Choose Your Side",
    description:
      "Select your position and prepare your arguments with AI assistance.",
    step: "02",
  },
  {
    icon: MessageSquare,
    title: "Engage & Debate",
    description:
      "Present arguments, respond to opponents, and let AI evaluate in real-time.",
    step: "03",
  },
  {
    icon: Trophy,
    title: "Review & Learn",
    description:
      "Get comprehensive summaries, scores, and insights to improve your skills.",
    step: "04",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="relative py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-[#FFACAC] bg-clip-text text-transparent">
            How It Works
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Four simple steps to engaging, AI-powered debates
          </p>
        </div>

        <div className="relative">
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-[#5D2F77] via-[#E45A92] to-[#FFACAC] opacity-30"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="relative">
                  <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-[#E45A92]/50 transition-all duration-300 hover:transform hover:scale-105 h-full">
                    <div className="flex flex-col items-center text-center">
                      <div className="relative mb-6">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#E45A92] to-[#FFACAC] flex items-center justify-center shadow-lg shadow-[#E45A92]/50">
                          <Icon className="w-10 h-10 text-white" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-12 h-12 rounded-full bg-[#3E1E68] border-2 border-[#E45A92] flex items-center justify-center">
                          <span className="text-sm font-bold text-[#FFACAC]">
                            {step.step}
                          </span>
                        </div>
                      </div>

                      <h3 className="text-2xl font-bold text-white mb-4">
                        {step.title}
                      </h3>

                      <p className="text-gray-300 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {index < steps.length - 1 && (
                    <div className="hidden lg:flex absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                      <ArrowRight className="w-8 h-8 text-[#E45A92]" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
export default HowItWorks;
