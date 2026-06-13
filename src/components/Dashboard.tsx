"use client";

import { RefreshCcw, AlertTriangle, CheckCircle, Info, Activity, User, MessageSquare, Instagram, Facebook, Twitter, FileText } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { ProgressCircle } from "@/components/ui/ProgressCircle";
import { Button } from "@/components/ui/Button";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Tooltip } from "recharts";

interface DashboardProps {
  result: any;
  onReset: () => void;
  platform: "instagram" | "x" | "facebook";
}

export function Dashboard({ result, onReset, platform }: DashboardProps) {
  const isNews = result.type === 'news';
  const platformColor = isNews ? '#10b981' : platform === 'instagram' ? 'var(--color-neon-purple)' : platform === 'facebook' ? '#2563eb' : '#ffffff';
  const PlatformIcon = isNews ? FileText : platform === 'instagram' ? Instagram : platform === 'facebook' ? Facebook : Twitter;

  const chartData = isNews ? [
    { subject: 'Sensationalism', A: Math.min(result.fakeScore + 20, 100), fullMark: 100 },
    { subject: 'Objectivity', A: 100 - result.fakeScore, fullMark: 100 },
    { subject: 'Formatting', A: Math.max(result.fakeScore - 10, 0), fullMark: 100 },
    { subject: 'Sources', A: 80, fullMark: 100 },
    { subject: 'Clickbait', A: result.fakeScore, fullMark: 100 },
  ] : [
    { subject: 'Username', A: 85, fullMark: 100 },
    { subject: 'Bio Content', A: 90, fullMark: 100 },
    { subject: 'Engagement', A: 45, fullMark: 100 },
    { subject: 'Network', A: 80, fullMark: 100 },
    { subject: 'Activity', A: 70, fullMark: 100 },
  ];

  const getColor = (score: number) => {
    if (score < 40) return "var(--color-success)";
    if (score < 70) return "var(--color-warning)";
    return "var(--color-danger)";
  };

  const scoreColor = getColor(result.fakeScore);

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <PlatformIcon className="w-8 h-8" style={{ color: platformColor }} />
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
              Analysis Results
            </h2>
          </div>
          <p className="text-foreground/60 ml-11">
            {isNews ? (
              <>Report for <span className="text-white font-medium truncate inline-block max-w-[200px] align-bottom">"{result.textPreview}"</span> {result.isSimulated && <span className="ml-2 text-[10px] uppercase tracking-wider font-bold bg-danger/20 border border-danger/30 px-2 py-0.5 rounded-md text-danger/80">Estimated (Live Blocked)</span>}</>
            ) : (
              <>Report for <span className="text-white font-medium">@{result.username}</span> on {platform === 'x' ? 'X' : platform.charAt(0).toUpperCase() + platform.slice(1)} {result.isSimulated && <span className="ml-2 text-[10px] uppercase tracking-wider font-bold bg-danger/20 border border-danger/30 px-2 py-0.5 rounded-md text-danger/80">Estimated (Live Blocked)</span>}</>
            )}
          </p>
        </div>
        <Button variant="secondary" onClick={onReset} className="glowing-border">
          <RefreshCcw className="w-4 h-4 mr-2" />
          Check Another
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Fake Score Meter */}
        <Card className="flex flex-col items-center justify-center text-center">
          <h3 className="text-lg font-medium text-foreground/80 mb-6">Fake Probability</h3>
          <ProgressCircle value={result.fakeScore} color={scoreColor} size={160} strokeWidth={12} />
          <div className="mt-6 flex items-center gap-2">
            {result.fakeScore >= 70 ? (
              <AlertTriangle className="w-5 h-5 text-danger" />
            ) : result.fakeScore >= 40 ? (
              <Info className="w-5 h-5 text-warning" />
            ) : (
              <CheckCircle className="w-5 h-5 text-success" />
            )}
            <span className="font-semibold text-lg" style={{ color: scoreColor }}>
              {result.fakeScore >= 70 ? "Likely Fake" : result.fakeScore >= 40 ? "Suspicious" : "Likely Real"}
            </span>
          </div>
        </Card>

        {/* AI Explanation */}
        <Card className="md:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5" style={{ color: platformColor }} />
              <h3 className="text-lg font-medium">AI Insights (NLP)</h3>
            </div>
            <p className="text-foreground/80 leading-relaxed text-lg">
              {result.explanation}
            </p>
          </div>
          
          <div className="mt-6 p-4 rounded-xl bg-black/20 border border-panel-border/50 flex flex-col">
            <h4 className="text-sm font-medium text-foreground/60 uppercase tracking-wider mb-3">Confidence Level</h4>
            <div className="flex items-center gap-3">
              <div className="h-2 flex-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-1000" style={{ width: result.confidence === 'High' ? '92%' : '65%', backgroundColor: platformColor }} />
              </div>
              <span className="font-bold" style={{ color: platformColor }}>{result.confidence === 'High' ? '92%' : '65%'}</span>
            </div>
            {result.isSimulated && <p className="text-xs text-foreground/40 mt-3 text-right">Data modeled via deterministic behavioral heuristics.</p>}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Key Indicators Panel */}
        <Card>
          <div className="flex items-center gap-2 mb-6">
            <User className="w-5 h-5" style={{ color: platformColor }} />
            <h3 className="text-lg font-medium">{isNews ? 'Content Metrics' : 'Key Indicators'}</h3>
          </div>
          <div className="space-y-4">
            {result.indicators.map((ind: any, i: number) => (
              <div key={i} className="flex flex-col xl:flex-row xl:items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
                <div>
                  <div className="font-medium">{ind.label}</div>
                  <div className="text-sm text-foreground/60">{ind.value}</div>
                </div>
                <div className={`mt-2 xl:mt-0 px-3 py-1 rounded-full text-xs font-semibold self-start xl:self-auto ${
                  ind.risk === 'Suspicious' || ind.risk === 'Spammy' || ind.risk === 'Abnormal' ? 'bg-danger/20 text-danger' :
                  ind.risk === 'Moderate' ? 'bg-warning/20 text-warning' : 'bg-success/20 text-success'
                }`}>
                  {ind.risk}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Risk Breakdown Chart */}
        <Card>
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-5 h-5" style={{ color: platformColor }} />
            <h3 className="text-lg font-medium">Risk Breakdown</h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                <PolarGrid stroke="var(--color-panel-border)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--foreground)', fontSize: 12, opacity: 0.7 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--color-dark-bg)', borderColor: 'var(--color-panel-border)', borderRadius: '8px' }}
                  itemStyle={{ color: platformColor }}
                />
                <Radar
                  name="Risk Score"
                  dataKey="A"
                  stroke={platformColor}
                  fill={platformColor}
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
