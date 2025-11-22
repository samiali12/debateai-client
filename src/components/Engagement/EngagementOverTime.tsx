"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TimePoint } from '@/types/engagement';

interface EngagementOverTimeProps {
  data: TimePoint[];
}

export default function EngagementOverTime({ data }: EngagementOverTimeProps) {
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
          <p className="text-sm font-medium text-gray-900">{`Time: ${label}`}</p>
          <p className="text-sm text-blue-600">
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
        <CardTitle className='text-gray-300'>Engagement Over Time</CardTitle>
        <CardDescription>
          Message frequency throughout the debate
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart className='text-gray-300' data={formattedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="formattedTime" 
                 tick={{ fontSize: 12, fill: "#ffffff" }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis  tick={{ fontSize: 12, fill: "#ffffff" }} />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#1d4ed8' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}