import { Sparkles, MessageSquare, Zap } from "lucide-react";

const Hero = () => {
  return (
    <section className="mt-24 relative min-h-screen flex items-center justify-center overflow-hidden px-6 py-20">
      <div className="relative z-10 max-w-6xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-[#E45A92]/30 mb-8">
          <Sparkles className="w-4 h-4 text-[#FFACAC]" />
          <span className="text-sm text-[#FFACAC] font-medium">
            Powered by Advanced AI
          </span>
        </div>

        <h1 className="text-6xl md:text-6xl lg:text-8xl font-bold mb-6 bg-gradient-to-r from-white via-[#FFACAC] to-[#E45A92] bg-clip-text text-transparent leading-tight">
          AI-Based Debate System
        </h1>

        <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
          Structured debates powered by advanced AI. Experience intelligent
          argumentation, real-time evaluation, and comprehensive insights.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <button className="group relative px-8 py-4 bg-gradient-to-r from-[#E45A92] to-[#FFACAC] rounded-full text-white font-semibold text-lg shadow-lg shadow-[#E45A92]/50 hover:shadow-xl hover:shadow-[#E45A92]/70 transition-all duration-300 hover:scale-105 flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Start a Debate
            <Zap className="w-4 h-4 group-hover:rotate-12 transition-transform" />
          </button>

          <button className="px-8 py-4 bg-white/10 backdrop-blur-sm rounded-full text-white font-semibold text-lg border-2 border-[#E45A92]/50 hover:bg-white/20 hover:border-[#E45A92] transition-all duration-300">
            Explore Features
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-20">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-[#E45A92]/50 transition-all duration-300">
            <div className="text-4xl font-bold text-[#FFACAC] mb-2">1+</div>
            <div className="text-gray-300">Debates Hosted</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-[#E45A92]/50 transition-all duration-300">
            <div className="text-4xl font-bold text-[#E45A92] mb-2">98%</div>
            <div className="text-gray-300">Accuracy Rate</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-[#E45A92]/50 transition-all duration-300">
            <div className="text-4xl font-bold text-[#FFACAC] mb-2">24/7</div>
            <div className="text-gray-300">AI Available</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
