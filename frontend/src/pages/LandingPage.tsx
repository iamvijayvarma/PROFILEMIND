import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Network, Compass, Sparkles, ArrowRight, Play, Check } from 'lucide-react';
import { useAppState } from '../context/AppState';
import { Button } from '../components/UI/Button';
import { Card } from '../components/UI/Card';

export const LandingPage: React.FC = () => {
  const { setCurrentPage, addToast } = useAppState();

  const features = [
    {
      icon: <Brain className="w-6 h-6 text-brand-blue" />,
      title: "AI Understanding",
      desc: "Deep semantic mapping of resumes, certificates, and achievements beyond key-matching."
    },
    {
      icon: <Network className="w-6 h-6 text-brand-cyan" />,
      title: "Smart Connections",
      desc: "Maps overlap between project stacks, academic vectors, and enterprise timelines."
    },
    {
      icon: <Compass className="w-6 h-6 text-brand-purple" />,
      title: "Journey Timeline",
      desc: "Chronological visualization of your growth archetype with interactive progress nodes."
    },
    {
      icon: <Sparkles className="w-6 h-6 text-brand-purple" />,
      title: "Nova Assistant",
      desc: "An intelligent dialogue interface referencing only your authorized digital records."
    }
  ];

  return (
    <div className="min-h-screen w-full flex flex-col justify-between py-12 px-6 relative bg-white overflow-y-auto no-scrollbar">
      
      {/* Dynamic Header */}
      <header className="max-w-6xl mx-auto w-full flex justify-between items-center z-10 mb-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-blue to-brand-purple flex items-center justify-center text-white font-extrabold text-xs shadow-md">
            PM
          </div>
          <span className="font-extrabold text-sm tracking-tight text-slate-800">ProfileMind</span>
        </div>
        
        <button 
          onClick={() => setCurrentPage('login')}
          className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
        >
          Sign In
        </button>
      </header>

      {/* Main Hero & Content Grid */}
      <main className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-10 flex-1">
        
        {/* Left column: Headings and CTAs */}
        <div className="lg:col-span-7 space-y-8 text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100/50 text-[10px] font-bold text-brand-blue uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-brand-blue animate-pulse" />
              Digital Identity Redefined
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-800 leading-tight">
              Your AI-Powered <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-brand-blue via-brand-cyan to-brand-purple bg-clip-text text-transparent">
                Digital Identity
              </span>
            </h1>
            
            <p className="text-base sm:text-lg text-slate-500 font-medium leading-relaxed max-w-xl">
              Upload your achievements once. Let AI understand them forever. We synthesize resumes, papers, and credentials into an interactive cognitive memory graph.
            </p>
          </motion.div>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 max-w-md"
          >
            <Button 
              onClick={() => setCurrentPage('login')}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Get Started
            </Button>
            <Button 
              variant="secondary" 
              onClick={() => addToast('Simulating demo walkthrough...', 'info')}
              icon={<Play className="w-4 h-4 fill-current" />}
            >
              Watch Demo
            </Button>
          </motion.div>

          {/* Core Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4">
            {features.map((feat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + idx * 0.1, duration: 0.6 }}
              >
                <Card hoverEffect className="p-5 flex gap-4 h-full items-start">
                  <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl shrink-0">
                    {feat.icon}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-800">{feat.title}</h4>
                    <p className="text-[11px] text-slate-400 font-semibold leading-relaxed">{feat.desc}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right column: Beautiful responsive mobile frame mockup */}
        <div className="lg:col-span-5 flex justify-center z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 1.0 }}
            className="relative w-[280px] sm:w-[320px] aspect-[9/19.5] bg-slate-900 border-[10px] border-slate-950 rounded-[44px] shadow-2xl overflow-hidden"
          >
            {/* Apple Bezel Notch Details */}
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-30" />
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-28 h-1 bg-white/30 rounded-full z-30" />

            {/* Mock phone interface screen details */}
            <div className="absolute inset-0 bg-white p-6 flex flex-col justify-between pt-12">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200" />
                    <div>
                      <div className="h-2 w-14 bg-slate-200 rounded" />
                      <div className="h-1.5 w-8 bg-slate-100 rounded mt-1" />
                    </div>
                  </div>
                  <div className="h-5 w-5 bg-slate-50 border border-slate-100 rounded-full" />
                </div>

                {/* Orb visual preview */}
                <div className="h-28 bg-slate-50 border border-slate-100/50 rounded-2xl flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-brand-blue/10 via-brand-cyan/5 to-brand-purple/10 blur-xl" />
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-brand-cyan to-brand-purple opacity-40 blur-md animate-pulse" />
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow">
                    <Sparkles className="w-3.5 h-3.5 text-brand-blue" />
                  </div>
                </div>

                {/* Stats */}
                <div className="space-y-2">
                  <div className="h-3 w-1/2 bg-slate-200 rounded" />
                  <div className="h-2 w-full bg-slate-100 rounded" />
                  <div className="h-2 w-5/6 bg-slate-100 rounded" />
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  <span className="px-2 py-1 rounded bg-blue-50 border border-blue-100/50 text-[8px] font-bold text-brand-blue">React</span>
                  <span className="px-2 py-1 rounded bg-cyan-50 border border-cyan-100/50 text-[8px] font-bold text-brand-cyan">Vite</span>
                  <span className="px-2 py-1 rounded bg-purple-50 border border-purple-100/50 text-[8px] font-bold text-brand-purple">Framer</span>
                </div>
              </div>

              {/* Float badge */}
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="h-2 w-20 bg-slate-200 rounded" />
                  <div className="h-1.5 w-12 bg-slate-100 rounded mt-1" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Beautiful Footer */}
      <footer className="max-w-6xl mx-auto w-full border-t border-slate-100 pt-8 mt-12 flex flex-col sm:flex-row justify-between items-center gap-4 z-10">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
          © 2026 ProfileMind. Decentralized Identity Synthesizer.
        </div>
        <div className="flex gap-6 text-xs font-semibold text-slate-400">
          <a href="#" className="hover:text-slate-700 transition-colors">Privacy Encryption</a>
          <a href="#" className="hover:text-slate-700 transition-colors">Security Protocol</a>
        </div>
      </footer>

    </div>
  );
};
