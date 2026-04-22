"use client";

import { useState, useEffect, useMemo } from "react";
import { GlassCard } from "@/components/GlassCard";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";
import { 
  CheckCircle2, 
  Trophy,
  Database,
  Info
} from "lucide-react";
import { motion } from "framer-motion";

export default function ModelComparison() {
  const [modelMetrics, setModelMetrics] = useState<any[]>([]);
  const [featureImportance, setFeatureImportance] = useState<any[]>([]);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const res = await fetch("http://localhost:8001/model-comparison");
        if (res.ok) {
          const json = await res.json();
          setModelMetrics(json.map((m: any) => ({
            name: m.model_name,
            mae: m.mae,
            rmse: m.rmse,
          })));
        }
      } catch (e) {
        setModelMetrics([]);
      }
    };

    const fetchFeatures = async () => {
      try {
        const res = await fetch("http://localhost:8001/feature-importance");
        if (res.ok) {
          const json = await res.json();
          setFeatureImportance(json.map((f: any) => ({
            name: f.feature,
            score: f.importance,
            type: f.feature.includes("(Out)") || f.feature.includes("Ext") || f.feature.includes("Moon") ? "External" : "Internal"
          })));
        }
      } catch (e) {
        setFeatureImportance([]);
      }
    };

    fetchModels();
    fetchFeatures();
  }, []);

  const bestModel = useMemo(() => {
    if (!modelMetrics.length) return null;
    return modelMetrics.reduce((b, m) => (m.mae < b.mae ? m : b), modelMetrics[0]);
  }, [modelMetrics]);

  return (
    <div className="space-y-8 pb-12">
      <header>
        <h1 className="text-4xl font-bold text-white mb-2">Integrated Intelligence</h1>
        <p className="text-slate-400">
          Comparing {modelMetrics.length} algorithms trained on multi-source environmental data.{" "}
          {bestModel && (
            <span className="text-accent-purple font-semibold">{bestModel.name} is the optimal predictor.</span>
          )}
        </p>
      </header>

      {/* Model Cards */}
      <div className={`grid grid-cols-1 gap-6 ${modelMetrics.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2 lg:grid-cols-4"}`}>
        {modelMetrics.map((model, idx) => {
          const isBest = bestModel?.name === model.name;
          return (
            <motion.div
              key={model.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <GlassCard className={`text-center p-8 relative ${isBest ? "ring-1 ring-accent-purple/40" : ""}`} glow={isBest ? "purple" : "none"}>
                {isBest && (
                  <div className="absolute top-4 right-4">
                    <Trophy className="w-4 h-4 text-accent-purple" />
                  </div>
                )}
                <p className="text-slate-400 text-sm mb-3">{model.name}</p>
                <h2 className="text-3xl font-bold text-white mb-1 font-mono">{model.mae}</h2>
                <p className="text-xs text-slate-500 font-medium mb-1">MAE</p>
                <p className="text-xs text-slate-600 font-mono">RMSE {model.rmse}</p>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <motion.div className="lg:col-span-2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <GlassCard title="Error Distribution" subtitle="Lower values represent higher accuracy">
            <div className="h-[350px] w-full mt-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={modelMetrics}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{ fill: '#ffffff05' }} contentStyle={{ backgroundColor: "#0f172a", borderRadius: "16px", border: "1px solid #ffffff20" }} />
                  <Legend />
                  <Bar dataKey="mae" name="MAE" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="rmse" name="RMSE" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div className="lg:col-span-3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <GlassCard title="Global Feature Drivers" subtitle="Multi-source correlation analysis" glow="purple">
            <div className="h-[550px] w-full mt-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={featureImportance} layout="vertical" margin={{ left: 60, right: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" horizontal={false} />
                  <XAxis type="number" stroke="#94a3b8" fontSize={10} tickFormatter={(v) => v.toFixed(2)} />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    stroke="#94a3b8" 
                    fontSize={11} 
                    tickLine={false} 
                    axisLine={false}
                    width={120}
                  />
                  <Tooltip 
                    cursor={{ fill: '#ffffff05' }}
                    contentStyle={{ backgroundColor: "#0f172a", borderRadius: "12px", border: "1px solid #ffffff20" }}
                    formatter={(v: any) => [v.toFixed(4), "Importance"]}
                  />
                  <Bar dataKey="score" name="Importance" radius={[0, 4, 4, 0]}>
                    {featureImportance.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.type === "External" ? "#06b6d4" : "#8b5cf6"} 
                        fillOpacity={1 - (index * 0.03)}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex items-center justify-center gap-6 text-[10px] font-bold uppercase tracking-widest">
              <div className="flex items-center gap-2 text-[#8b5cf6]"><div className="w-3 h-3 bg-[#8b5cf6] rounded-sm" /> Internal Sensors</div>
              <div className="flex items-center gap-2 text-[#06b6d4]"><div className="w-3 h-3 bg-[#06b6d4] rounded-sm" /> External Context</div>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <GlassCard className="p-6 border-accent-purple/20 bg-accent-purple/5">
          <div className="flex items-start gap-4">
             <div className="p-2 bg-accent-purple/20 rounded-lg text-accent-purple"><Info className="w-5 h-5" /></div>
             <div className="space-y-1">
               <h4 className="text-white font-bold">Predictive Methodology</h4>
               <p className="text-sm text-slate-400">
                 These scores are computed using <strong>XGBoost gain-based importance</strong>. We align your nightly sleep windows with the average outdoor conditions captured at the same time, allowing the model to weigh if external AQI or internal temperature was the dominant factor in your morning mood.
               </p>
             </div>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
