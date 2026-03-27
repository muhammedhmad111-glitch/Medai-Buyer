/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  TrendingUp, 
  Target, 
  BarChart3, 
  Layers, 
  MousePointer2, 
  Users, 
  Mail, 
  Phone, 
  MapPin, 
  ExternalLink,
  ChevronRight,
  Globe,
  Smartphone,
  PieChart,
  Zap,
  Plus,
  Trash2,
  Settings,
  X,
  Save,
  Upload
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import emailjs from '@emailjs/browser';

const IconMap: Record<string, React.ElementType> = {
  TrendingUp, 
  Target, 
  BarChart3, 
  Layers, 
  MousePointer2, 
  Users, 
  Mail, 
  Phone, 
  MapPin, 
  ExternalLink,
  ChevronRight,
  Globe,
  Smartphone,
  PieChart,
  Zap,
  Plus,
  Trash2,
  Settings,
  X,
  Save
};

const initialStats = [
  { label: 'Total Impressions', value: '244K+', sub: 'TikTok Campaigns', icon: 'Globe' },
  { label: 'Avg. Click Rate', value: '1.94%', sub: 'Snapchat Engagement', icon: 'MousePointer2' },
  { label: 'Targeting Precision', value: '100%', sub: 'Female/iOS Segments', icon: 'Target' },
  { label: 'Budget Managed', value: '$5K+', sub: 'Monthly Scaling', icon: 'TrendingUp' },
];

const initialExperiences = [
  {
    role: 'Media Buyer',
    company: 'Freelance',
    period: 'Oct 2024 - Present',
    image: 'https://picsum.photos/seed/media/800/600',
    description: [
      'Planned and optimized paid campaigns for multiple clients in F&B and E-commerce.',
      'Managed advertising budgets ranging from $200 to $5,000+ per month.',
      'Generated consistent increases in ROI through optimized ad structures and A/B testing.',
      'Analyzed complex campaign data (CPC, CTR, ROAS) to deliver weekly performance reports.'
    ]
  },
  {
    role: 'Social Media Content & Campaign Coordinator',
    company: 'Sound & Fog Cafe',
    period: 'Dec 2024 - Present',
    image: 'https://picsum.photos/seed/cafe/800/600',
    description: [
      'Coordinated paid traffic campaigns for restaurant promotions and events.',
      'Developed ad creatives for Snapchat, Instagram, and TikTok.',
      'Increased store visits through targeted ads and optimized bidding strategies.',
      'Analyzed customer behavior to create high-converting audience segments.'
    ]
  }
];

const initialSkills = [
  { name: 'Meta Ads', category: 'Platform' },
  { name: 'Snapchat Ads', category: 'Platform' },
  { name: 'TikTok Ads', category: 'Platform' },
  { name: 'Google Ads', category: 'Platform' },
  { name: 'Campaign Planning', category: 'Skill' },
  { name: 'Audience Targeting', category: 'Skill' },
  { name: 'A/B Testing', category: 'Skill' },
  { name: 'ROAS Optimization', category: 'Skill' },
  { name: 'Google Analytics', category: 'Tool' },
  { name: 'Meta Business Manager', category: 'Tool' },
  { name: 'Excel Dashboards', category: 'Tool' },
  { name: 'Canva / CapCut', category: 'Tool' },
];

const initialProjects = [
  {
    title: 'E-commerce Scaling Strategy',
    description: 'Scaled a niche e-commerce brand from $500 to $5,000 monthly spend while maintaining a 3.5x ROAS using Meta and TikTok Ads.',
    link: '#',
    image: 'https://picsum.photos/seed/ecommerce/800/600',
    tags: ['Meta Ads', 'TikTok', 'E-commerce']
  },
  {
    title: 'F&B Lead Generation',
    description: 'Increased store visits for Sound & Fog Cafe by 40% through localized Snapchat and Instagram campaigns targeting high-intent foodies.',
    link: '#',
    image: 'https://picsum.photos/seed/food/800/600',
    tags: ['Snapchat', 'Instagram', 'Local SEO']
  },
  {
    title: 'Luxury Beauty Campaign',
    description: 'Achieved 100% female audience penetration for a luxury beauty brand using iOS-specific targeting on Snapchat Ads.',
    link: '#',
    image: 'https://picsum.photos/seed/beauty/800/600',
    tags: ['Snapchat', 'iOS Targeting', 'Luxury']
  },
  {
    title: 'Real Estate Funnel Optimization',
    description: 'Developed a full-funnel strategy for a real estate client, reducing CPL by 25% through advanced retargeting and lookalike audiences.',
    link: '#',
    image: 'https://picsum.photos/seed/realestate/800/600',
    tags: ['Google Ads', 'Retargeting', 'Real Estate']
  }
];

export default function App() {
  const [stats, setStats] = useState(initialStats);
  const [experiences, setExperiences] = useState(initialExperiences);
  const [skills, setSkills] = useState(initialSkills);
  const [projects, setProjects] = useState(initialProjects);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [showAdminButton, setShowAdminButton] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const formRef = useRef<HTMLFormElement>(null);

  // Draft states for management panel
  const [draftStats, setDraftStats] = useState(stats);
  const [draftExperiences, setDraftExperiences] = useState(experiences);
  const [draftSkills, setDraftSkills] = useState(skills);
  const [draftProjects, setDraftProjects] = useState(projects);

  const openAdmin = () => {
    setDraftStats([...stats]);
    setDraftExperiences(JSON.parse(JSON.stringify(experiences)));
    setDraftSkills([...skills]);
    setDraftProjects(JSON.parse(JSON.stringify(projects)));
    setIsAdminOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (limit to 2MB for localStorage safety)
      if (file.size > 2 * 1024 * 1024) {
        alert("Image size too large. Please choose an image smaller than 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          callback(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    setFormStatus('sending');

    try {
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      if (!serviceId || !templateId || !publicKey) {
        console.error('EmailJS environment variables are missing');
        // Fallback for demo if keys are not set
        setTimeout(() => {
          setFormStatus('success');
          formRef.current?.reset();
          setTimeout(() => setFormStatus('idle'), 5000);
        }, 1500);
        return;
      }

      await emailjs.sendForm(
        serviceId,
        templateId,
        formRef.current,
        publicKey
      );

      setFormStatus('success');
      formRef.current.reset();
      setTimeout(() => setFormStatus('idle'), 5000);
    } catch (error) {
      console.error('Failed to send email:', error);
      setFormStatus('error');
      setTimeout(() => setFormStatus('idle'), 5000);
    }
  };

  // Load from localStorage on mount
  useEffect(() => {
    const savedStats = localStorage.getItem('portfolio_stats');
    const savedExp = localStorage.getItem('portfolio_exp');
    const savedSkills = localStorage.getItem('portfolio_skills');
    const savedProjects = localStorage.getItem('portfolio_projects');

    if (savedStats) setStats(JSON.parse(savedStats));
    if (savedExp) setExperiences(JSON.parse(savedExp));
    if (savedSkills) setSkills(JSON.parse(savedSkills));
    if (savedProjects) setProjects(JSON.parse(savedProjects));

    // Admin Access Logic
    const adminSecret = import.meta.env.VITE_ADMIN_SECRET;
    const urlParams = new URLSearchParams(window.location.search);
    const accessParam = urlParams.get('admin_access');
    const hasSavedAccess = localStorage.getItem('admin_access_unlocked') === 'true';

    if (hasSavedAccess || (adminSecret && accessParam === adminSecret) || import.meta.env.DEV) {
      setShowAdminButton(true);
      if (accessParam === adminSecret) {
        localStorage.setItem('admin_access_unlocked', 'true');
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, []);

  const saveToLocal = () => {
    setStats(draftStats);
    setExperiences(draftExperiences);
    setSkills(draftSkills);
    setProjects(draftProjects);
    
    localStorage.setItem('portfolio_stats', JSON.stringify(draftStats));
    localStorage.setItem('portfolio_exp', JSON.stringify(draftExperiences));
    localStorage.setItem('portfolio_skills', JSON.stringify(draftSkills));
    localStorage.setItem('portfolio_projects', JSON.stringify(draftProjects));
    setIsAdminOpen(false);
  };

  return (
    <div className="min-h-screen selection:bg-black selection:text-white">
      {/* Admin Toggle */}
      {showAdminButton && (
        <button 
          onClick={openAdmin}
          className="fixed bottom-8 right-8 z-[60] w-14 h-14 bg-black text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform"
        >
          <Settings size={24} />
        </button>
      )}

      {/* Admin Panel Overlay */}
      <AnimatePresence>
        {isAdminOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-black/40 backdrop-blur-sm flex justify-end"
          >
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full max-w-2xl bg-[var(--color-brand-bg)] h-full shadow-2xl overflow-y-auto p-8 border-l border-black/10"
            >
              <div className="flex items-center justify-between mb-12">
                <h2 className="text-3xl font-bold tracking-tighter">Management Panel</h2>
                <div className="flex gap-4">
                  <button onClick={saveToLocal} className="p-3 bg-black text-white rounded-full hover:bg-black/80 transition-colors">
                    <Save size={20} />
                  </button>
                  <button onClick={() => setIsAdminOpen(false)} className="p-3 border border-black/10 rounded-full hover:bg-black/5 transition-colors">
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Stats Management */}
              <div className="mb-12">
                <h3 className="text-xs font-bold uppercase tracking-widest opacity-40 mb-6 flex items-center gap-2">
                  <Globe size={14} /> Key Metrics
                </h3>
                <div className="space-y-4">
                  {draftStats.map((stat, i) => (
                    <div key={i} className="p-4 border border-black/10 bg-white/50 rounded-xl flex gap-4 items-start">
                      <div className="flex-1 grid grid-cols-2 gap-4">
                        <input 
                          value={stat.label} 
                          onChange={(e) => {
                            const newStats = [...draftStats];
                            newStats[i].label = e.target.value;
                            setDraftStats(newStats);
                          }}
                          className="bg-transparent border-b border-black/10 py-1 font-bold text-sm"
                          placeholder="Label"
                        />
                        <input 
                          value={stat.value} 
                          onChange={(e) => {
                            const newStats = [...draftStats];
                            newStats[i].value = e.target.value;
                            setDraftStats(newStats);
                          }}
                          className="bg-transparent border-b border-black/10 py-1 font-bold text-sm"
                          placeholder="Value"
                        />
                      </div>
                      <button 
                        onClick={() => setDraftStats(draftStats.filter((_, idx) => idx !== i))}
                        className="text-black/20 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  <button 
                    onClick={() => setDraftStats([...draftStats, { label: 'New Stat', value: '0', sub: '', icon: 'Globe' }])}
                    className="w-full p-4 border border-dashed border-black/20 rounded-xl flex items-center justify-center gap-2 opacity-40 hover:opacity-100 transition-opacity"
                  >
                    <Plus size={16} /> Add Metric
                  </button>
                </div>
              </div>

              {/* Projects Management */}
              <div className="mb-12">
                <h3 className="text-xs font-bold uppercase tracking-widest opacity-40 mb-6 flex items-center gap-2">
                  <Layers size={14} /> Projects
                </h3>
                <div className="space-y-4">
                  {draftProjects.map((project, i) => (
                    <div key={i} className="p-6 border border-black/10 bg-white/50 rounded-xl space-y-4">
                      <div className="flex justify-between">
                        <input 
                          value={project.title} 
                          onChange={(e) => {
                            const newProjects = [...draftProjects];
                            newProjects[i].title = e.target.value;
                            setDraftProjects(newProjects);
                          }}
                          className="bg-transparent border-b border-black/10 py-1 font-bold w-full mr-4"
                          placeholder="Project Title"
                        />
                        <button 
                          onClick={() => setDraftProjects(draftProjects.filter((_, idx) => idx !== i))}
                          className="text-black/20 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase opacity-30">Project Image</label>
                        <div className="flex gap-2">
                          <input 
                            value={project.image || ''} 
                            onChange={(e) => {
                              const newProjects = [...draftProjects];
                              newProjects[i].image = e.target.value;
                              setDraftProjects(newProjects);
                            }}
                            className="bg-transparent border-b border-black/10 py-1 text-xs flex-1"
                            placeholder="Image URL (https://...)"
                          />
                          <label className="cursor-pointer p-2 border border-black/10 rounded-lg hover:bg-black/5 transition-colors flex items-center gap-2 text-[10px] font-bold uppercase">
                            <Upload size={14} />
                            Upload
                            <input 
                              type="file" 
                              accept="image/*" 
                              className="hidden" 
                              onChange={(e) => handleImageUpload(e, (base64) => {
                                const newProjects = [...draftProjects];
                                newProjects[i].image = base64;
                                setDraftProjects(newProjects);
                              })}
                            />
                          </label>
                        </div>
                        {project.image && (
                          <div className="mt-2 relative w-20 h-20 rounded-lg overflow-hidden border border-black/5">
                            <img src={project.image} alt="Preview" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>
                      <textarea 
                        value={project.description} 
                        onChange={(e) => {
                          const newProjects = [...draftProjects];
                          newProjects[i].description = e.target.value;
                          setDraftProjects(newProjects);
                        }}
                        className="bg-transparent border border-black/5 p-2 w-full text-sm h-20"
                        placeholder="Description"
                      />
                    </div>
                  ))}
                  <button 
                    onClick={() => setDraftProjects([...draftProjects, { title: 'New Project', description: '', link: '#', tags: [] }])}
                    className="w-full p-4 border border-dashed border-black/20 rounded-xl flex items-center justify-center gap-2 opacity-40 hover:opacity-100 transition-opacity"
                  >
                    <Plus size={16} /> Add Project
                  </button>
                </div>
              </div>

              {/* Experience Management */}
              <div className="mb-12">
                <h3 className="text-xs font-bold uppercase tracking-widest opacity-40 mb-6 flex items-center gap-2">
                  <BarChart3 size={14} /> Experience
                </h3>
                <div className="space-y-6">
                  {draftExperiences.map((exp, i) => (
                    <div key={i} className="p-6 border border-black/10 bg-white/50 rounded-xl space-y-4">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1 grid grid-cols-2 gap-4">
                          <input 
                            value={exp.role} 
                            onChange={(e) => {
                              const newExp = [...draftExperiences];
                              newExp[i].role = e.target.value;
                              setDraftExperiences(newExp);
                            }}
                            className="bg-transparent border-b border-black/10 py-1 font-bold"
                            placeholder="Role"
                          />
                          <input 
                            value={exp.company} 
                            onChange={(e) => {
                              const newExp = [...draftExperiences];
                              newExp[i].company = e.target.value;
                              setDraftExperiences(newExp);
                            }}
                            className="bg-transparent border-b border-black/10 py-1 font-bold"
                            placeholder="Company"
                          />
                        </div>
                        <button 
                          onClick={() => setDraftExperiences(draftExperiences.filter((_, idx) => idx !== i))}
                          className="text-black/20 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase opacity-30">Experience Image</label>
                        <div className="flex gap-2">
                          <input 
                            value={exp.image || ''} 
                            onChange={(e) => {
                              const newExp = [...draftExperiences];
                              newExp[i].image = e.target.value;
                              setDraftExperiences(newExp);
                            }}
                            className="bg-transparent border-b border-black/10 py-1 text-xs flex-1"
                            placeholder="Image URL (https://...)"
                          />
                          <label className="cursor-pointer p-2 border border-black/10 rounded-lg hover:bg-black/5 transition-colors flex items-center gap-2 text-[10px] font-bold uppercase">
                            <Upload size={14} />
                            Upload
                            <input 
                              type="file" 
                              accept="image/*" 
                              className="hidden" 
                              onChange={(e) => handleImageUpload(e, (base64) => {
                                const newExp = [...draftExperiences];
                                newExp[i].image = base64;
                                setDraftExperiences(newExp);
                              })}
                            />
                          </label>
                        </div>
                        {exp.image && (
                          <div className="mt-2 relative w-20 h-20 rounded-lg overflow-hidden border border-black/5">
                            <img src={exp.image} alt="Preview" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        {exp.description.map((desc, j) => (
                          <div key={j} className="flex gap-2">
                            <input 
                              value={desc} 
                              onChange={(e) => {
                                const newExp = [...draftExperiences];
                                newExp[i].description[j] = e.target.value;
                                setDraftExperiences(newExp);
                              }}
                              className="bg-transparent border-b border-black/5 py-1 text-sm flex-1"
                              placeholder="Responsibility"
                            />
                            <button 
                              onClick={() => {
                                const newExp = [...draftExperiences];
                                newExp[i].description = newExp[i].description.filter((_, idx) => idx !== j);
                                setDraftExperiences(newExp);
                              }}
                              className="text-black/20 hover:text-red-500"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        ))}
                        <button 
                          onClick={() => {
                            const newExp = [...draftExperiences];
                            newExp[i].description.push('New responsibility');
                            setDraftExperiences(newExp);
                          }}
                          className="text-[10px] font-bold uppercase tracking-widest opacity-40 hover:opacity-100"
                        >
                          + Add Line
                        </button>
                      </div>
                    </div>
                  ))}
                  <button 
                    onClick={() => setDraftExperiences([...draftExperiences, { role: 'New Role', company: 'New Company', period: '2024', description: [] }])}
                    className="w-full p-4 border border-dashed border-black/20 rounded-xl flex items-center justify-center gap-2 opacity-40 hover:opacity-100 transition-opacity"
                  >
                    <Plus size={16} /> Add Experience
                  </button>
                </div>
              </div>

              {/* Skills Management */}
              <div className="mb-12">
                <h3 className="text-xs font-bold uppercase tracking-widest opacity-40 mb-6 flex items-center gap-2">
                  <Zap size={14} /> Skills
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {draftSkills.map((skill, i) => (
                    <div key={i} className="p-2 border border-black/10 bg-white/50 rounded flex justify-between items-center">
                      <input 
                        value={skill.name} 
                        onChange={(e) => {
                          const newSkills = [...draftSkills];
                          newSkills[i].name = e.target.value;
                          setDraftSkills(newSkills);
                        }}
                        className="bg-transparent text-xs font-bold flex-1"
                      />
                      <button 
                        onClick={() => setDraftSkills(draftSkills.filter((_, idx) => idx !== i))}
                        className="text-black/20 hover:text-red-500"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                  <button 
                    onClick={() => setDraftSkills([...draftSkills, { name: 'New Skill', category: 'Skill' }])}
                    className="p-2 border border-dashed border-black/20 rounded flex items-center justify-center opacity-40 hover:opacity-100"
                  >
                    <Plus size={12} />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header / Navigation */}
      <nav className="sticky top-0 z-50 bg-[var(--color-brand-bg)]/80 backdrop-blur-md border-b border-black/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-mono text-sm font-bold tracking-tighter uppercase">
            Muhammed Saad / Media Buyer
          </div>
          <div className="hidden md:flex gap-8 text-xs font-medium uppercase tracking-widest">
            <a href="#results" className="hover:opacity-50 transition-opacity">Results</a>
            <a href="#projects" className="hover:opacity-50 transition-opacity">Projects</a>
            <a href="#experience" className="hover:opacity-50 transition-opacity">Experience</a>
            <a href="#skills" className="hover:opacity-50 transition-opacity">Expertise</a>
            <a href="#contact" className="hover:opacity-50 transition-opacity">Contact</a>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="pt-24 pb-12 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-[0.9] mb-8">
                DATA-BACKED <br />
                <span className="italic font-serif font-light">GROWTH</span> STRATEGIES.
              </h1>
              <p className="max-w-2xl text-xl text-black/60 leading-relaxed mb-12">
                Results-driven Media Buyer with hands-on experience in planning, launching, and optimizing paid 
                advertising campaigns across Meta, Snapchat, TikTok, and Google Ads.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="#contact" className="px-8 py-4 bg-black text-white rounded-full font-medium hover:bg-black/80 transition-colors flex items-center gap-2">
                  Work with me <ChevronRight size={16} />
                </a>
                <div className="px-8 py-4 border border-black/10 rounded-full font-medium flex items-center gap-4">
                  <span className="flex items-center gap-2 text-sm"><MapPin size={14} /> Egypt</span>
                  <span className="w-px h-4 bg-black/10"></span>
                  <span className="flex items-center gap-2 text-sm"><Globe size={14} /> Remote</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats Grid */}
        <section id="results" className="py-12 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-black/10 border border-black/10">
            {stats.map((stat, i) => {
              const Icon = IconMap[stat.icon] || Globe;
              return (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-[var(--color-brand-bg)] p-8 flex flex-col justify-between aspect-square md:aspect-auto"
                >
                  <Icon className="mb-8 text-black/40" size={24} />
                  <div>
                    <div className="text-4xl font-bold tracking-tighter mb-1">{stat.value}</div>
                    <div className="text-xs uppercase tracking-widest font-bold opacity-40">{stat.label}</div>
                    <div className="text-xs italic font-serif mt-2 opacity-60">{stat.sub}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-24 px-6 bg-white/10">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row gap-12 mb-16">
              <div className="md:w-1/3">
                <h2 className="text-sm font-bold uppercase tracking-[0.2em] opacity-40">
                  Featured <br /> Projects
                </h2>
              </div>
              <div className="md:w-2/3">
                <p className="text-2xl font-medium text-black/80 leading-snug">
                  Proven success in scaling brands and optimizing ad spend across multiple industries.
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {projects.map((project, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-8 border border-black/10 bg-[var(--color-brand-bg)] flex flex-col justify-between group hover:border-black transition-colors overflow-hidden"
                >
                  {project.image && (
                    <div className="mb-6 -mx-8 -mt-8 h-48 overflow-hidden">
                      <img 
                        src={project.image} 
                        alt={project.title}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-105 group-hover:scale-100"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}
                  <div>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tags.map((tag, j) => (
                        <span key={j} className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-black/5 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-3xl font-bold tracking-tight mb-4">{project.title}</h3>
                    <p className="text-black/60 leading-relaxed mb-8">
                      {project.description}
                    </p>
                  </div>
                  <a 
                    href={project.link} 
                    className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest group-hover:gap-4 transition-all"
                  >
                    View Project <ExternalLink size={14} />
                  </a>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="py-24 px-6 bg-white/30">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row gap-12">
              <div className="md:w-1/3">
                <h2 className="text-sm font-bold uppercase tracking-[0.2em] opacity-40 sticky top-32">
                  Professional <br /> Experience
                </h2>
              </div>
              <div className="md:w-2/3 space-y-24">
                {experiences.map((exp, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="group"
                  >
                    <div className="flex justify-between items-baseline mb-6">
                      <h3 className="text-3xl font-bold tracking-tight">{exp.role}</h3>
                      <span className="font-mono text-xs opacity-40">{exp.period}</span>
                    </div>
                    {exp.image && (
                      <div className="mb-8 h-64 rounded-2xl overflow-hidden border border-black/5">
                        <img 
                          src={exp.image} 
                          alt={exp.company}
                          className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}
                    <div className="text-lg font-medium mb-6 text-black/60 italic font-serif">
                      {exp.company}
                    </div>
                    <ul className="space-y-4">
                      {exp.description.map((item, j) => (
                        <li key={j} className="flex gap-4 text-black/70 leading-relaxed">
                          <span className="mt-2 w-1.5 h-1.5 rounded-full bg-black/20 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Skills & Tools */}
        <section id="skills" className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-[0.2em] opacity-40 mb-8">
                  Core Expertise
                </h2>
                <div className="space-y-2">
                  {skills.filter(s => s.category === 'Platform').map((skill, i) => (
                    <div key={i} className="p-4 border border-black/5 flex justify-between items-center hover-invert cursor-default">
                      <span className="font-bold tracking-tight">{skill.name}</span>
                      <Smartphone size={16} className="opacity-40" />
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h2 className="text-sm font-bold uppercase tracking-[0.2em] opacity-40 mb-8">
                  Strategic Skills
                </h2>
                <div className="space-y-2">
                  {skills.filter(s => s.category === 'Skill').map((skill, i) => (
                    <div key={i} className="p-4 border border-black/5 flex justify-between items-center hover-invert cursor-default">
                      <span className="font-bold tracking-tight">{skill.name}</span>
                      <Zap size={16} className="opacity-40" />
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h2 className="text-sm font-bold uppercase tracking-[0.2em] opacity-40 mb-8">
                  Technical Stack
                </h2>
                <div className="space-y-2">
                  {skills.filter(s => s.category === 'Tool').map((skill, i) => (
                    <div key={i} className="p-4 border border-black/5 flex justify-between items-center hover-invert cursor-default">
                      <span className="font-bold tracking-tight">{skill.name}</span>
                      <Layers size={16} className="opacity-40" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Campaign Insights / Case Study Style */}
        <section className="py-24 px-6 bg-black text-white">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16">
              <h2 className="text-5xl font-bold tracking-tighter mb-4">CAMPAIGN INSIGHTS</h2>
              <p className="text-white/60 max-w-xl">
                A glimpse into the performance metrics achieved across various platforms. 
                Focused on high-intent targeting and ROI-driven optimization.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 border border-white/10 rounded-2xl bg-white/5">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-full bg-[#fffc00] flex items-center justify-center">
                    <Smartphone className="text-black" size={20} />
                  </div>
                  <div>
                    <div className="font-bold">Snapchat Sales Campaign</div>
                    <div className="text-xs opacity-50 uppercase tracking-widest">Saudi Arabia Market</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="p-4 bg-white/5 rounded-xl">
                    <div className="text-2xl font-bold">1.94%</div>
                    <div className="text-[10px] uppercase opacity-40">Click Rate</div>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl">
                    <div className="text-2xl font-bold">$0.22</div>
                    <div className="text-[10px] uppercase opacity-40">ECPC</div>
                  </div>
                </div>
                <div className="text-sm text-white/60 leading-relaxed">
                  Achieved 100% female audience penetration with iOS-exclusive targeting, 
                  resulting in high-quality traffic for luxury and beauty segments.
                </div>
              </div>

              <div className="p-8 border border-white/10 rounded-2xl bg-white/5">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-full bg-[#00f2ea] flex items-center justify-center">
                    <BarChart3 className="text-black" size={20} />
                  </div>
                  <div>
                    <div className="font-bold">TikTok Conversion Ads</div>
                    <div className="text-xs opacity-50 uppercase tracking-widest">E-commerce Focus</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="p-4 bg-white/5 rounded-xl">
                    <div className="text-2xl font-bold">244K+</div>
                    <div className="text-[10px] uppercase opacity-40">Impressions</div>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl">
                    <div className="text-2xl font-bold">SAR 0.19</div>
                    <div className="text-[10px] uppercase opacity-40">CPC (Destination)</div>
                  </div>
                </div>
                <div className="text-sm text-white/60 leading-relaxed">
                  Optimized ad structures to maintain low CPMs while scaling reach, 
                  delivering over 2,600+ high-intent clicks within targeted budget windows.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
              <div>
                <h2 className="text-6xl md:text-8xl font-bold tracking-tighter mb-12">
                  READY TO <br /> <span className="italic font-serif font-light">SCALE?</span>
                </h2>
                <div className="space-y-8">
                  <a href="mailto:muhammedhmad111@gmail.com" className="flex items-center gap-4 text-2xl font-medium hover:opacity-50 transition-opacity">
                    <Mail /> muhammedhmad111@gmail.com
                  </a>
                  <div className="flex items-center gap-4 text-2xl font-medium">
                    <Phone /> 01061902243
                  </div>
                </div>
              </div>

              <div className="bg-black/5 p-8 md:p-12 rounded-3xl border border-black/5">
                <form ref={formRef} onSubmit={handleContactSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">Name</label>
                      <input 
                        required
                        name="user_name"
                        type="text" 
                        className="w-full bg-white border border-black/10 rounded-xl px-4 py-3 focus:outline-none focus:border-black transition-colors"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">Email</label>
                      <input 
                        required
                        name="user_email"
                        type="email" 
                        className="w-full bg-white border border-black/10 rounded-xl px-4 py-3 focus:outline-none focus:border-black transition-colors"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">Message</label>
                    <textarea 
                      required
                      name="message"
                      rows={4}
                      className="w-full bg-white border border-black/10 rounded-xl px-4 py-3 focus:outline-none focus:border-black transition-colors resize-none"
                      placeholder="Tell me about your project..."
                    />
                  </div>
                  <button 
                    disabled={formStatus === 'sending'}
                    type="submit" 
                    className="w-full py-4 bg-black text-white rounded-xl font-bold uppercase tracking-widest hover:bg-black/80 transition-all disabled:opacity-50"
                  >
                    {formStatus === 'idle' && 'Send Message'}
                    {formStatus === 'sending' && 'Sending...'}
                    {formStatus === 'success' && 'Message Sent!'}
                    {formStatus === 'error' && 'Error Sending'}
                  </button>
                </form>
              </div>
            </div>

            <div className="mt-24 pt-12 border-t border-black/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold uppercase tracking-widest opacity-40">
              <div>© 2026 MUHAMMED SAAD</div>
              <div className="flex gap-8">
                <a href="#" className="hover:underline">LinkedIn</a>
                <a href="#" className="hover:underline">WhatsApp</a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
