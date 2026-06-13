"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Search, Activity, Instagram, Facebook, Twitter } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Dashboard } from "@/components/Dashboard";

export default function Home() {
  const [username, setUsername] = useState("");
  const [newsText, setNewsText] = useState("");
  const [platform, setPlatform] = useState<"instagram" | "x" | "facebook">("instagram");
  const [mode, setMode] = useState<"profile" | "news">("profile");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'profile' && !username.trim()) return;
    if (mode === 'news' && !newsText.trim()) return;
    
    setIsAnalyzing(true);
    
    try {
      const endpoint = mode === 'profile' ? '/api/analyze' : '/api/fake-news';
      const bodyPayload = mode === 'profile' 
        ? { username, platform } 
        : { text: newsText };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyPayload)
      });
      
      if (response.ok) {
        const data = await response.json();
        setResult(data);
      } else {
        const errData = await response.json();
        alert(`Error: ${errData.error || "Failed to analyze"}`);
      }
    } catch (error) {
      alert("Network error. Please try again later.");
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setUsername("");
    setNewsText("");
  };

  return (
    <main className="min-h-screen relative overflow-hidden flex flex-col">
      {/* Dynamic Background Gradients based on platform/mode */}
      <div className={`absolute top-[-20%] left-[-10%] w-[60%] h-[60%] blur-[130px] rounded-full pointer-events-none transition-colors duration-1000 ${mode === 'news' ? 'bg-emerald-600/20' : platform === 'instagram' ? 'bg-neon-purple/20' : platform === 'facebook' ? 'bg-blue-600/20' : 'bg-gray-500/20'}`} />
      <div className={`absolute top-[30%] right-[-10%] w-[50%] h-[50%] blur-[150px] rounded-full pointer-events-none transition-colors duration-1000 ${mode === 'news' ? 'bg-emerald-400/15' : platform === 'instagram' ? 'bg-neon-blue/15' : platform === 'facebook' ? 'bg-blue-400/15' : 'bg-white/10'}`} />
      
      {/* Navbar */}
      <nav className="w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-2 text-2xl font-bold tracking-tight cursor-pointer" onClick={handleReset}>
          <Shield className={`w-8 h-8 transition-colors ${platform === 'instagram' ? 'text-neon-purple' : platform === 'facebook' ? 'text-blue-500' : 'text-white'}`} />
          <span>Insta<span className={platform === 'instagram' ? 'text-neon-blue' : platform === 'facebook' ? 'text-blue-400' : 'text-gray-400'}>Shield</span></span>
        </div>
        <Button variant="ghost" className="hidden sm:inline-flex glowing-text" onClick={() => setShowHowItWorks(true)}>How it works</Button>
      </nav>

      {/* How it Works Modal */}
      <AnimatePresence>
        {showHowItWorks && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-6"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 10 }} 
              animate={{ scale: 1, y: 0 }} 
              exit={{ scale: 0.95, y: 10 }}
              className="w-full max-w-lg p-8 rounded-3xl glass border border-white/10 relative shadow-2xl"
            >
              <button 
                onClick={() => setShowHowItWorks(false)} 
                className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/20 transition-colors text-white"
              >
                ✕
              </button>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Activity className="w-6 h-6 text-neon-blue" />
                How InstaShield Works
              </h2>
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-sm shrink-0">1</div>
                  <div>
                    <h3 className="font-semibold text-white/90">Select a Platform</h3>
                    <p className="text-sm text-foreground/60 leading-relaxed mt-1">Choose between Instagram, X (Twitter), or Facebook to contextualize the analysis model to that specific platform's behavior.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-sm shrink-0">2</div>
                  <div>
                    <h3 className="font-semibold text-white/90">Live Data Fetching</h3>
                    <p className="text-sm text-foreground/60 leading-relaxed mt-1">Our system securely calls public APIs to instantly retrieve real-time data about the account, including follow ratios, post history, and bio patterns.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-sm shrink-0">3</div>
                  <div>
                    <h3 className="font-semibold text-white/90">NLP & Heuristic Analysis</h3>
                    <p className="text-sm text-foreground/60 leading-relaxed mt-1">A proprietary heuristic engine analyzes the data for abnormalities like synthetic usernames, spam keywords, and bot-like follower discrepancies to generate your Fake Probability Score.</p>
                  </div>
                </li>
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 w-full max-w-5xl mx-auto px-6 pt-8 pb-24 flex flex-col relative z-10 justify-center">
        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div
              key="hero"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30, filter: "blur(10px)", scale: 0.95 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="flex flex-col items-center text-center mt-6 md:mt-12"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className={`mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm font-medium shadow-[0_0_15px_rgba(0,240,255,0.2)] transition-colors ${platform === 'instagram' ? 'text-neon-blue' : platform === 'facebook' ? 'text-blue-300' : 'text-gray-300'}`}
              >
                <Activity className="w-4 h-4 animate-pulse" />
                <span>AI-Powered Behavioral Analysis</span>
              </motion.div>
              
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/60">
                {mode === 'profile' ? (
                  <>Detect Fake Profiles <br className="hidden md:block"/> Instantly</>
                ) : (
                  <>Verify News Content <br className="hidden md:block"/> In Real-Time</>
                )}
              </h1>
              <p className="text-lg md:text-xl text-foreground/70 max-w-2xl mb-10">
                {mode === 'profile' 
                  ? "Our advanced engine analyzes usernames, bios, and engagement patterns to give you a highly accurate probability score across platforms."
                  : "Detect sensationalism, clickbait, and suspicious patterns in news articles instantly with our advanced NLP heuristic engine."}
              </p>

              {/* Mode Selector */}
              <div className="flex bg-black/40 p-1 rounded-full mb-8 border border-white/10">
                <button
                  onClick={() => setMode('profile')}
                  className={`px-6 py-2 rounded-full font-medium transition-colors text-sm ${mode === 'profile' ? 'bg-white/20 text-white shadow-lg' : 'text-white/60 hover:text-white'}`}
                >
                  Profile Analysis
                </button>
                <button
                  onClick={() => setMode('news')}
                  className={`px-6 py-2 rounded-full font-medium transition-colors text-sm ${mode === 'news' ? 'bg-emerald-500/80 text-white shadow-lg shadow-emerald-500/30' : 'text-white/60 hover:text-white'}`}
                >
                  Fake News Detection
                </button>
              </div>

              {/* Platform Selector (Only for profile mode) */}
              <AnimatePresence>
                {mode === 'profile' && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex flex-wrap justify-center items-center gap-3 mb-8"
                  >
                    <button 
                      onClick={() => setPlatform("instagram")} 
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all text-sm ${platform === "instagram" ? "bg-neon-purple text-white shadow-[0_0_15px_rgba(176,38,255,0.4)]" : "glass bg-black/40 text-foreground/70 hover:text-white"}`}
                    >
                      <Instagram className="w-4 h-4" /> Instagram
                    </button>
                    <button 
                      onClick={() => setPlatform("x")} 
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all text-sm ${platform === "x" ? "bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.4)]" : "glass bg-black/40 text-foreground/70 hover:text-white"}`}
                    >
                      <Twitter className="w-4 h-4" /> X (Twitter)
                    </button>
                    <button 
                      onClick={() => setPlatform("facebook")} 
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all text-sm ${platform === "facebook" ? "bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]" : "glass bg-black/40 text-foreground/70 hover:text-white"}`}
                    >
                      <Facebook className="w-4 h-4" /> Facebook
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleAnalyze} className={`w-full max-w-2xl relative flex flex-col ${mode === 'profile' ? 'sm:flex-row' : ''} items-center gap-3`}>
                <div className="relative flex-1 w-full">
                  {mode === 'profile' ? (
                    <>
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-foreground/50 text-lg font-medium">
                        @
                      </div>
                      <Input 
                        type="text" 
                        placeholder={`Enter ${platform === 'x' ? 'X' : platform.charAt(0).toUpperCase() + platform.slice(1)} Username`} 
                        className={`pl-10 text-lg h-14 w-full shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-shadow ${platform === 'instagram' ? 'focus:shadow-[0_0_20px_rgba(176,38,255,0.2)] focus-visible:ring-neon-purple focus-visible:border-neon-purple' : platform === 'facebook' ? 'focus:shadow-[0_0_20px_rgba(37,99,235,0.2)] focus-visible:ring-blue-500 focus-visible:border-blue-500' : 'focus:shadow-[0_0_20px_rgba(255,255,255,0.2)] focus-visible:ring-white focus-visible:border-white'}`}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </>
                  ) : (
                    <textarea 
                      placeholder="Paste news headline or article content here..." 
                      className="w-full h-32 p-4 rounded-xl border border-white/10 bg-black/40 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-shadow focus:shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                      value={newsText}
                      onChange={(e) => setNewsText(e.target.value)}
                      required
                    />
                  )}
                </div>
                <Button 
                  type="submit" 
                  className={`h-14 px-8 w-full ${mode === 'profile' ? 'sm:w-auto' : ''} text-lg ${mode === 'news' ? 'bg-emerald-600 hover:bg-emerald-700' : platform === 'x' ? 'bg-white text-black hover:bg-gray-200' : platform === 'facebook' ? 'bg-blue-600 hover:bg-blue-700' : ''}`} 
                  isLoading={isAnalyzing}
                >
                  {!isAnalyzing && <Search className="w-5 h-5 mr-2" />}
                  {isAnalyzing ? "Analyzing" : "Analyze"}
                </Button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
              className="w-full flex justify-center mt-20"
            >
              <Dashboard result={result} onReset={handleReset} platform={platform} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
