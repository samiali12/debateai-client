"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Loader2, CheckCircle2, AlertTriangle, Target, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface SummaryData {
  role: "for" | "against";
  summary: string;
  top_points: string[];
}

interface Recommendation {
  id: number;
  text: string;
  type: string;
  confidence: number;
  fairness: number;
  feasibility: number;
}

interface ConsensusData {
  debate_id: number;
  generated_at: string;
  for_summary: SummaryData;
  against_summary: SummaryData;
  shared_goals: string[];
  top_conflicts: string[];
  recommendations: Recommendation[];
}

interface ConsensusResultProps {
  debateId: number;
}

const ConsensusResult = ({ debateId }: ConsensusResultProps) => {
  const [data, setData] = useState<ConsensusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConsensusData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/consensus/${debateId}/generate`
        );
        setData(response.data);
      } catch (err) {
        setError("Failed to load consensus data");
        console.error("Error fetching consensus data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchConsensusData();
  }, [debateId]);

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="animate-spin w-10 h-10 text-[#E45A92]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl shadow-lg">
          <CardContent className="p-6">
            <div className="text-center text-red-400 p-4">{error}</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl shadow-lg">
          <CardContent className="p-6">
            <div className="text-center text-gray-300">
              No consensus data available
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-4 space-y-6 min-h-0 custom-scrollbar">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-[#FFACAC] to-[#E45A92] bg-clip-text text-transparent">
              Consensus Analysis
            </h1>
            <p className="text-gray-300 text-sm mt-1">
              AI-generated insights for Debate #{data.debate_id}
            </p>
          </div>
          <div className="text-xs text-gray-400 bg-black/20 rounded-full px-4 py-1.5 border border-white/5">
            Generated: {formatTimestamp(data.generated_at)}
          </div>
        </div>
      </div>

      {/* Side Summaries Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SummaryCard summary={data.for_summary} variant="for" />
        <SummaryCard summary={data.against_summary} variant="against" />
      </div>

      {/* Shared Goals & Conflicts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shared Goals */}
        <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl shadow-lg hover:border-green-500/30 transition-all duration-300 group">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-green-400" />
              <CardTitle className="text-lg text-gray-200">Shared Goals</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {data.shared_goals.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {data.shared_goals.map((goal, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-green-500/10 text-green-300 border border-green-500/20 hover:bg-green-500/20 px-3 py-1 text-sm font-normal"
                  >
                    {goal}
                  </Badge>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 italic text-sm">No shared goals detected</div>
            )}
          </CardContent>
        </Card>

        {/* Top Conflicts */}
        <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl shadow-lg hover:border-orange-500/30 transition-all duration-300 group">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-400" />
              <CardTitle className="text-lg text-gray-200">Key Conflicts</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {data.top_conflicts.map((conflict, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-orange-500/10 text-orange-300 border border-orange-500/20 hover:bg-orange-500/20 px-3 py-1 text-sm font-normal"
                >
                  {conflict}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations List */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="w-5 h-5 text-[#E45A92]" />
          <h2 className="text-xl font-bold text-gray-200">Strategic Recommendations</h2>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {data.recommendations.map((recommendation) => (
            <RecommendationCard
              key={recommendation.id}
              recommendation={recommendation}
            />
          ))}
        </div>
      </div>

      {/* Background Glow Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-1/4 left-10 w-64 h-64 bg-[#E45A92] rounded-full mix-blend-screen filter blur-[100px] opacity-10 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-[#3E1E68] rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-pulse delay-700"></div>
      </div>
    </div>
  );
};

// Summary Card Component
interface SummaryCardProps {
  summary: SummaryData;
  variant: "for" | "against";
}

const SummaryCard = ({ summary, variant }: SummaryCardProps) => {
  const isFor = variant === "for";
  
  return (
    <Card className={cn(
      "bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl group h-full",
      isFor ? "hover:border-green-500/30" : "hover:border-red-500/30"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Badge 
            variant="outline" 
            className={cn(
              "px-3 py-1 border-0 font-bold tracking-wider",
              isFor 
                ? "bg-green-500/20 text-green-300" 
                : "bg-red-500/20 text-red-300"
            )}
          >
            {isFor ? "FOR SIDE" : "AGAINST SIDE"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-gray-300 leading-relaxed text-sm bg-black/20 p-4 rounded-xl border border-white/5">
          {summary.summary}
        </div>

        {summary.top_points.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Key Points</h4>
            <ul className="space-y-2">
              {summary.top_points.map((point, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-300">
                  <div className={cn(
                    "mt-1.5 w-1.5 h-1.5 rounded-full shrink-0",
                    isFor ? "bg-green-400" : "bg-red-400"
                  )} />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Recommendation Card Component
interface RecommendationCardProps {
  recommendation: Recommendation;
}

const RecommendationCard = ({ recommendation }: RecommendationCardProps) => {
  const metrics = [
    {
      label: "Confidence",
      value: recommendation.confidence,
      color: "bg-blue-500",
      textColor: "text-blue-400"
    },
    {
      label: "Fairness",
      value: recommendation.fairness,
      color: "bg-green-500",
      textColor: "text-green-400"
    },
    {
      label: "Feasibility",
      value: recommendation.feasibility,
      color: "bg-purple-500",
      textColor: "text-purple-400"
    },
  ];

  return (
    <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-xl shadow-md hover:bg-white/10 transition-all duration-300 group">
      <CardContent className="p-5">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-blue-500/10 text-blue-300 border border-blue-500/20">
                Suggestion
              </Badge>
            </div>
            <p className="text-gray-200 leading-relaxed font-medium">
              {recommendation.text}
            </p>
          </div>
          
          <div className="w-full md:w-48 space-y-3 shrink-0 bg-black/20 p-3 rounded-xl border border-white/5">
            {metrics.map((metric) => (
              <div key={metric.label} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">{metric.label}</span>
                  <span className={metric.textColor}>{(metric.value * 100).toFixed(0)}%</span>
                </div>
                <Progress
                  value={metric.value * 100}
                  className="h-1.5 bg-white/10"
                  indicatorClassName={metric.color}
                />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConsensusResult;
