"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Download } from "lucide-react";
import axios from "axios";

const SummaryAndReport = ({ debateId }: { debateId: number }) => {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");

  // Fetch summary only (JSON)
  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/summarization/debates/${debateId}/summarize`,
          {
            withCredentials: true,
          }
        );

        setSummary(res.data);
      } catch (err: any) {
        setError(err?.message || "Failed to load summary");
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [debateId]);

  // Download PDF report
  const handleDownload = async () => {
    try {
      setDownloading(true);

      const res = await axios(
        `${process.env.NEXT_PUBLIC_API_URL}/summarization/debates/${debateId}/summarize/report`,
        {
          withCredentials: true,
          method: "GET",
        }
      );

      if (res.status === 200) {
        const url = res.data;
        const a = document.createElement("a");
        a.href = url;
        a.download = `debate_${debateId}_report.pdf`;
        a.click();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDownloading(false);
    }
  };

  // Loading UI
  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );

  // Error UI
  if (error)
    return (
      <div className="text-red-600 text-center py-10 font-medium">{error}</div>
    );

  return (
    <div className="flex flex-col overflow-hidden">
      <div className="shrink-0 pt-4 pb-2 px-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-[#FFACAC] bg-clip-text text-transparent mb-2">
            Debate Summary
          </h1>
          <Button
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center gap-2"
          >
            {downloading ? (
              <Loader2 className="animate-spin h-4 w-4" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            {downloading ? "Generating..." : "Download PDF"}
          </Button>
        </div>
      </div>

      <div className="overflow-y-auto overflow-x-hidden min-h-0">
        <div className="p-4 space-y-4">
          <Card className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-[#E45A92]/50 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-base md:text-lg font-bold text-[#FFACAC]">
                For (Pros)
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-300">
              {summary?.pros || "No data"}
            </CardContent>
          </Card>

          {/* CONS */}
          <Card className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-[#E45A92]/50 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-base md:text-lg font-bold text-[#FFACAC]">
                Against (Cons)
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-300">
              {summary?.cons || "No data"}
            </CardContent>
          </Card>

          {/* NEUTRAL */}
          <Card className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:border-[#E45A92]/50 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-base md:text-lg font-bold text-[#FFACAC]">
                Neutral
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-300">
              {summary?.neutral?.summary_text || "No data"}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SummaryAndReport;
