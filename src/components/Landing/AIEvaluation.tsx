import { Brain, BarChart3, CheckCircle2, TrendingUp } from "lucide-react";

const AIEvaluation = () => {
  return (
    <section className="relative py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FFACAC]/20 to-[#E45A92]/20 rounded-3xl filter blur-3xl"></div>

            <div className="relative bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">
                  Argument Analysis
                </h3>
                <Brain className="w-8 h-8 text-[#E45A92]" />
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300 font-medium">
                      Logical Consistency
                    </span>
                    <span className="text-[#FFACAC] font-bold">94%</span>
                  </div>
                  <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#E45A92] to-[#FFACAC] rounded-full"
                      style={{ width: "94%" }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300 font-medium">
                      Evidence Quality
                    </span>
                    <span className="text-[#FFACAC] font-bold">87%</span>
                  </div>
                  <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#E45A92] to-[#FFACAC] rounded-full"
                      style={{ width: "87%" }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300 font-medium">
                      Rhetoric Effectiveness
                    </span>
                    <span className="text-[#FFACAC] font-bold">91%</span>
                  </div>
                  <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#E45A92] to-[#FFACAC] rounded-full"
                      style={{ width: "91%" }}
                    ></div>
                  </div>
                </div>

                <div className="bg-[#E45A92]/20 rounded-2xl p-6 border border-[#E45A92]/50 mt-8">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-[#FFACAC] flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="text-white font-semibold mb-2">
                        AI Feedback
                      </h4>
                      <p className="text-gray-300 text-sm">
                        Excellent use of supporting evidence. Consider
                        anticipating counterarguments in your next response for
                        even stronger positioning.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FFACAC]/20 rounded-full border border-[#FFACAC]/50 mb-6">
              <BarChart3 className="w-4 h-4 text-[#FFACAC]" />
              <span className="text-sm text-[#FFACAC] font-medium">
                Advanced Analytics
              </span>
            </div>

            <h2 className="text-5xl md:text-6xl font-bold mb-6 text-white">
              AI Argument Evaluation
            </h2>

            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Get instant, comprehensive analysis of your arguments. Our AI
              evaluates logic, evidence quality, and rhetorical effectiveness to
              help you become a better debater.
            </p>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#FFACAC]/20 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-[#FFACAC]" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Deep Analysis
                  </h3>
                  <p className="text-gray-300">
                    Advanced NLP models evaluate argument structure, fallacies,
                    and persuasiveness.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#E45A92]/20 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-[#E45A92]" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Actionable Insights
                  </h3>
                  <p className="text-gray-300">
                    Receive specific recommendations to strengthen your
                    arguments and debate strategy.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIEvaluation;
