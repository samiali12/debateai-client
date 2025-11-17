import { Zap, Users, Radio } from "lucide-react";

const RealTimeDebate = () => {
  return (
    <section className="relative py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#E45A92]/20 rounded-full border border-[#E45A92]/50 mb-6">
              <Radio className="w-4 h-4 text-[#E45A92] animate-pulse" />
              <span className="text-sm text-[#FFACAC] font-medium">
                Live Interaction
              </span>
            </div>

            <h2 className="text-5xl md:text-6xl font-bold mb-6 text-white">
              Real-Time Debate Chat
            </h2>

            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Experience seamless, live debates with instant AI moderation and
              feedback. Our platform ensures smooth communication and
              intelligent turn management.
            </p>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#E45A92]/20 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-[#E45A92]" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Instant Responses
                  </h3>
                  <p className="text-gray-300">
                    Lightning-fast message delivery with zero lag for
                    uninterrupted debate flow.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#FFACAC]/20 flex items-center justify-center">
                  <Users className="w-6 h-6 text-[#FFACAC]" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Multi-Participant
                  </h3>
                  <p className="text-gray-300">
                    Support for multiple debaters with organized turn-taking and
                    role management.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#E45A92]/20 to-[#5D2F77]/20 rounded-3xl filter blur-3xl"></div>

            <div className="relative bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E45A92] to-[#FFACAC]"></div>
                  <div className="flex-1 bg-white/10 rounded-2xl rounded-tl-none p-4">
                    <p className="text-white text-sm">
                      Climate change requires immediate global action...
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 justify-end">
                  <div className="flex-1 bg-[#5D2F77]/50 rounded-2xl rounded-tr-none p-4">
                    <p className="text-white text-sm">
                      While I agree it's important, economic factors...
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#5D2F77] to-[#3E1E68]"></div>
                </div>

                <div className="bg-[#E45A92]/20 rounded-2xl p-4 border border-[#E45A92]/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-[#FFACAC]" />
                    <span className="text-sm font-semibold text-[#FFACAC]">
                      AI Analysis
                    </span>
                  </div>
                  <p className="text-white text-sm">
                    Strong opening argument with factual basis. Consider
                    addressing counterpoints...
                  </p>
                </div>

                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E45A92] to-[#FFACAC]"></div>
                  <div className="flex-1 bg-white/10 rounded-2xl rounded-tl-none p-4">
                    <p className="text-white text-sm">
                      Let me address that concern with recent data...
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RealTimeDebate;
