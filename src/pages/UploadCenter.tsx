import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, CheckCircle2, Cpu, ShieldCheck } from 'lucide-react';
import { useAppState, mockExtractionSteps } from '../context/AppState';
import { Card } from '../components/UI/Card';
import { Button } from '../components/UI/Button';

export const UploadCenter: React.FC = () => {
  const { documents, addDocument } = useAppState();
  const [dragActive, setDragActive] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter out documents in active upload/processing steps
  const activeDocs = documents.filter(d => d.status !== 'done');
  const processedDocs = documents.filter(d => d.status === 'done');

  // Automatically select the first processed document if none is selected
  React.useEffect(() => {
    if (!selectedDocId && processedDocs.length > 0) {
      setSelectedDocId(processedDocs[0].id);
    }
  }, [processedDocs, selectedDocId]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      addDocument(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      addDocument(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  const selectedDoc = processedDocs.find(d => d.id === selectedDocId);

  return (
    <div className="space-y-8 w-full">
      <header className="border-b border-slate-50 pb-6">
        <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Upload Center</h2>
        <p className="text-xs font-semibold text-slate-400 mt-1">
          Map academic documents, portfolios, and job contracts into your decentralized profile memory.
        </p>
      </header>

      {/* Main Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: File Drag & Drop + Active Upload progress (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-6">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Import Baseline Artifact</h4>
          
          {/* Drag & Drop Area container */}
          <div 
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={onButtonClick}
            className={`relative rounded-3xl border-2 border-dashed p-10 text-center cursor-pointer transition-all duration-300 ${
              dragActive 
                ? 'border-brand-blue bg-blue-50/20 scale-[1.01]' 
                : 'border-slate-200 bg-slate-50/20 hover:bg-slate-50/50 hover:border-slate-300'
            }`}
          >
            <input 
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".pdf,.docx,image/*"
              onChange={handleFileChange}
            />

            <div className="space-y-4 max-w-xs mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center mx-auto shadow-sm text-slate-400">
                <Upload className="w-6 h-6 text-brand-blue" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">Drag & Drop Credentials</h4>
                <p className="text-[10px] text-slate-400 font-semibold mt-1">Supports PDF, DOCX, or Images up to 10MB</p>
              </div>
              <Button size="sm" variant="secondary" className="max-w-[150px] mx-auto py-2">
                Browse Files
              </Button>
            </div>
          </div>

          {/* Active Uploading / Processing Steppers */}
          <AnimatePresence>
            {activeDocs.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Active Synthesis Pipelines</h4>
                
                {activeDocs.map((doc) => (
                  <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <Card className="p-5 border-blue-100 bg-blue-50/5 relative overflow-hidden">
                      {/* Subtly animated scan bar for files actively parsing */}
                      {doc.status === 'processing' && (
                        <motion.div 
                          className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brand-blue to-transparent opacity-30"
                          animate={{ top: ['0%', '100%', '0%'] }}
                          transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
                        />
                      )}

                      <div className="flex gap-4 items-start relative z-10">
                        <div className="p-3 bg-white border border-slate-100 rounded-xl text-brand-blue shrink-0 shadow-sm animate-pulse">
                          <FileText className="w-5 h-5" />
                        </div>
                        
                        <div className="flex-1 space-y-2 min-w-0">
                          <div className="flex justify-between items-start">
                            <h5 className="text-xs font-bold text-slate-800 truncate pr-4">{doc.name}</h5>
                            <span className="text-[9px] font-bold text-brand-blue uppercase bg-blue-50 border border-blue-100/50 px-2 py-0.5 rounded-md">
                              {doc.status}
                            </span>
                          </div>

                          <div className="flex justify-between items-center text-[10px] text-slate-400 font-semibold">
                            <span>
                              {doc.status === 'uploading' 
                                ? `Uploading... ${doc.uploadProgress}%`
                                : mockExtractionSteps[doc.processingStep]
                              }
                            </span>
                            <span>{doc.size}</span>
                          </div>

                          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/20">
                            <div 
                              className={`h-full bg-gradient-to-r from-brand-blue to-brand-cyan transition-all duration-300`}
                              style={{ 
                                width: doc.status === 'uploading' 
                                  ? `${doc.uploadProgress}%` 
                                  : `${((doc.processingStep + 1) / mockExtractionSteps.length) * 100}%` 
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>

          {/* List of processed documents */}
          {processedDocs.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Mapped Memory Sources</h4>
              
              <div className="space-y-2">
                {processedDocs.map((doc) => (
                  <button
                    key={doc.id}
                    onClick={() => setSelectedDocId(doc.id)}
                    className={`flex items-center gap-3.5 w-full p-4 rounded-2xl text-left border transition-all duration-300 ${
                      selectedDocId === doc.id
                        ? 'bg-slate-50 border-brand-blue/30 shadow-[0_10px_20px_rgba(59,130,246,0.02)]'
                        : 'bg-white border-slate-100 hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="p-2 bg-slate-50 border border-slate-100 rounded-xl text-slate-400 shrink-0">
                      <FileText className="w-5 h-5 text-slate-500" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h5 className="text-xs font-bold text-slate-800 truncate">{doc.name}</h5>
                      <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Confidence: {doc.confidence}%</p>
                    </div>
                    {selectedDocId === doc.id && (
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-blue shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Column: AI Extraction Cards Display (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex justify-between items-center px-1">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">AI Extraction Mapping</h4>
            {selectedDoc && (
              <div className="flex items-center gap-4 text-[10px] font-semibold text-slate-400 shrink-0">
                <span className="flex items-center gap-1"><Cpu className="w-3.5 h-3.5 text-brand-blue" /> Confidence: <strong className="text-slate-800">{selectedDoc.confidence}%</strong></span>
                <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Homomorphic Encrypted</span>
              </div>
            )}
          </div>

          {selectedDoc ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Skills */}
              <Card className="space-y-3">
                <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Skills Mapped</h5>
                <div className="flex flex-wrap gap-1.5">
                  {selectedDoc.skills.map((s, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-xl bg-blue-50/50 border border-blue-100/30 text-[10px] font-bold text-brand-blue">
                      {s}
                    </span>
                  ))}
                </div>
              </Card>

              {/* Technologies */}
              <Card className="space-y-3">
                <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Technologies</h5>
                <div className="flex flex-wrap gap-1.5">
                  {selectedDoc.technologies.map((t, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-xl bg-cyan-50/50 border border-cyan-100/30 text-[10px] font-bold text-brand-cyan">
                      {t}
                    </span>
                  ))}
                </div>
              </Card>

              {/* Projects */}
              <Card className="space-y-3 md:col-span-2">
                <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Project Memories</h5>
                <div className="space-y-2">
                  {selectedDoc.projects.map((p, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-100/50 p-2.5 rounded-xl">
                      <span>{p}</span>
                      <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Verified Stack</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Companies & Internships */}
              <Card className="space-y-3">
                <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Workplace Nodes</h5>
                <div className="space-y-1.5">
                  {selectedDoc.companies.map((c, idx) => (
                    <div key={idx} className="text-xs font-bold text-slate-700">{c}</div>
                  ))}
                  {selectedDoc.internships.map((i, idx) => (
                    <div key={idx} className="text-xs font-semibold text-slate-500 italic">{i} (Internship)</div>
                  ))}
                  {selectedDoc.companies.length === 0 && selectedDoc.internships.length === 0 && (
                    <div className="text-xs text-slate-400">No workforce nodes identified.</div>
                  )}
                </div>
              </Card>

              {/* Education & Achievements */}
              <Card className="space-y-3">
                <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Education & Achievements</h5>
                <div className="space-y-2">
                  {selectedDoc.education.map((e, idx) => (
                    <div key={idx} className="text-xs font-semibold text-slate-700 leading-relaxed">{e}</div>
                  ))}
                  {selectedDoc.achievements.map((a, idx) => (
                    <div key={idx} className="text-[11px] font-bold text-brand-purple leading-relaxed">{a}</div>
                  ))}
                </div>
              </Card>

              {/* Certificates */}
              {selectedDoc.certificates.length > 0 && (
                <Card className="space-y-3 md:col-span-2">
                  <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Credentials & Certificates</h5>
                  <div className="flex flex-wrap gap-2">
                    {selectedDoc.certificates.map((cert, idx) => (
                      <span key={idx} className="px-3 py-1.5 rounded-xl bg-purple-50/50 border border-purple-100/30 text-xs font-bold text-brand-purple flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-brand-purple" />
                        {cert}
                      </span>
                    ))}
                  </div>
                </Card>
              )}

            </div>
          ) : (
            <Card className="text-center py-24 space-y-4">
              <Cpu className="w-12 h-12 text-slate-300 mx-auto animate-pulse" />
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-800">No Mapped Documents</h4>
                <p className="text-xs text-slate-400 font-semibold">Upload credentials or resumes in the baseline to preview AI extraction values.</p>
              </div>
            </Card>
          )}

        </div>

      </div>

    </div>
  );
};
