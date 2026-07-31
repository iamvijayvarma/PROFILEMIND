import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Briefcase, Award, Globe } from 'lucide-react';
import { Card } from '../components/UI/Card';

interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  company: string;
  desc: string;
  type: 'education' | 'career' | 'award' | 'project';
  tags: string[];
}

export const JourneyTimeline: React.FC = () => {
  const events: TimelineEvent[] = [
    {
      id: 'e-1',
      date: 'July 2026',
      title: 'Identity Synthesis Completed',
      company: 'ProfileMind Engine',
      desc: 'Mapped Stanford records, GitHub contributions, and technical writing baseline into a unified digital double.',
      type: 'project',
      tags: ['Neural Maps', 'Identity Graph']
    },
    {
      id: 'e-2',
      date: 'June 2026',
      title: 'Technical UI Architect migration',
      company: 'Veridian Softworks',
      desc: 'Pioneered migration of complex layout architectures into a declarative component system, reducing paint times by 42%.',
      type: 'career',
      tags: ['Interface Architecture', 'Performance Design']
    },
    {
      id: 'e-3',
      date: 'May 2025',
      title: 'HackAlpha Stanford Winner',
      company: 'Stanford AI Group',
      desc: 'Won first place for best AI pipeline integration by constructing a real-time semantic audio translation layer.',
      type: 'award',
      tags: ['Speech Synthesis', 'Product Prototyping']
    },
    {
      id: 'e-4',
      date: 'January 2025',
      title: 'B.S. Computer Science Graduate',
      company: 'Stanford University',
      desc: 'Graduated with concentration in human-computer interfaces and asynchronous network systems.',
      type: 'education',
      tags: ['Linguistic Systems', 'UI Design']
    },
    {
      id: 'e-5',
      date: 'June 2024',
      title: 'Interface Systems Intern',
      company: 'Cognitive Designs Inc.',
      desc: 'Designed interactive widgets and dashboard assets for homomorphic encryption management systems.',
      type: 'career',
      tags: ['Security UX', 'Framer Prototypes']
    }
  ];

  const icons = {
    education: <GraduationCap className="w-5 h-5 text-brand-blue" />,
    career: <Briefcase className="w-5 h-5 text-brand-cyan" />,
    award: <Award className="w-5 h-5 text-brand-purple" />,
    project: <Globe className="w-5 h-5 text-brand-blue" />
  };

  const borderColors = {
    education: 'border-blue-100',
    career: 'border-cyan-100',
    award: 'border-purple-100',
    project: 'border-slate-100'
  };


  return (
    <div className="space-y-8 w-full">
      <header className="border-b border-slate-50 pb-6">
        <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Journey Timeline</h2>
        <p className="text-xs font-semibold text-slate-400 mt-1">
          Chronological synthesis of your academic, professional, and cryptographic baseline events.
        </p>
      </header>

      {/* Vertical Timeline container */}
      <div className="relative max-w-2xl mx-auto py-8">
        
        {/* Central Vertical Line */}
        <div className="absolute left-6 top-0 bottom-0 w-[2px] bg-slate-100/70" />

        <div className="space-y-12">
          {events.map((event, idx) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="relative pl-16 flex flex-col md:flex-row md:items-start justify-between gap-6 group"
            >
              
              {/* Event Circle Bullet on vertical line */}
              <div className={`absolute left-2.5 top-0 w-7 h-7 rounded-full bg-white border-2 flex items-center justify-center shadow-sm z-10 transition-transform duration-300 group-hover:scale-110 ${
                event.type === 'education' ? 'border-brand-blue' : event.type === 'career' ? 'border-brand-cyan' : event.type === 'award' ? 'border-brand-purple' : 'border-slate-400'
              }`}>
                {icons[event.type]}
              </div>

              {/* Date Column (renders above/besides card depending on width) */}
              <div className="md:w-32 shrink-0 pt-1">
                <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider bg-slate-50 border border-slate-100/50 px-3 py-1.5 rounded-xl">
                  {event.date}
                </span>
              </div>

              {/* Event Card Content */}
              <Card hoverEffect className={`flex-1 border p-6 ${borderColors[event.type]} bg-white shadow-premium`}>
                <div className="space-y-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 group-hover:text-brand-blue transition-colors">{event.title}</h3>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{event.company}</p>
                  </div>
                  
                  <p className="text-xs font-semibold text-slate-500 leading-relaxed">
                    {event.desc}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {event.tags.map((tag, tIdx) => (
                      <span key={tIdx} className={`px-2.5 py-1 rounded-lg text-[9px] font-bold ${
                        event.type === 'education' ? 'bg-blue-50/50 text-brand-blue' : event.type === 'career' ? 'bg-cyan-50/50 text-brand-cyan' : event.type === 'award' ? 'bg-purple-50/50 text-brand-purple' : 'bg-slate-50 text-slate-500'
                      }`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>

            </motion.div>
          ))}
        </div>

      </div>

    </div>
  );
};
