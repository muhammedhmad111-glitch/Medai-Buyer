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
  Upload,
  User
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import emailjs from '@emailjs/browser';
import { 
  BarChart, 
  Bar, 
  PieChart as RechartsPieChart,
  Pie,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell
} from 'recharts';

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

const initialHero = {
  title: 'DATA-BACKED',
  subtitle: 'GROWTH',
  suffix: 'STRATEGIES.',
  description: 'Results-driven Media Buyer with hands-on experience in planning, launching, and optimizing paid advertising campaigns across Meta, Snapchat, TikTok, and Google Ads.',
  location: 'Egypt',
  workMode: 'Remote',
  image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&h=400&auto=format&fit=crop'
};

const initialStats = [
  { label: 'Total Impressions', value: '689K+', sub: 'Aggregated Campaigns', icon: 'Globe' },
  { label: 'Total Conversions', value: '35K+', sub: 'High-Intent Actions', icon: 'Target' },
  { label: 'Total Clicks', value: '48K+', sub: 'Traffic & Engagement', icon: 'MousePointer2' },
  { label: 'Avg. CPC', value: '$0.02', sub: 'Optimized Bidding', icon: 'TrendingUp' },
];

const bestCampaigns = [
  { name: 'UGC Strategy', spent: 474.19, cpc: 0.03, cpm: 1.90, impressions: 249262, clicks: 17885, ctr: '7.18%', conversions: 12426, costPerConv: 0.04, convRate: '4.99%' },
  { name: 'Christmas Special', spent: 60.00, cpc: 0.01, cpm: 1.61, impressions: 37382, clicks: 10469, ctr: '28.01%', conversions: 7558, costPerConv: 0.01, convRate: '20.22%' },
  { name: 'Traffic 2.0', spent: 100.00, cpc: 0.01, cpm: 2.04, impressions: 48978, clicks: 12864, ctr: '26.26%', conversions: 9161, costPerConv: 0.01, convRate: '18.70%' },
];

const snapchatCampaigns = [
  { id: '1', name: 'UGC Ad', status: 'Active', spent: 516.85, result: 1219, type: 'LPV', cost: 0.42, impressions: 76022, clicks: 1913 },
  { id: '2', name: 'Sales', status: 'Active', spent: 239.76, result: 507, type: 'LPV', cost: 0.47, impressions: 33552, clicks: 852 },
  { id: '3', name: 'Reel4', status: 'Paused', spent: 165.99, result: 341, type: 'LPV', cost: 0.49, impressions: 26169, clicks: 523 },
  { id: '4', name: 'Traffic', status: 'Paused', spent: 129.88, result: 684, type: 'Clicks', cost: 0.19, impressions: 26875, clicks: 684 },
  { id: '5', name: 'Sales', status: 'Paused', spent: 120.00, result: 465, type: 'Clicks', cost: 0.26, impressions: 23396, clicks: 465 },
  { id: '6', name: 'Sales', status: 'Paused', spent: 75.00, result: 332, type: 'Clicks', cost: 0.23, impressions: 17355, clicks: 332 },
  { id: '7', name: 'Awareness & Engagement', status: 'Paused', spent: 64.90, result: 401, type: 'Clicks', cost: 0.16, impressions: 12908, clicks: 401 },
  { id: '8', name: 'Ramdan 1', status: 'Paused', spent: 59.65, result: 77, type: 'LPV', cost: 0.77, impressions: 5164, clicks: 130 },
  { id: '9', name: 'ramadan 2', status: 'Paused', spent: 59.17, result: 66, type: 'LPV', cost: 0.90, impressions: 6322, clicks: 111 },
  { id: '10', name: 'Awareness & Engagement', status: 'Paused', spent: 57.91, result: 301, type: 'Clicks', cost: 0.19, impressions: 10743, clicks: 301 },
  { id: '11', name: 'Sales', status: 'Paused', spent: 40.00, result: 55, type: 'LPV', cost: 0.73, impressions: 4687, clicks: 84 },
  { id: '12', name: 'Awareness & Engagement', status: 'Paused', spent: 40.00, result: 188, type: 'Clicks', cost: 0.21, impressions: 9562, clicks: 188 },
  { id: '13', name: 'ABC', status: 'Paused', spent: 23.89, result: 52, type: 'LPV', cost: 0.46, impressions: 3109, clicks: 74 },
  { id: '14', name: 'Native Traffic', status: 'Paused', spent: 18.91, result: 4, type: 'LPV', cost: 4.73, impressions: 2546, clicks: 39 },
  { id: '15', name: 'Sales حفله', status: 'Paused', spent: 32.58, result: 35, type: 'LPV', cost: 0.93, impressions: 4703, clicks: 55 },
  { id: '16', name: 'Traffic', status: 'Paused', spent: 30.00, result: 33, type: 'LPV', cost: 0.91, impressions: 3682, clicks: 50 },
  { id: '17', name: 'Sales', status: 'Paused', spent: 50.00, result: 228, type: 'Clicks', cost: 0.22, impressions: 9622, clicks: 228 },
  { id: '18', name: 'الماتش', status: 'Paused', spent: 20.00, result: 13, type: 'LPV', cost: 1.54, impressions: 2850, clicks: 23 },
  { id: '19', name: 'Sales', status: 'Paused', spent: 67.27, result: 406, type: 'Clicks', cost: 0.17, impressions: 17948, clicks: 406 },
  { id: '20', name: 'Traffic', status: 'Paused', spent: 39.99, result: 106, type: 'Clicks', cost: 0.38, impressions: 4740, clicks: 106 },
  { id: '21', name: 'promo', status: 'Paused', spent: 25.00, result: 65, type: 'LPV', cost: 0.38, impressions: 4161, clicks: 97 },
  { id: '22', name: 'party', status: 'Paused', spent: 25.00, result: 64, type: 'LPV', cost: 0.39, impressions: 4047, clicks: 83 },
  { id: '23', name: 'vala', status: 'Paused', spent: 40.00, result: 37, type: 'LPV', cost: 1.08, impressions: 4668, clicks: 58 },
  { id: '24', name: 'Awareness & Engagement', status: 'Paused', spent: 60.00, result: 260, type: 'Clicks', cost: 0.23, impressions: 10483, clicks: 260 },
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
  const [hero, setHero] = useState(initialHero);
  const [stats, setStats] = useState(initialStats);
  const [bestCampaignsList, setBestCampaignsList] = useState(bestCampaigns);
  const [snapchatCampaignsList, setSnapchatCampaignsList] = useState(snapchatCampaigns);
  const [experiences, setExperiences] = useState(initialExperiences);
  const [skills, setSkills] = useState(initialSkills);
  const [projects, setProjects] = useState(initialProjects);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [showAdminButton, setShowAdminButton] = useState(false);
  const [isConfirmingSave, setIsConfirmingSave] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const formRef = useRef<HTMLFormElement>(null);

  // Draft states for management panel
  const [draftHero, setDraftHero] = useState(hero);
  const [draftStats, setDraftStats] = useState(stats);
  const [draftBestCampaigns, setDraftBestCampaigns] = useState(bestCampaignsList);
  const [draftSnapchatCampaigns, setDraftSnapchatCampaigns] = useState(snapchatCampaignsList);
  const [draftExperiences, setDraftExperiences] = useState(experiences);
  const [draftSkills, setDraftSkills] = useState(skills);
  const [draftProjects, setDraftProjects] = useState(projects);

  const openAdmin = () => {
    setDraftHero({ ...hero });
    setDraftStats([...stats]);
    setDraftBestCampaigns(JSON.parse(JSON.stringify(bestCampaignsList)));
    setDraftSnapchatCampaigns(JSON.parse(JSON.stringify(snapchatCampaignsList)));
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
        console.error("Image size too large. Please choose an image smaller than 2MB.");
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
      const sheetUrl = import.meta.env.VITE_GOOGLE_SHEET_URL;

      // Send to Google Sheets if URL exists
      if (sheetUrl) {
        const formData = new FormData(formRef.current);
        const data = {
          name: formData.get('user_name'),
          email: formData.get('user_email'),
          message: formData.get('message'),
          date: new Date().toLocaleString()
        };

        fetch(sheetUrl, {
          method: 'POST',
          mode: 'no-cors', // Google Apps Script requires no-cors for simple POST
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }).catch(err => console.error('Google Sheets Error:', err));
      }

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
    try {
      const savedHero = localStorage.getItem('portfolio_hero');
      const savedStats = localStorage.getItem('portfolio_stats');
      const savedBest = localStorage.getItem('portfolio_best');
      const savedSnap = localStorage.getItem('portfolio_snap');
      const savedExp = localStorage.getItem('portfolio_exp');
      const savedSkills = localStorage.getItem('portfolio_skills');
      const savedProjects = localStorage.getItem('portfolio_projects');

      if (savedHero) setHero(JSON.parse(savedHero));
      if (savedStats) setStats(JSON.parse(savedStats));
      if (savedBest) setBestCampaignsList(JSON.parse(savedBest));
      if (savedSnap) setSnapchatCampaignsList(JSON.parse(savedSnap));
      if (savedExp) setExperiences(JSON.parse(savedExp));
      if (savedSkills) setSkills(JSON.parse(savedSkills));
      if (savedProjects) setProjects(JSON.parse(savedProjects));
    } catch (error) {
      console.error('Failed to load data from localStorage:', error);
    }

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
    setHero(draftHero);
    setStats(draftStats);
    setBestCampaignsList(draftBestCampaigns);
    setSnapchatCampaignsList(draftSnapchatCampaigns);
    setExperiences(draftExperiences);
    setSkills(draftSkills);
    setProjects(draftProjects);
    
    localStorage.setItem('portfolio_hero', JSON.stringify(draftHero));
    localStorage.setItem('portfolio_stats', JSON.stringify(draftStats));
    localStorage.setItem('portfolio_best', JSON.stringify(draftBestCampaigns));
    localStorage.setItem('portfolio_snap', JSON.stringify(draftSnapchatCampaigns));
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
                  <button onClick={() => setIsConfirmingSave(true)} className="p-3 bg-black text-white rounded-full hover:bg-black/80 transition-colors">
                    <Save size={20} />
                  </button>
                  <button onClick={() => setIsAdminOpen(false)} className="p-3 border border-black/10 rounded-full hover:bg-black/5 transition-colors">
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Confirmation Dialog */}
              <AnimatePresence>
                {isConfirmingSave && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-md flex items-center justify-center p-6"
                  >
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      className="bg-white p-8 rounded-3xl max-w-sm w-full shadow-2xl text-center"
                    >
                      <div className="w-16 h-16 bg-black/5 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Save size={32} className="text-black" />
                      </div>
                      <h3 className="text-2xl font-bold tracking-tight mb-4">Save Changes?</h3>
                      <p className="text-black/60 mb-8">
                        Are you sure you want to save these changes?
                      </p>
                      <div className="flex gap-4">
                        <button 
                          onClick={() => setIsConfirmingSave(false)}
                          className="flex-1 py-4 border border-black/10 rounded-xl font-bold uppercase tracking-widest hover:bg-black/5 transition-all"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={() => {
                            saveToLocal();
                            setIsConfirmingSave(false);
                          }}
                          className="flex-1 py-4 bg-black text-white rounded-xl font-bold uppercase tracking-widest hover:bg-black/80 transition-all shadow-lg"
                        >
                          Confirm
                        </button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Hero Management */}
              <div className="mb-12">
                <h3 className="text-xs font-bold uppercase tracking-widest opacity-40 mb-6 flex items-center gap-2">
                  <User size={14} /> Hero Section
                </h3>
                <div className="space-y-4 p-6 border border-black/10 bg-white/50 rounded-xl">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase opacity-30">Title</label>
                      <input 
                        value={draftHero.title} 
                        onChange={(e) => setDraftHero({...draftHero, title: e.target.value})}
                        className="w-full bg-transparent border-b border-black/10 py-1 font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase opacity-30">Subtitle (Italic)</label>
                      <input 
                        value={draftHero.subtitle} 
                        onChange={(e) => setDraftHero({...draftHero, subtitle: e.target.value})}
                        className="w-full bg-transparent border-b border-black/10 py-1 font-bold"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase opacity-30">Suffix</label>
                    <input 
                      value={draftHero.suffix} 
                      onChange={(e) => setDraftHero({...draftHero, suffix: e.target.value})}
                      className="w-full bg-transparent border-b border-black/10 py-1 font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase opacity-30">Description</label>
                    <textarea 
                      value={draftHero.description} 
                      onChange={(e) => setDraftHero({...draftHero, description: e.target.value})}
                      className="w-full bg-transparent border border-black/5 p-2 text-sm h-24"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase opacity-30">Profile Image</label>
                    <div className="flex gap-2">
                      <input 
                        value={draftHero.image || ''} 
                        onChange={(e) => setDraftHero({...draftHero, image: e.target.value})}
                        className="bg-transparent border-b border-black/10 py-1 text-xs flex-1"
                        placeholder="Image URL"
                      />
                      <label className="cursor-pointer p-2 border border-black/10 rounded-lg hover:bg-black/5 transition-colors flex items-center gap-2 text-[10px] font-bold uppercase">
                        <Upload size={14} />
                        Upload
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => handleImageUpload(e, (base64) => {
                            setDraftHero({...draftHero, image: base64});
                          })}
                        />
                      </label>
                    </div>
                    {draftHero.image && (
                      <div className="mt-2 relative w-20 h-20 rounded-full overflow-hidden border border-black/5">
                        <img src={draftHero.image} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase opacity-30">Location</label>
                      <input 
                        value={draftHero.location} 
                        onChange={(e) => setDraftHero({...draftHero, location: e.target.value})}
                        className="w-full bg-transparent border-b border-black/10 py-1"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase opacity-30">Work Mode</label>
                      <input 
                        value={draftHero.workMode} 
                        onChange={(e) => setDraftHero({...draftHero, workMode: e.target.value})}
                        className="w-full bg-transparent border-b border-black/10 py-1"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Management */}
              <div className="mb-12">
                <h3 className="text-xs font-bold uppercase tracking-widest opacity-40 mb-6 flex items-center gap-2">
                  <Globe size={14} /> Key Metrics
                </h3>
                <div className="space-y-4">
                  {(draftStats || []).map((stat, i) => (
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

              {/* Best Performance Management */}
              <div className="mb-12">
                <h3 className="text-xs font-bold uppercase tracking-widest opacity-40 mb-6 flex items-center gap-2">
                  <Target size={14} /> Best Performance
                </h3>
                <div className="space-y-4">
                  {(draftBestCampaigns || []).map((campaign, i) => (
                    <div key={i} className="p-6 border border-black/10 bg-white/50 rounded-xl space-y-4">
                      <div className="flex justify-between">
                        <input 
                          value={campaign.name} 
                          onChange={(e) => {
                            const newList = [...draftBestCampaigns];
                            newList[i].name = e.target.value;
                            setDraftBestCampaigns(newList);
                          }}
                          className="bg-transparent border-b border-black/10 py-1 font-bold w-full mr-4"
                          placeholder="Campaign Name"
                        />
                        <button 
                          onClick={() => setDraftBestCampaigns(draftBestCampaigns.filter((_, idx) => idx !== i))}
                          className="text-black/20 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase opacity-30">Conversions</label>
                          <input 
                            type="number"
                            value={campaign.conversions} 
                            onChange={(e) => {
                              const newList = [...draftBestCampaigns];
                              newList[i].conversions = Number(e.target.value);
                              setDraftBestCampaigns(newList);
                            }}
                            className="w-full bg-transparent border-b border-black/10 py-1 text-sm"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase opacity-30">Conv. Rate</label>
                          <input 
                            value={campaign.convRate} 
                            onChange={(e) => {
                              const newList = [...draftBestCampaigns];
                              newList[i].convRate = e.target.value;
                              setDraftBestCampaigns(newList);
                            }}
                            className="w-full bg-transparent border-b border-black/10 py-1 text-sm"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase opacity-30">Spent</label>
                          <input 
                            type="number"
                            value={campaign.spent} 
                            onChange={(e) => {
                              const newList = [...draftBestCampaigns];
                              newList[i].spent = Number(e.target.value);
                              setDraftBestCampaigns(newList);
                            }}
                            className="w-full bg-transparent border-b border-black/10 py-1 text-sm"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase opacity-30">Cost per Conv.</label>
                          <input 
                            type="number"
                            step="0.01"
                            value={campaign.costPerConv} 
                            onChange={(e) => {
                              const newList = [...draftBestCampaigns];
                              newList[i].costPerConv = Number(e.target.value);
                              setDraftBestCampaigns(newList);
                            }}
                            className="w-full bg-transparent border-b border-black/10 py-1 text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <button 
                    onClick={() => setDraftBestCampaigns([...draftBestCampaigns, { name: 'New Campaign', spent: 0, cpc: 0, cpm: 0, impressions: 0, clicks: 0, ctr: '0%', conversions: 0, costPerConv: 0, convRate: '0%' }])}
                    className="w-full p-4 border border-dashed border-black/20 rounded-xl flex items-center justify-center gap-2 opacity-40 hover:opacity-100 transition-opacity"
                  >
                    <Plus size={16} /> Add Best Campaign
                  </button>
                </div>
              </div>

              {/* Snapchat Performance Management */}
              <div className="mb-12">
                <h3 className="text-xs font-bold uppercase tracking-widest opacity-40 mb-6 flex items-center gap-2">
                  <BarChart3 size={14} /> Snapchat Performance
                </h3>
                
                {/* Visual Chart for Snapchat Performance */}
                <div className="mb-8 p-6 bg-white/50 border border-black/10 rounded-2xl h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={(draftSnapchatCampaigns || []).slice(0, 8)}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                      <XAxis 
                        dataKey="name" 
                        fontSize={10} 
                        tickLine={false} 
                        axisLine={false}
                        tick={{ fill: 'rgba(0,0,0,0.4)' }}
                      />
                      <YAxis 
                        fontSize={10} 
                        tickLine={false} 
                        axisLine={false}
                        tick={{ fill: 'rgba(0,0,0,0.4)' }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#fff', 
                          borderRadius: '12px', 
                          border: '1px solid rgba(0,0,0,0.1)',
                          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
                        }}
                      />
                      <Legend 
                        verticalAlign="top" 
                        align="right" 
                        iconType="circle"
                        wrapperStyle={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '0.05em', paddingBottom: '20px' }}
                      />
                      <Bar dataKey="spent" name="Spent ($)" fill="#000" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="result" name="Results" fill="#FFFC00" stroke="#000" strokeWidth={1} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                  <p className="text-[10px] text-center mt-2 opacity-30 font-bold uppercase tracking-widest">Spent vs Results (Top 8)</p>
                </div>

                <div className="mb-8 p-6 bg-white/50 border border-black/10 rounded-2xl h-[300px]">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-4 text-center">Spend Distribution</h4>
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={(draftSnapchatCampaigns || []).slice(0, 5)}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="spent"
                        nameKey="name"
                      >
                        {(draftSnapchatCampaigns || []).slice(0, 5).map((_, index) => (
                          <Cell key={`cell-${index}`} fill={['#000', '#FFFC00', '#333', '#666', '#999'][index % 5]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#fff', 
                          borderRadius: '12px', 
                          border: '1px solid rgba(0,0,0,0.1)',
                          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
                        }}
                      />
                      <Legend 
                        verticalAlign="bottom" 
                        align="center" 
                        iconType="circle"
                        wrapperStyle={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '0.05em', paddingTop: '20px' }}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-4">
                  <div className="max-h-96 overflow-y-auto space-y-2 pr-2">
                    {(draftSnapchatCampaigns || []).map((campaign, i) => (
                      <div key={i} className="p-4 border border-black/10 bg-white/50 rounded-xl flex gap-4 items-center">
                        <div className="flex-1 grid grid-cols-3 gap-2">
                          <input 
                            value={campaign.name} 
                            onChange={(e) => {
                              const newList = [...draftSnapchatCampaigns];
                              newList[i].name = e.target.value;
                              setDraftSnapchatCampaigns(newList);
                            }}
                            className="bg-transparent border-b border-black/10 py-1 text-xs font-bold"
                            placeholder="Name"
                          />
                          <input 
                            value={campaign.spent} 
                            type="number"
                            onChange={(e) => {
                              const newList = [...draftSnapchatCampaigns];
                              newList[i].spent = Number(e.target.value);
                              setDraftSnapchatCampaigns(newList);
                            }}
                            className="bg-transparent border-b border-black/10 py-1 text-xs"
                            placeholder="Spent"
                          />
                          <input 
                            value={campaign.result} 
                            type="number"
                            onChange={(e) => {
                              const newList = [...draftSnapchatCampaigns];
                              newList[i].result = Number(e.target.value);
                              setDraftSnapchatCampaigns(newList);
                            }}
                            className="bg-transparent border-b border-black/10 py-1 text-xs"
                            placeholder="Result"
                          />
                        </div>
                        <button 
                          onClick={() => setDraftSnapchatCampaigns(draftSnapchatCampaigns.filter((_, idx) => idx !== i))}
                          className="text-black/20 hover:text-red-500"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={() => setDraftSnapchatCampaigns([...draftSnapchatCampaigns, { id: Date.now().toString(), name: 'New', status: 'Paused', spent: 0, result: 0, type: 'LPV', cost: 0, impressions: 0, clicks: 0 }])}
                    className="w-full p-4 border border-dashed border-black/20 rounded-xl flex items-center justify-center gap-2 opacity-40 hover:opacity-100 transition-opacity"
                  >
                    <Plus size={16} /> Add Snapchat Entry
                  </button>
                </div>
              </div>

              {/* Projects Management */}
              <div className="mb-12">
                <h3 className="text-xs font-bold uppercase tracking-widest opacity-40 mb-6 flex items-center gap-2">
                  <Layers size={14} /> Projects
                </h3>
                <div className="space-y-4">
                  {(draftProjects || []).map((project, i) => (
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
                  {(draftExperiences || []).map((exp, i) => (
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
                        {(exp.description || []).map((desc, j) => (
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
                  {(draftSkills || []).map((skill, i) => (
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
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="md:w-2/3"
              >
                <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-[0.9] mb-8 uppercase">
                  {hero.title} <br />
                  <span className="italic font-serif font-light">{hero.subtitle}</span> {hero.suffix}
                </h1>
                <p className="max-w-2xl text-xl text-black/60 leading-relaxed mb-12">
                  {hero.description}
                </p>
                <div className="flex flex-wrap gap-4">
                  <a href="#contact" className="px-8 py-4 bg-black text-white rounded-full font-medium hover:bg-black/80 transition-colors flex items-center gap-2">
                    Work with me <ChevronRight size={16} />
                  </a>
                  <div className="px-8 py-4 border border-black/10 rounded-full font-medium flex items-center gap-4">
                    <span className="flex items-center gap-2 text-sm"><MapPin size={14} /> {hero.location}</span>
                    <span className="w-px h-4 bg-black/10"></span>
                    <span className="flex items-center gap-2 text-sm"><Globe size={14} /> {hero.workMode}</span>
                  </div>
                </div>
              </motion.div>
              
              {hero.image && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="md:w-1/3 relative"
                >
                  <div className="aspect-square rounded-full overflow-hidden border-8 border-white shadow-2xl relative z-10">
                    <img 
                      src={hero.image} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  {/* Decorative elements */}
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#FFFC00] rounded-full -z-0 blur-2xl opacity-50" />
                  <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-black/5 rounded-full -z-0 blur-xl" />
                </motion.div>
              )}
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section id="results" className="py-24 px-6 bg-black text-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
              {(stats || []).map((stat, i) => {
                const Icon = IconMap[stat.icon] || Globe;
                return (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="p-8 border border-white/10 rounded-3xl hover:bg-white/5 transition-colors"
                  >
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                      <Icon size={24} />
                    </div>
                    <div className="text-4xl font-bold tracking-tighter mb-2">{stat.value}</div>
                    <div className="text-xs font-bold uppercase tracking-widest opacity-40">{stat.label}</div>
                    <div className="text-[10px] uppercase tracking-widest mt-2 opacity-20">{stat.sub}</div>
                  </motion.div>
                );
              })}
            </div>

            {/* Best Performance Section */}
            <div className="mb-32">
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h2 className="text-4xl font-bold tracking-tighter mb-4">Best Performance</h2>
                  <p className="text-white/40 max-w-xl">High-impact campaigns with exceptional conversion rates and cost efficiency across various platforms.</p>
                </div>
                <div className="hidden md:block">
                  <div className="px-4 py-2 border border-white/20 rounded-full text-[10px] font-bold uppercase tracking-widest">
                    Top Performers
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {(bestCampaignsList || []).map((campaign, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="p-8 border border-white/10 rounded-3xl bg-white/5 hover:bg-white/10 transition-all group"
                  >
                    <div className="flex justify-between items-start mb-8">
                      <h3 className="text-2xl font-bold tracking-tight">{campaign.name}</h3>
                      <div className="px-2 py-1 bg-green-500/20 text-green-500 rounded text-[8px] font-bold uppercase tracking-widest">Featured</div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6 mb-8">
                      <div>
                        <div className="text-[10px] uppercase tracking-widest opacity-40 mb-1">Conversions</div>
                        <div className="text-2xl font-bold">{(campaign.conversions || 0).toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase tracking-widest opacity-40 mb-1">Conv. Rate</div>
                        <div className="text-2xl font-bold text-green-500">{campaign.convRate || '0%'}</div>
                      </div>
                    </div>

                    <div className="space-y-4 pt-6 border-t border-white/10">
                      <div className="flex justify-between text-sm">
                        <span className="opacity-40">Spent</span>
                        <span className="font-mono">${(campaign.spent || 0).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="opacity-40">CTR</span>
                        <span className="font-bold">{campaign.ctr || '0%'}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="opacity-40">Cost per Conv.</span>
                        <span className="font-bold text-green-500">${(campaign.costPerConv || 0).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="opacity-40">CPC</span>
                        <span className="font-mono">${(campaign.cpc || 0).toFixed(2)}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Snapchat Detailed Results */}
            <div className="mb-24">
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h2 className="text-4xl font-bold tracking-tighter mb-4">Snapchat Performance</h2>
                  <p className="text-white/40 max-w-xl">Detailed breakdown of the last quarter campaigns for Sound & Fog Cafe, demonstrating consistent growth and efficient scaling.</p>
                </div>
                <div className="hidden md:block">
                  <div className="px-4 py-2 border border-white/20 rounded-full text-[10px] font-bold uppercase tracking-widest">
                    Last Quarter Data
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="py-6 text-[10px] font-bold uppercase tracking-widest opacity-40">Campaign Name</th>
                      <th className="py-6 text-[10px] font-bold uppercase tracking-widest opacity-40">Status</th>
                      <th className="py-6 text-[10px] font-bold uppercase tracking-widest opacity-40">Spent</th>
                      <th className="py-6 text-[10px] font-bold uppercase tracking-widest opacity-40">Results</th>
                      <th className="py-6 text-[10px] font-bold uppercase tracking-widest opacity-40">Impressions</th>
                      <th className="py-6 text-[10px] font-bold uppercase tracking-widest opacity-40">Cost/Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(snapchatCampaignsList || []).map((campaign, i) => (
                      <tr key={campaign.id || i} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                        <td className="py-6 font-medium">{campaign.name}</td>
                        <td className="py-6">
                          <span className={`px-2 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest ${campaign.status === 'Active' ? 'bg-green-500/20 text-green-500' : 'bg-white/10 text-white/40'}`}>
                            {campaign.status}
                          </span>
                        </td>
                        <td className="py-6 font-mono text-sm">${(campaign.spent || 0).toFixed(2)}</td>
                        <td className="py-6">
                          <div className="font-bold">{campaign.result || 0}</div>
                          <div className="text-[8px] uppercase tracking-widest opacity-40">{campaign.type}</div>
                        </td>
                        <td className="py-6 font-mono text-sm opacity-60">{(campaign.impressions || 0).toLocaleString()}</td>
                        <td className="py-6 font-bold text-sm">${(campaign.cost || 0).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
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
              {(projects || []).map((project, i) => (
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
                      {(project.tags || []).map((tag, j) => (
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
                {(experiences || []).map((exp, i) => (
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
                      {(exp.description || []).map((item, j) => (
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
                  {(skills || []).filter(s => s.category === 'Platform').map((skill, i) => (
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
                  {(skills || []).filter(s => s.category === 'Skill').map((skill, i) => (
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
                  {(skills || []).filter(s => s.category === 'Tool').map((skill, i) => (
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
