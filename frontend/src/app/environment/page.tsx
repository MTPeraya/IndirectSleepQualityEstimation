"use client";

import { useState, useEffect, useMemo } from "react";
import { GlassCard } from "@/components/GlassCard";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area
} from "recharts";
import { 
  Wind, 
  Thermometer, 
  Droplets,
  CloudLightning,
  Sun,
  LayoutGrid,
  Zap
} from "lucide-react";
import { motion } from "framer-motion";

export default function EnvironmentImpact() {
  const [data, setData] = useState<any[]>([]);
  const [trends, setTrends] = useState<any[]>([]);

  useEffect(() => {
    const fetchInternal = async () => {
      try {
        const response = await fetch("http://localhost:8001/environment-impact");
        if (response.ok) setData(await response.json());
      } catch (e) { setData([]); }
    };
    
    const fetchTrends = async () => {
      try {
        const response = await fetch("http://localhost:8001/api/integrated-environmental-trends");
        if (response.ok) setTrends(await response.json());
      } catch (e) { setTrends([]); }
    };

    fetchInternal();
    fetchTrends();
  }, []);

  const insights = useMemo(() => {
    if (!data.length) return null;
    const maxAqiDay = data.reduce((b, d) => d.aqi > b.aqi ? d : b, data[0]);
    const bestSleepDay = data.reduce((b, d) => d.sleep > b.sleep ? d : b, data[0]);
    const avgTemp = (data.reduce((s, d) => s + d.temp, 0) / data.length).toFixed(1);
    return { maxAqiDay, bestSleepDay, avgTemp };
  }, [data]);

  return (
    <div className="space-y-8 pb-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Environmental Impact</h1>
          <p className="text-slate-400">Discover how your bedroom environment tracks with the outside world.</p>
        </div>
      </header>

        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Temp Comparison */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <GlassCard title="Indoor vs Outdoor Temperature" subtitle="How well does your room insulate?" glow="blue">
                <div className="h-[350px] w-full mt-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trends}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
                      <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} unit="°C" />
                      <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderRadius: "16px", border: "1px solid #ffffff20" }} />
                      <Legend />
                      <Line type="monotone" dataKey="indoor_temp" name="Bedroom" stroke="#60a5fa" strokeWidth={3} dot={{ r: 4 }} />
                      <Line type="monotone" dataKey="outdoor_temp" name="Outside" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 0 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>
            </motion.div>

            {/* PM2.5 Comparison */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <GlassCard title="Air Quality Linkage" subtitle="Indoor PM2.5 vs Outdoor AQI" glow="emerald">
                <div className="h-[350px] w-full mt-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trends}>
                      <defs>
                        <linearGradient id="inPm" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
                      <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderRadius: "16px", border: "1px solid #ffffff20" }} />
                      <Legend />
                      <Area type="monotone" dataKey="outdoor_pm25" name="Outside PM2.5" stroke="#94a3b8" fill="#ffffff05" strokeDasharray="3 3" />
                      <Area type="monotone" dataKey="indoor_pm25" name="Bedroom PM2.5" stroke="#10b981" fill="url(#inPm)" strokeWidth={3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>
            </motion.div>
          </div>

          <GlassCard className="p-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-2 text-accent-purple">
                  <Zap className="w-5 h-5" />
                  <h3 className="text-xl font-bold text-white">Integrated Intelligence</h3>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Your dashboard is now performing <strong>temporal alignment</strong> between your local KidBright IoT sensors and global environmental data. This allows our models to understand if your restlessness is caused by a sudden drop in outdoor temperature or a peak in city-wide pollution.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                  <div className="text-2xl font-bold text-white">{trends.length}</div>
                  <div className="text-[10px] uppercase font-bold text-slate-500">Nights Aligned</div>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                  <div className="text-2xl font-bold text-white">7+</div>
                  <div className="text-[10px] uppercase font-bold text-slate-500">Astro-Metrics</div>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
    </div>
  );
}
