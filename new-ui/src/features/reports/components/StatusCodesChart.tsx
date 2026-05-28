import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface StatusCodeData {
  code: string;
  count: number;
}

interface StatusCodesChartProps {
  data: StatusCodeData[];
}

const getBarColor = (code: string): string => {
  if (code.startsWith('2')) return '#4caf50';
  if (code.startsWith('3')) return '#ff9800';
  if (code.startsWith('4')) return '#f44336';
  if (code.startsWith('5')) return '#9c27b0';
  return '#108ee9';
};

const StatusCodesChart: React.FC<StatusCodesChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>No status code data available</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="code" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" name="Count">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getBarColor(entry.code)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default StatusCodesChart;
