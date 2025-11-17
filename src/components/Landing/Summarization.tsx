import { FileText, Download, Share2, BookOpen } from "lucide-react";

const Summarization = () => {
  return (
    <section className="relative py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm rounded-3xl p-12 border border-white/10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#E45A92]/20 rounded-full border border-[#E45A92]/50 mb-6">
                <FileText className="w-4 h-4 text-[#E45A92]" />
                <span className="text-sm text-[#FFACAC] font-medium">
                  Intelligent Summarization
                </span>
              </div>

              <h2 className="text-5xl md:text-6xl font-bold mb-6 text-white">
                Comprehensive Summaries
              </h2>

              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                After each debate, receive detailed AI-generated summaries with
                key points, winning arguments, and learning insights.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                  <BookOpen className="w-8 h-8 text-[#E45A92] mb-3" />
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Key Takeaways
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Main arguments and conclusions
                  </p>
                </div>

                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                  <Download className="w-8 h-8 text-[#FFACAC] mb-3" />
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Export Report
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Download full analysis
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#E45A92]/20 to-[#FFACAC]/20 rounded-3xl filter blur-3xl"></div>

              <div className="relative bg-[#3E1E68]/80 backdrop-blur-sm rounded-3xl p-8 border border-[#E45A92]/30 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">
                    Debate Summary
                  </h3>
                  <button className="text-[#FFACAC] hover:text-white transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                    <h4 className="text-[#FFACAC] font-semibold mb-3">Topic</h4>
                    <p className="text-white text-lg">
                      Should artificial intelligence be regulated by
                      governments?
                    </p>
                  </div>

                  <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                    <h4 className="text-[#FFACAC] font-semibold mb-3">
                      Winner
                    </h4>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E45A92] to-[#FFACAC]"></div>
                      <div>
                        <p className="text-white font-medium">Pro Side</p>
                        <p className="text-gray-400 text-sm">89% confidence</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                    <h4 className="text-[#FFACAC] font-semibold mb-3">
                      Key Arguments
                    </h4>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li className="flex gap-2">
                        <span className="text-[#E45A92]">•</span>
                        Ethical considerations in AI development
                      </li>
                      <li className="flex gap-2">
                        <span className="text-[#E45A92]">•</span>
                        Economic impact and job displacement
                      </li>
                      <li className="flex gap-2">
                        <span className="text-[#E45A92]">•</span>
                        Privacy and data security concerns
                      </li>
                    </ul>
                  </div>

                  <button className="w-full py-4 bg-gradient-to-r from-[#E45A92] to-[#FFACAC] rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-[#E45A92]/50 transition-all duration-300 flex items-center justify-center gap-2">
                    <Download className="w-5 h-5" />
                    Download Full Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Summarization;
