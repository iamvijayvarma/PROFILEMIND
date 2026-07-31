import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Camera, Plus, Check, Eye, Edit3, FileText } from 'lucide-react';
import { useAppState } from '../context/AppState';
import { Button } from './UI/Button';
import { Input } from './UI/Input';
import { Card } from './UI/Card';

export const EditProfileModal: React.FC = () => {
  const { 
    userProfile, 
    updateUserProfile, 
    isEditProfileOpen, 
    setIsEditProfileOpen, 
    addToast,
    addDocument
  } = useAppState();

  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

  // Form State initialized with current user profile values
  const [formData, setFormData] = useState({
    fullName: userProfile.fullName,
    headline: userProfile.headline,
    bio: userProfile.bio,
    email: userProfile.email,
    phone: userProfile.phone,
    location: userProfile.location,
    dob: userProfile.dob,
    linkedin: userProfile.linkedin,
    github: userProfile.github,
    portfolio: userProfile.portfolio,
    preferredRole: userProfile.preferredRole,
    avatarUrl: userProfile.avatarUrl,
    skills: [...userProfile.skills]
  });

  const [newSkill, setNewSkill] = useState('');
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);

  // Sync state when modal opens
  React.useEffect(() => {
    if (isEditProfileOpen) {
      setFormData({
        fullName: userProfile.fullName,
        headline: userProfile.headline,
        bio: userProfile.bio,
        email: userProfile.email,
        phone: userProfile.phone,
        location: userProfile.location,
        dob: userProfile.dob,
        linkedin: userProfile.linkedin,
        github: userProfile.github,
        portfolio: userProfile.portfolio,
        preferredRole: userProfile.preferredRole,
        avatarUrl: userProfile.avatarUrl,
        skills: [...userProfile.skills]
      });
      setActiveTab('edit');
    }
  }, [isEditProfileOpen, userProfile]);

  if (!isEditProfileOpen) return null;

  const handleAvatarFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setFormData((prev) => ({ ...prev, avatarUrl: e.target!.result as string }));
        addToast('Avatar photo updated in preview!', 'info');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddSkill = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    if (!newSkill.trim()) return;

    if (!formData.skills.includes(newSkill.trim())) {
      setFormData((prev) => ({ ...prev, skills: [...prev.skills, newSkill.trim()] }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData((prev) => ({ ...prev, skills: prev.skills.filter((s) => s !== skillToRemove) }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile(formData);
    setIsEditProfileOpen(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4">
        {/* Backdrop Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsEditProfileOpen(false)}
          className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        />

        {/* Modal Window Container (Desktop Dialog / Mobile Bottom Sheet) */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
          className="relative w-full max-w-2xl bg-white border border-slate-100 rounded-t-[36px] sm:rounded-3xl shadow-2xl z-10 flex flex-col max-h-[90vh] overflow-hidden"
        >
          {/* Header Bar */}
          <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-brand-purple flex items-center justify-center font-bold text-sm">
                <Edit3 className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-800 tracking-tight">Edit Profile Baseline</h3>
                <p className="text-[10px] font-semibold text-slate-400">Update your identity parameters across the application</p>
              </div>
            </div>

            {/* View Tab Switcher */}
            <div className="flex items-center gap-2">
              <div className="flex p-1 bg-slate-100 rounded-xl text-xs font-semibold">
                <button
                  onClick={() => setActiveTab('edit')}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                    activeTab === 'edit' ? 'bg-white text-slate-800 shadow-sm font-bold' : 'text-slate-500'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => setActiveTab('preview')}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                    activeTab === 'preview' ? 'bg-white text-slate-800 shadow-sm font-bold' : 'text-slate-500'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" /> Live Preview
                </button>
              </div>

              <button
                onClick={() => setIsEditProfileOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>

          {/* Form Content Area */}
          <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6">
            {activeTab === 'edit' ? (
              <form id="edit-profile-form" onSubmit={handleSave} className="space-y-6">
                
                {/* Avatar Photo Upload & Preview Section */}
                <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                  <div className="relative w-24 h-24 rounded-full group shrink-0">
                    <img
                      src={formData.avatarUrl}
                      alt="Avatar Preview"
                      className="w-full h-full rounded-full object-cover border-2 border-white shadow-md"
                    />
                    <button
                      type="button"
                      onClick={() => avatarInputRef.current?.click()}
                      className="absolute inset-0 rounded-full bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity cursor-pointer"
                    >
                      <Camera className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="space-y-2 text-center sm:text-left flex-1">
                    <h4 className="text-xs font-bold text-slate-800">Profile Photo</h4>
                    <p className="text-[10px] text-slate-400 font-semibold">JPG, PNG or WEBP up to 5MB. Photo updates instantly.</p>
                    
                    <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        onClick={() => avatarInputRef.current?.click()}
                        icon={<Upload className="w-3.5 h-3.5" />}
                        className="py-1.5 px-3 max-w-[130px]"
                      >
                        Upload Photo
                      </Button>

                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80' }))}
                        className="text-xs font-semibold text-slate-400 hover:text-red-500 transition-colors px-2"
                      >
                        Reset Photo
                      </button>
                    </div>

                    <input
                      ref={avatarInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleAvatarFile(e.target.files[0]);
                        }
                      }}
                    />
                  </div>
                </div>

                {/* Primary Attributes Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                  />

                  <Input
                    label="Preferred Role / Archetype"
                    value={formData.preferredRole}
                    onChange={(e) => setFormData({ ...formData, preferredRole: e.target.value })}
                    required
                  />
                </div>

                <Input
                  label="Professional Headline"
                  value={formData.headline}
                  onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                  placeholder="e.g. Senior Full Stack & AI Architect"
                  required
                />

                {/* Bio / About Me with character counter */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Bio / About Me</label>
                    <span className={`text-[10px] font-bold ${formData.bio.length > 250 ? 'text-red-500' : 'text-slate-400'}`}>
                      {formData.bio.length} / 250
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    maxLength={250}
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full p-4 bg-slate-50/50 border border-slate-100 rounded-2xl text-slate-800 text-xs font-semibold outline-none resize-none focus:border-brand-purple/40 focus:bg-white focus:shadow-[0_0_0_4px_rgba(139,92,246,0.06)] transition-all"
                    placeholder="Describe your background and technical vectors..."
                  />
                </div>

                {/* Contact & Location Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Input
                    label="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />

                  <Input
                    label="Phone Number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />

                  <Input
                    label="Location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>

                {/* Optional DOB & Social Links */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Date of Birth (Optional)"
                    type="date"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  />

                  <Input
                    label="LinkedIn URL"
                    value={formData.linkedin}
                    onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="GitHub URL"
                    value={formData.github}
                    onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                    placeholder="https://github.com/..."
                  />

                  <Input
                    label="Portfolio Website"
                    value={formData.portfolio}
                    onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                    placeholder="https://..."
                  />
                </div>

                {/* Editable Skill Tags */}
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pl-1">Skills Mapped (Press Enter to Add)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyDown={handleAddSkill}
                      placeholder="e.g. Next.js, WebGL..."
                      className="flex-1 px-4 py-3 bg-slate-50/50 border border-slate-100 rounded-xl text-xs font-semibold outline-none focus:bg-white focus:border-brand-purple/40"
                    />
                    <button
                      type="button"
                      onClick={handleAddSkill}
                      className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-colors flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" /> Add
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {formData.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 rounded-xl bg-blue-50/60 border border-blue-100/50 text-xs font-bold text-brand-blue flex items-center gap-1.5"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="hover:text-red-500 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Resume Upload Drag & Drop section */}
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pl-1">Update Resume Baseline</label>
                  <div
                    onClick={() => resumeInputRef.current?.click()}
                    className="p-5 border-2 border-dashed border-slate-200 hover:border-slate-300 rounded-2xl text-center bg-slate-50/30 hover:bg-slate-50 cursor-pointer transition-colors flex items-center justify-center gap-3"
                  >
                    <FileText className="w-5 h-5 text-brand-blue" />
                    <span className="text-xs font-bold text-slate-600">Click to upload updated resume PDF</span>
                    <input
                      ref={resumeInputRef}
                      type="file"
                      accept=".pdf,.docx"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          addDocument(e.target.files[0]);
                          addToast(`Uploaded ${e.target.files[0].name} into baseline pipeline!`, 'success');
                        }
                      }}
                    />
                  </div>
                </div>

              </form>
            ) : (
              /* Live Preview Card */
              <div className="space-y-6 py-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Live Baseline Profile Preview</h4>

                <Card className="text-center p-8 space-y-5 bg-gradient-to-tr from-slate-50 to-white max-w-md mx-auto shadow-premium">
                  <div className="w-24 h-24 rounded-full mx-auto overflow-hidden border-2 border-white shadow-md">
                    <img src={formData.avatarUrl} alt={formData.fullName} className="w-full h-full object-cover" />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-800">{formData.fullName}</h3>
                    <p className="text-xs font-bold text-brand-blue">{formData.preferredRole}</p>
                    <p className="text-[11px] font-semibold text-slate-400 mt-1">{formData.headline}</p>
                  </div>

                  <p className="text-xs font-semibold text-slate-500 leading-relaxed bg-white border border-slate-100 p-3 rounded-xl">
                    "{formData.bio}"
                  </p>

                  <div className="flex flex-wrap gap-1.5 justify-center">
                    {formData.skills.map((s, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-xl bg-blue-50/50 border border-blue-100/30 text-[10px] font-bold text-brand-blue">
                        {s}
                      </span>
                    ))}
                  </div>
                </Card>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-100 shrink-0 bg-slate-50/50">
            <Button
              type="button"
              variant="secondary"
              className="max-w-[110px]"
              onClick={() => setIsEditProfileOpen(false)}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              form="edit-profile-form"
              icon={<Check className="w-4 h-4" />}
              className="max-w-[160px]"
            >
              Save Changes
            </Button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
