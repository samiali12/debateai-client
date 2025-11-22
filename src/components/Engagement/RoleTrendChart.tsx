"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RoleTrendPoint } from '@/types/engagement';

interface RoleTrendChartProps {
  data: RoleTrendPoint[];
}

export default function RoleTrendChart({ data }: RoleTrendChartProps) {
  const formattedData = data.map(item => ({
    ...item,
    formattedTime: new Date(item.timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg border shadow-sm">
          <p className="text-sm font-medium text-gray-900 mb-2">{`Time: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p 
              key={index} 
              className="text-sm"
              style={{ color: entry.color }}
            >
              {entry.name}: <span className="font-semibold">{entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Position Trends</CardTitle>
        <CardDescription>
          Evolution of argument positions over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={formattedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="formattedTime" 
                tick={{ fontSize: 12, fill: "#ffffff" }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis tick={{ fontSize: 12, fill: "#ffffff" }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="for_count" 
                name="For"
                stroke="#10b981" 
                strokeWidth={2}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Line 
                type="monotone" 
                dataKey="against_count" 
                name="Against"
                stroke="#ef4444" 
                strokeWidth={2}
                dot={{ fill: '#ef4444', strokeWidth: 2, r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Line 
                type="monotone" 
                dataKey="neutral_count" 
                name="Neutral"
                stroke="#ffffff" 
                strokeWidth={2}
                dot={{ fill: '#fffffff', strokeWidth: 2, r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}