import {
  Brain,
  MessageCircle,
  Award,
  Clock,
  Shield,
  TrendingUp,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Intelligence",
    description:
      "Advanced machine learning algorithms analyze arguments in real-time for logical consistency and strength.",
    color: "#E45A92",
  },
  {
    icon: MessageCircle,
    title: "Real-Time Interaction",
    description:
      "Engage in dynamic debates with instant feedback and intelligent response suggestions.",
    color: "#FFACAC",
  },
  {
    icon: Award,
    title: "Argument Evaluation",
    description:
      "Get comprehensive scoring and feedback on your debate performance and argumentation quality.",
    color: "#E45A92",
  },
  {
    icon: Clock,
    title: "Structured Timing",
    description:
      "Well-organized debate rounds with automated timekeeping and turn management.",
    color: "#FFACAC",
  },
  {
    icon: Shield,
    title: "Fair Moderation",
    description:
      "AI ensures unbiased moderation and maintains debate etiquette throughout the session.",
    color: "#E45A92",
  },
  {
    icon: TrendingUp,
    title: "Performance Analytics",
    description:
      "Track your progress with detailed insights and improvement recommendations.",
    color: "#FFACAC",
  },
];

const Features = () => {
  return (
    <section id="features" className="relative py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#FFACAC] to-[#E45A92] bg-clip-text text-transparent">
            Powerful Features
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Everything you need for intelligent, structured, and engaging
            debates
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-[#E45A92]/50 transition-all duration-300 hover:transform hover:scale-105"
              >
                <div
                  className="absolute top-0 right-0 w-32 h-32 rounded-full filter blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"
                  style={{ backgroundColor: feature.color }}
                ></div>

                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 relative"
                  style={{ backgroundColor: `${feature.color}20` }}
                >
                  <Icon className="w-7 h-7" style={{ color: feature.color }} />
                </div>

                <h3 className="text-2xl font-bold text-white mb-4">
                  {feature.title}
                </h3>

                <p className="text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
