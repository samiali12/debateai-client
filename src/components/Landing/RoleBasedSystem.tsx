import { UserCircle, Shield, Users, Gavel } from "lucide-react";

const roles = [
  {
    icon: UserCircle,
    title: "Debater",
    description:
      "Present arguments, respond to opponents, and showcase your reasoning skills.",
    features: [
      "Argument submission",
      "Real-time responses",
      "Performance tracking",
    ],
    color: "#E45A92",
  },
  {
    icon: Gavel,
    title: "Moderator",
    description:
      "Guide the debate flow, ensure fair play, and maintain structure.",
    features: ["Time management", "Turn control", "Rule enforcement"],
    color: "#FFACAC",
  },
  {
    icon: Users,
    title: "Audience",
    description:
      "Watch debates unfold, vote on winners, and learn from skilled debaters.",
    features: ["Live viewing", "Voting rights", "Comment access"],
    color: "#E45A92",
  },
  {
    icon: Shield,
    title: "AI Judge",
    description:
      "Unbiased evaluation of arguments based on logic, evidence, and rhetoric.",
    features: ["Automated scoring", "Detailed feedback", "Fair assessment"],
    color: "#FFACAC",
  },
];

const RoleBasedSystem = () => {
  return (
    <section id="roles" className="relative py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#FFACAC] to-[#E45A92] bg-clip-text text-transparent">
            Role-Based System
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Every participant has a clear role with specific capabilities and
            responsibilities
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {roles.map((role, index) => {
            const Icon = role.icon;
            return (
              <div
                key={index}
                className="relative bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-[#E45A92]/50 transition-all duration-300 hover:transform hover:scale-105"
              >
                <div
                  className="absolute top-0 right-0 w-40 h-40 rounded-full filter blur-3xl opacity-0 hover:opacity-20 transition-opacity duration-500"
                  style={{ backgroundColor: role.color }}
                ></div>

                <div className="relative">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                    style={{ backgroundColor: `${role.color}20` }}
                  >
                    <Icon className="w-8 h-8" style={{ color: role.color }} />
                  </div>

                  <h3 className="text-3xl font-bold text-white mb-4">
                    {role.title}
                  </h3>

                  <p className="text-gray-300 leading-relaxed mb-6">
                    {role.description}
                  </p>

                  <div className="space-y-3">
                    {role.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: role.color }}
                        ></div>
                        <span className="text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default RoleBasedSystem;
