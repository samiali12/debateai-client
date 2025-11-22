"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EngagementData } from "@/types/engagement";
import EngagementOverTime from "@/components/Engagement/EngagementOverTime";
import UserActivityChart from "@/components/Engagement/UserActivityChart";
import RoleTrendChart from "@/components/Engagement/RoleTrendChart";
import axios from "axios";
import { Loader2 } from "lucide-react";

const Analytics = ({ debateId }: { debateId: number }) => {
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
      <div className="flex items-center justify-center h-full">
        <Loader2 className="animate-spin w-10 h-10 text-[#E45A92]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <Card className="bg-white/5 backdrop-blur-sm border border-white/10">
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
    );
  }

  if (!data) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <Card className="bg-white/5 backdrop-blur-sm border border-white/10">
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
    );
  }

  return (
    <div className="flex flex-col overflow-hidden">
      {/* HEADER - Fixed height */}
      <div className="shrink-0 pt-4 pb-2 px-4">
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-[#FFACAC] bg-clip-text text-transparent mb-2">
            Debate Analytics
          </h1>
          <p className="text-gray-300 text-sm md:text-base">
            Engagement insights for debate #{debateId}
          </p>
        </div>
      </div>

      {/* CONTENT - Scrollable area */}
      <div className="overflow-y-auto overflow-x-hidden min-h-0">
        <div className="p-4 space-y-4">
          {/* SUMMARY CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:border-[#E45A92]/50 transition-all duration-300">
              <CardHeader className="p-0 pb-3">
                <CardTitle className="text-base md:text-lg font-bold text-[#FFACAC]">
                  Total Messages
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="text-2xl md:text-3xl font-bold text-gray-300">
                  {data.engagement_over_time.reduce((s, p) => s + p.count, 0)}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:border-[#E45A92]/50 transition-all duration-300">
              <CardHeader className="p-0 pb-3">
                <CardTitle className="text-base md:text-lg font-bold text-[#FFACAC]">
                  Active Participants
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="text-2xl md:text-3xl font-bold text-gray-300">
                  {data.user_activity.length}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:border-[#E45A92]/50 transition-all duration-300">
              <CardHeader className="p-0 pb-3">
                <CardTitle className="text-base md:text-lg font-bold text-[#FFACAC]">
                  Time Points
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="text-2xl md:text-3xl font-bold text-gray-300">
                  {data.engagement_over_time.length}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CHARTS - Made more compact */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {/* Engagement Over Time */}
            <div className="xl:col-span-2">
              <div className="bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm rounded-2xl p-4 border border-white/10 h-full">
                <h2 className="text-lg md:text-xl font-bold text-[#FFACAC] mb-3">
                  Engagement Over Time
                </h2>
                <div className="">
                  <EngagementOverTime data={data.engagement_over_time} />
                </div>
              </div>
            </div>

            {/* User Activity */}
            <div className="xl:col-span-1">
              <div className="bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm rounded-2xl p-4 border border-white/10 h-full">
                <h2 className="text-lg md:text-xl font-bold text-[#FFACAC] mb-3">
                  User Activity
                </h2>
                <div className="">
                  <UserActivityChart data={data.user_activity} />
                </div>
              </div>
            </div>

            {/* Role Trend - Made taller but not too tall */}
            <div className="xl:col-span-3">
              <div className="bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm rounded-2xl p-4 border border-white/10 h-full">
                <h2 className="text-lg md:text-xl font-bold text-[#FFACAC] mb-3">
                  Role Trend (For / Against / Neutral)
                </h2>
                <div className="">
                  <RoleTrendChart data={data.role_trend} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#E45A92] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#FFACAC] rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse delay-1000"></div>
      </div>
    </div>
  );
};

export default Analytics;