"use client";
import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp } from "lucide-react";

const data = [
  { month: "Yan", price: 4200 },
  { month: "Fev", price: 4100 },
  { month: "Mar", price: 4300 },
  { month: "Apr", price: 4500 },
  { month: "May", price: 4400 },
  { month: "İyun", price: 4700 },
];

export function PriceStats({ currentPrice }: { currentPrice: string }) {
  const marketAvg = 4450;
  const priceDiff = ((Number(currentPrice) - marketAvg) / marketAvg) * 100;

  return (
    <div className='bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-6'>
      <div className='flex items-center justify-between'>
        <h3 className='text-lg font-bold text-gray-800 flex items-center gap-2'>
          <TrendingUp className='text-orange-500 h-5 w-5' />
          Bazar Analizi
        </h3>
        <div className='text-sm text-gray-500 font-bold'>
          Bazar Ortalaması:{" "}
          <span className='text-orange-600'>
            {marketAvg.toLocaleString()} €
          </span>
        </div>
      </div>

      {/* Point 27: Competitor Analysis Comparison */}
      <div className='space-y-2'>
        <div className='flex justify-between text-[10px] font-black uppercase tracking-wider'>
          <span className='text-gray-400'>Sizin Qiyməti</span>
          <span className={priceDiff > 0 ? "text-red-500" : "text-green-500"}>
            {priceDiff > 0 ? "+" : ""}
            {priceDiff.toFixed(1)}% rəqiblərdən
          </span>
        </div>
        <div className='h-2 w-full bg-gray-100 rounded-full overflow-hidden flex'>
          <div
            className={`h-full transition-all duration-1000 ${priceDiff > 0 ? "bg-red-400" : "bg-green-400"}`}
            style={{
              width: `${Math.min(100, (Number(currentPrice) / (marketAvg * 1.5)) * 100)}%`,
            }}
          />
        </div>
      </div>

      <div className='h-[180px] w-full'>
        <ResponsiveContainer width='100%' height='100%'>
          <AreaChart data={data}>
            <defs>
              <linearGradient id='colorPrice' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='5%' stopColor='#f97316' stopOpacity={0.2} />
                <stop offset='95%' stopColor='#f97316' stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray='3 3'
              vertical={false}
              stroke='#f1f5f9'
            />
            <XAxis
              dataKey='month'
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: "bold" }}
              dy={10}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "16px",
                border: "none",
                boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                fontSize: "12px",
                fontWeight: "bold",
              }}
            />
            <Area
              type='monotone'
              dataKey='price'
              stroke='#f97316'
              strokeWidth={4}
              fillOpacity={1}
              fill='url(#colorPrice)'
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <p className='text-[10px] text-gray-400 text-center uppercase font-black tracking-widest'>
        Son 6 ayın orta qiymət dəyişməsi
      </p>
    </div>
  );
}
