"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserActivity } from '@/types/engagement';

interface UserActivityChartProps {
  data: UserActivity[];
}

export default function UserActivityChart({ data }: UserActivityChartProps) {
  const sortedData = [...data].sort((a, b) => b.count - a.count).slice(0, 10);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg border shadow-sm">
          <p className="text-sm font-medium text-gray-900">{`User: ${label}`}</p>
          <p className="text-sm text-green-600">
            Messages: <span className="font-semibold">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Top Contributors</CardTitle>
        <CardDescription>
          Most active participants in the debate
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sortedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12, fill: "#ffffff" }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis tick={{ fontSize: 12, fill: "#ffffff" }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="count" 
                fill="#10b981"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}