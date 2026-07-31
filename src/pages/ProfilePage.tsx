import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Award, 
  Layers, 
  Shield, 
  CheckCircle2, 
  ChevronRight, 
  Edit3, 
  Camera, 
  Eye, 
  Trash2, 
  Upload, 
  MapPin, 
  Phone, 
  Calendar, 
  Globe
} from 'lucide-react';
import { useAppState } from '../context/AppState';
import { Card } from '../components/UI/Card';
import { Button } from '../components/UI/Button';

export const ProfilePage: React.FC = () => {
  const { 
    userProfile, 
    updateUserProfile, 
    documents, 
    setIsEditProfileOpen, 
    setIsAvatarLightboxOpen 
  } = useAppState();

  const [activeSubTab, setActiveSubTab] = useState<'skills' | 'projects' | 'credentials'>('skills');
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const processedDocs = documents.filter(d => d.status === 'done');
  
  // Combine custom user profile skills with document extracted skills
  const allSkills = Array.from(new Set([...userProfile.skills, ...processedDocs.flatMap(d => d.skills)]));
  const allProjects = Array.from(new Set(processedDocs.flatMap(d => d.projects)));
  const allCertificates = Array.from(new Set(processedDocs.flatMap(d => d.certificates)));
  const allAchievements = Array.from(new Set(processedDocs.flatMap(d => d.achievements)));
  const allEducation = Array.from(new Set(processedDocs.flatMap(d => d.education)));

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          updateUserProfile({ avatarUrl: event.target.result as string });
          setShowAvatarMenu(false);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-8 w-full">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-50 pb-6">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Identity Profile</h2>
          <p className="text-xs font-semibold text-slate-400 mt-1">
            Decentralized unified record of verified digital footprints and user attributes.
          </p>
        </div>

        <Button
          onClick={() => setIsEditProfileOpen(true)}
          icon={<Edit3 className="w-4 h-4" />}
          className="max-w-[150px]"
        >
          Edit Profile
        </Button>
      </header>

      {/* Main Profile Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Avatar & Profile stats (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="text-center p-8 space-y-6 bg-gradient-to-tr from-slate-50 to-white relative overflow-visible">
            
            {/* Avatar Container with Camera Hover Overlay */}
            <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-blue via-brand-cyan to-brand-purple opacity-30 rounded-full blur-md animate-pulse" />
              
              <div 
                className="relative w-24 h-24 rounded-full group cursor-pointer"
                onClick={() => setShowAvatarMenu(!showAvatarMenu)}
              >
                <img 
                  src={userProfile.avatarUrl} 
                  alt={userProfile.fullName} 
                  className="w-full h-full rounded-full border-2 border-white shadow-md object-cover relative z-10"
                />
                
                {/* Camera icon overlay on hover */}
                <div className="absolute inset-0 rounded-full bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white z-20 transition-opacity">
                  <Camera className="w-6 h-6" />
                </div>
              </div>

              {/* Avatar Action Popover */}
              <AnimatePresence>
                {showAvatarMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                    className="absolute top-28 left-1/2 -translate-x-1/2 w-48 bg-white border border-slate-100 rounded-2xl shadow-xl p-1.5 z-50 text-left"
                  >
                    <button
                      onClick={() => {
                        setShowAvatarMenu(false);
                        avatarInputRef.current?.click();
                      }}
                      className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5 text-brand-blue" />
                      Change Photo
                    </button>

                    <button
                      onClick={() => {
                        setShowAvatarMenu(false);
                        setIsAvatarLightboxOpen(true);
                      }}
                      className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 text-brand-purple" />
                      View Full Image
                    </button>

                    <button
                      onClick={() => {
                        setShowAvatarMenu(false);
                        updateUserProfile({ avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80' });
                      }}
                      className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-semibold text-red-500 hover:bg-red-50 rounded-xl transition-colors border-t border-slate-50 mt-1"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-500" />
                      Remove Photo
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarFileChange}
              />
            </div>

            {/* User Title details */}
            <div className="space-y-1">
              <h3 className="text-xl font-extrabold text-slate-800 tracking-tight">{userProfile.fullName}</h3>
              <p className="text-xs font-bold text-brand-blue">{userProfile.preferredRole}</p>
              <p className="text-xs font-semibold text-slate-400 max-w-xs mx-auto mt-1">{userProfile.headline}</p>
            </div>

            {/* Bio Card */}
            {userProfile.bio && (
              <p className="text-xs font-semibold text-slate-600 leading-relaxed bg-white border border-slate-100 p-4 rounded-2xl text-left">
                "{userProfile.bio}"
              </p>
            )}

            {/* Extended Info Table */}
            <div className="pt-3 border-t border-slate-100/60 space-y-2.5 text-xs font-semibold text-slate-500 text-left">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="truncate">{userProfile.email}</span>
              </div>

              {userProfile.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{userProfile.phone}</span>
                </div>
              )}

              {userProfile.location && (
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{userProfile.location}</span>
                </div>
              )}

              {userProfile.dob && (
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Born: {userProfile.dob}</span>
                </div>
              )}

              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Identity key: PM-8822-ENC</span>
              </div>
            </div>

            {/* Social URL shortcuts */}
            <div className="flex justify-center gap-3 pt-2">
              {userProfile.linkedin && (
                <a 
                  href={userProfile.linkedin} 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 text-slate-600 transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.74a1.45 1.45 0 1 0 0 2.9 1.45 1.45 0 0 0 0-2.9z"/>
                  </svg>
                </a>
              )}
              {userProfile.github && (
                <a 
                  href={userProfile.github} 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 text-slate-600 transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                  </svg>
                </a>
              )}
              {userProfile.portfolio && (
                <a 
                  href={userProfile.portfolio} 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 text-slate-600 transition-colors"
                >
                  <Globe className="w-4 h-4" />
                </a>
              )}
            </div>

          </Card>
        </div>

        {/* Right Column: Tabbed aggregated achievements list (lg:col-span-8) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Sub Navigation tabs */}
          <div className="flex gap-6 border-b border-slate-100 pb-3">
            <button 
              onClick={() => setActiveSubTab('skills')}
              className={`text-xs font-bold uppercase tracking-wider pb-2 border-b-2 transition-all ${
                activeSubTab === 'skills' 
                  ? 'border-brand-blue text-brand-blue' 
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              Skills Mapped ({allSkills.length})
            </button>
            <button 
              onClick={() => setActiveSubTab('projects')}
              className={`text-xs font-bold uppercase tracking-wider pb-2 border-b-2 transition-all ${
                activeSubTab === 'projects' 
                  ? 'border-brand-blue text-brand-blue' 
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              Projects ({allProjects.length})
            </button>
            <button 
              onClick={() => setActiveSubTab('credentials')}
              className={`text-xs font-bold uppercase tracking-wider pb-2 border-b-2 transition-all ${
                activeSubTab === 'credentials' 
                  ? 'border-brand-blue text-brand-blue' 
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              Credentials ({allCertificates.length + allAchievements.length})
            </button>
          </div>

          {/* Tab contents */}
          <div className="pt-2">
            
            {activeSubTab === 'skills' && (
              <Card className="space-y-4">
                <div className="flex items-center gap-2 text-slate-400">
                  <Layers className="w-4 h-4 text-brand-blue" />
                  <span className="text-[11px] font-bold uppercase tracking-wider">Linguistic Skills Graph</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {allSkills.length === 0 ? (
                    <span className="text-xs font-semibold text-slate-400">No skills mapped. Click "Edit Profile" to add skills.</span>
                  ) : (
                    allSkills.map((skill, idx) => (
                      <span 
                        key={idx} 
                        className="px-3.5 py-1.5 rounded-xl bg-blue-50/50 border border-blue-100/40 text-xs font-bold text-brand-blue hover:bg-blue-50 transition-colors"
                      >
                        {skill}
                      </span>
                    ))
                  )}
                </div>
              </Card>
            )}

            {activeSubTab === 'projects' && (
              <div className="space-y-4">
                {allProjects.length === 0 ? (
                  <Card className="text-center py-8">
                    <span className="text-xs font-semibold text-slate-400">No projects indexed in baseline.</span>
                  </Card>
                ) : (
                  allProjects.map((proj, idx) => (
                    <Card key={idx} hoverEffect className="p-5 flex justify-between items-center">
                      <div>
                        <h4 className="text-xs font-bold text-slate-800">{proj}</h4>
                        <p className="text-[10px] text-slate-400 font-semibold mt-1">Status: Indexed in Timeline</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-300" />
                    </Card>
                  ))
                )}
              </div>
            )}

            {activeSubTab === 'credentials' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Certificates */}
                <Card className="space-y-4">
                  <div className="flex items-center gap-2 text-slate-400">
                    <CheckCircle2 className="w-4 h-4 text-brand-purple" />
                    <span className="text-[11px] font-bold uppercase tracking-wider">Certificates</span>
                  </div>
                  <div className="space-y-3">
                    {allCertificates.length === 0 ? (
                      <div className="text-xs font-semibold text-slate-400 py-4">No certificates synced.</div>
                    ) : (
                      allCertificates.map((cert, idx) => (
                        <div key={idx} className="flex gap-2.5 items-start text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-100 p-2.5 rounded-xl">
                          <CheckCircle2 className="w-4 h-4 text-brand-purple shrink-0 mt-0.5" />
                          <span>{cert}</span>
                        </div>
                      ))
                    )}
                  </div>
                </Card>

                {/* Achievements & Academic Nodes */}
                <Card className="space-y-4">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Award className="w-4 h-4 text-brand-cyan" />
                    <span className="text-[11px] font-bold uppercase tracking-wider">Achievements & Academic Nodes</span>
                  </div>
                  <div className="space-y-3">
                    {allAchievements.map((ach, idx) => (
                      <div key={idx} className="text-xs font-semibold text-slate-700 leading-relaxed border-b border-slate-50 pb-2 last:border-0 last:pb-0">
                        {ach}
                      </div>
                    ))}
                    {allEducation.map((edu, idx) => (
                      <div key={idx} className="text-xs font-semibold text-slate-500 leading-relaxed italic">
                        {edu}
                      </div>
                    ))}
                  </div>
                </Card>

              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};
