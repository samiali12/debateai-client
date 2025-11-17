import AIEvaluation from "@/components/Landing/AIEvaluation";
import Features from "@/components/Landing/Features";
import Footer from "@/components/Landing/Footer";
import Hero from "@/components/Landing/Hero";
import HowItWorks from "@/components/Landing/HowItWorks";
import Navbar from "@/components/Landing/Navbar";
import RealTimeDebate from "@/components/Landing/RealTimeDebate";
import RoleBasedSystem from "@/components/Landing/RoleBasedSystem";
import Summarization from "@/components/Landing/Summarization";

const Home = () => {
  return (
    <div className="relative bg-gradient-to-b from-[#3E1E68] via-[#2a1447] to-[#1a0c2e] ">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#E45A92] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#FFACAC] rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse delay-1000"></div>
      </div>
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <RealTimeDebate />
      <AIEvaluation />
      <RoleBasedSystem />
      <Summarization />
      <Footer />
    </div>
  );
};

export default Home;
