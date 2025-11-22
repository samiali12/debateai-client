"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EngagementData } from "@/types/engagement";
import EngagementOverTime from "@/components/Engagement/EngagementOverTime";
import UserActivityChart from "@/components/Engagement/UserActivityChart";
import RoleTrendChart from "@/components/Engagement/RoleTrendChart";
import axios from "axios";
import { Loader2 } from "lucide-react";

interface ApiResponse {
  data: EngagementData;
  message: string;
  success: boolean;
}

export default function AnalyticsPage() {
  const params = useParams();
  const debateId = params.id as string;

  const [data, setData] = useState<EngagementData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEngagementData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios(
          `${process.env.NEXT_PUBLIC_API_URL}/engagement/${debateId}`
        );

        if (!(response.status == 200)) {
          throw new Error(
            `Failed to fetch engagement data: ${response.status}`
          );
        }
        const result: EngagementData = await response.data;

        if (result && result) {
          setData(result);
        } else {
          throw new Error("Invalid data received");
        }
      } catch (err) {
        console.error("Error fetching engagement data:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (debateId) {
      fetchEngagementData();
    }
  }, [debateId]);

  if (loading) {
    return (
      <div className="bg-gradient-to-b from-[#3E1E68] via-[#2a1447] to-[#1a0c2e] p-4 flex items-center justify-center h-screen">
        <Loader2 className="animate-spin w-10 h-10 text-[#E45A92]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#3E1E68] via-[#2a1447] to-[#1a0c2e] p-6">
        <div className="max-w-7xl mx-auto">
          <Card className="">
            <CardContent className="pt-6">
              <div className="text-center text-gray-100">
                <h3 className="text-lg font-semibold mb-2">
                  Error Loading Analytics
                </h3>
                <p>{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Retry
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#3E1E68] via-[#2a1447] to-[#1a0c2e] p-6">
        <div className="max-w-7xl mx-auto">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-gray-300">
                <h3 className="text-lg font-semibold mb-2">
                  No Data Available
                </h3>
                <p>No engagement data found for this debate.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#3E1E68] via-[#2a1447] to-[#1a0c2e] p-6 text-white">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#E45A92] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#FFACAC] rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse delay-1000"></div>
      </div>
      <div className="max-w-7xl mx-auto space-y-10">
        {/* HEADER */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-center tracking-wide bg-gradient-to-r from-white to-[#FFACAC] bg-clip-text text-transparent my-4">
            Debate Analytics
          </h1>
          <p className="text-center text-gray-300 mb-6">
            Engagement insights for debate #{debateId}
          </p>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <Card className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-[#E45A92]/50 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-[#FFACAC]">
                Total Messages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-300">
                {data.engagement_over_time.reduce((s, p) => s + p.count, 0)}
              </div>
            </CardContent>
          </Card>

          {/* Card 2 */}
          <Card className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-[#E45A92]/50 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-[#FFACAC]">
                Active Participants
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-300">
                {data.user_activity.length}
              </div>
            </CardContent>
          </Card>

          {/* Card 3 */}
          <Card className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-[#E45A92]/50 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-[#FFACAC]">
                Time Points
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-300">
                {data.engagement_over_time.length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-10">
          {/* Engagement Over Time */}
          <div className="xl:col-span-2">
            <div className="bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm rounded-3xl p-6 border border-white/10">
              <h2 className="text-xl font-bold text-[#FFACAC] mb-4">
                Engagement Over Time
              </h2>
              <EngagementOverTime data={data.engagement_over_time} />
            </div>
          </div>

          {/* User Activity */}
          <div className="xl:col-span-1">
            <div className="bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm rounded-3xl p-6 border border-white/10">
              <h2 className="text-xl font-bold text-[#FFACAC] mb-4">
                User Activity
              </h2>
              <UserActivityChart data={data.user_activity} />
            </div>
          </div>

          {/* Role Trend */}
          <div className="xl:col-span-3">
            <div className="bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm rounded-3xl p-6 border border-white/10">
              <h2 className="text-xl font-bold text-[#FFACAC] mb-4">
                Role Trend (For / Against / Neutral)
              </h2>
              <RoleTrendChart data={data.role_trend} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
