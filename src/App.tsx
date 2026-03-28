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
  User,
  Camera,
  LogOut,
  LogIn,
  Brain,
  MessageSquare,
  Send,
  Loader2
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
import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import { 
  auth, 
  db, 
  googleProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  onSnapshot, 
  query, 
  where,
  type User as FirebaseUser
} from './firebase';

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
  image: ''
};

const initialStats = [
  { label: 'Total Impressions', value: '1.58M+', sub: 'Aggregated Campaigns', icon: 'Globe' },
  { label: 'Total Conversions', value: '0', sub: 'High-Intent Actions', icon: 'Target' },
  { label: 'Total Clicks', value: '24K+', sub: 'Traffic & Engagement', icon: 'MousePointer2' },
  { label: 'Avg. CPC', value: '$0.22', sub: 'Optimized Bidding', icon: 'TrendingUp' },
];

const bestCampaigns = [
  { name: 'ugc', spent: 474.19, cpc: 0.03, cpm: 1.90, impressions: 249262, clicks: 17885, ctr: '7.18%', conversions: 12426, costPerConv: 0.04, convRate: '4.99%' },
  { name: 'chrismas', spent: 60.00, cpc: 0.01, cpm: 1.61, impressions: 37382, clicks: 10469, ctr: '28.01%', conversions: 7558, costPerConv: 0.01, convRate: '20.22%' },
  { name: 'Traffic20', spent: 100.00, cpc: 0.01, cpm: 2.04, impressions: 48978, clicks: 12864, ctr: '26.26%', conversions: 9161, costPerConv: 0.01, convRate: '18.70%' },
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

const initialGoogleAdsCampaigns = [
  { id: '1', name: 'اول كامبين', status: 'Paused', spent: 299.16, result: 1780, type: 'Clicks', cost: 0.17, impressions: 81400, clicks: 1780 },
  { id: '2', name: 'ساوند 2', status: 'Active', spent: 2035.61, result: 11498, type: 'Clicks', cost: 0.18, impressions: 864533, clicks: 11498 },
  { id: '3', name: 'MA7', status: 'Paused', spent: 3147.29, result: 11445, type: 'Clicks', cost: 0.27, impressions: 641165, clicks: 11445 },
];

const initialTikTokCampaigns = [
  { id: '1', name: 'ugc', status: 'Paused', spent: 474.19, result: 17885, type: 'Clicks', cost: 0.03, impressions: 249262, clicks: 17885 },
  { id: '2', name: 'chrismas', status: 'Paused', spent: 60.00, result: 10469, type: 'Clicks', cost: 0.01, impressions: 37382, clicks: 10469 },
  { id: '3', name: 'Traffic20', status: 'Paused', spent: 100.00, result: 12864, type: 'Clicks', cost: 0.01, impressions: 48978, clicks: 12864 },
  { id: '4', name: 'المبيعات 14', status: 'Paused', spent: 56.79, result: 181, type: 'Clicks', cost: 0.31, impressions: 12688, clicks: 181 },
  { id: '5', name: 'عرض 25', status: 'Paused', spent: 296.47, result: 1417, type: 'Clicks', cost: 0.21, impressions: 94429, clicks: 1417 },
  { id: '6', name: 'المبيعات 09', status: 'Paused', spent: 657.76, result: 2545, type: 'Clicks', cost: 0.26, impressions: 248401, clicks: 2545 },
  { id: '7', name: 'reel 2', status: 'Paused', spent: 400.00, result: 1944, type: 'Clicks', cost: 0.21, impressions: 105749, clicks: 1944 },
  { id: '8', name: 'reel no', status: 'Paused', spent: 149.96, result: 963, type: 'Clicks', cost: 0.16, impressions: 45366, clicks: 963 },
  { id: '9', name: 'ramadan', status: 'Paused', spent: 200.00, result: 664, type: 'Clicks', cost: 0.30, impressions: 39522, clicks: 664 },
  { id: '10', name: 'رمضات 25', status: 'Paused', spent: 300.00, result: 848, type: 'Clicks', cost: 0.35, impressions: 65522, clicks: 848 },
  { id: '11', name: 'يوم التاسيس', status: 'Paused', spent: 148.41, result: 477, type: 'Clicks', cost: 0.31, impressions: 43108, clicks: 477 },
  { id: '12', name: 'مصطفي', status: 'Paused', spent: 150.00, result: 464, type: 'Clicks', cost: 0.32, impressions: 55374, clicks: 464 },
  { id: '13', name: 'mostafa', status: 'Paused', spent: 100.00, result: 356, type: 'Clicks', cost: 0.28, impressions: 29087, clicks: 356 },
  { id: '14', name: 'valantine', status: 'Paused', spent: 150.00, result: 572, type: 'Clicks', cost: 0.26, impressions: 53913, clicks: 572 },
  { id: '15', name: 'برومو 59', status: 'Paused', spent: 299.37, result: 1046, type: 'Clicks', cost: 0.29, impressions: 87618, clicks: 1046 },
  { id: '16', name: 'اليوم الوطني', status: 'Paused', spent: 500.00, result: 1505, type: 'Clicks', cost: 0.33, impressions: 207943, clicks: 1505 },
  { id: '17', name: 'reel6', status: 'Paused', spent: 500.00, result: 1418, type: 'Clicks', cost: 0.35, impressions: 141878, clicks: 1418 },
];

const initialExperiences = [
  {
    role: 'Media Buyer',
    company: 'Freelance',
    period: 'Oct 2024 - Present',
    image: '',
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
    image: '',
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
    image: '',
    tags: ['Meta Ads', 'TikTok', 'E-commerce']
  },
  {
    title: 'F&B Lead Generation',
    description: 'Increased store visits for Sound & Fog Cafe by 40% through localized Snapchat and Instagram campaigns targeting high-intent foodies.',
    link: '#',
    image: '',
    tags: ['Snapchat', 'Instagram', 'Local SEO']
  },
  {
    title: 'Luxury Beauty Campaign',
    description: 'Achieved 100% female audience penetration for a luxury beauty brand using iOS-specific targeting on Snapchat Ads.',
    link: '#',
    image: '',
    tags: ['Snapchat', 'iOS Targeting', 'Luxury']
  },
  {
    title: 'Real Estate Funnel Optimization',
    description: 'Developed a full-funnel strategy for a real estate client, reducing CPL by 25% through advanced retargeting and lookalike audiences.',
    link: '#',
    image: '',
    tags: ['Google Ads', 'Retargeting', 'Real Estate']
  }
];

const initialInsights = [
  {
    id: '1',
    title: 'TikTok UGC Strategy',
    market: 'UGC Campaign - High Engagement',
    metrics: [
      { label: 'Total Clicks', value: '17,885' },
      { label: 'Avg. CPC', value: '$0.03' }
    ],
    description: 'Achieved exceptional performance with a 7.18% CTR, driving high-quality traffic through authentic UGC content at a very low cost per click.',
    icon: 'Smartphone',
    color: '#EE1D52'
  },
  {
    id: '2',
    title: 'Google Ads Performance',
    market: 'Search & Display - Sound 2',
    metrics: [
      { label: 'Impressions', value: '864K+' },
      { label: 'Clicks', value: '11,498' }
    ],
    description: 'Scaled reach significantly with over 864,000 impressions, maintaining a consistent flow of traffic with an optimized CPC of $0.18.',
    icon: 'Globe',
    color: '#4285F4'
  },
  {
    id: '3',
    title: 'Snapchat Sales Funnel',
    market: 'UGC Ad - Conversion Focus',
    metrics: [
      { label: 'LPV', value: '1,219' },
      { label: 'Cost per LPV', value: '$0.42' }
    ],
    description: 'Successfully drove high-intent users to landing pages with a focused UGC approach on Snapchat, achieving a competitive cost per landing page view.',
    icon: 'Zap',
    color: '#FFFC00'
  }
];

export default function App() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [showAdminButton, setShowAdminButton] = useState(false);
  const [isConfirmingSave, setIsConfirmingSave] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const formRef = useRef<HTMLFormElement>(null);
  
  // AI Assistant State
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [aiMessage, setAiMessage] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [highThinkingMode, setHighThinkingMode] = useState(false);

  // Portfolio State
  const [hero, setHero] = useState(initialHero);
  const [stats, setStats] = useState(initialStats);
  const [bestCampaignsList, setBestCampaignsList] = useState(bestCampaigns);
  const [snapchatCampaignsList, setSnapchatCampaignsList] = useState(snapchatCampaigns);
  const [googleAdsCampaignsList, setGoogleAdsCampaignsList] = useState(initialGoogleAdsCampaigns);
  const [tiktokCampaignsList, setTiktokCampaignsList] = useState(initialTikTokCampaigns);
  const [experiences, setExperiences] = useState(initialExperiences);
  const [skills, setSkills] = useState(initialSkills);
  const [projects, setProjects] = useState(initialProjects);
  const [insights, setInsights] = useState(initialInsights);

  // Draft States for Admin
  const [draftHero, setDraftHero] = useState(hero);
  const [draftStats, setDraftStats] = useState(stats);
  const [draftBestCampaigns, setDraftBestCampaigns] = useState(bestCampaignsList);
  const [draftSnapchatCampaigns, setDraftSnapchatCampaigns] = useState(snapchatCampaignsList);
  const [draftGoogleAdsCampaigns, setDraftGoogleAdsCampaigns] = useState(googleAdsCampaignsList);
  const [draftTiktokCampaigns, setDraftTiktokCampaigns] = useState(tiktokCampaignsList);
  const [draftExperiences, setDraftExperiences] = useState(experiences);
  const [draftSkills, setDraftSkills] = useState(skills);
  const [draftProjects, setDraftProjects] = useState(projects);
  const [draftInsights, setDraftInsights] = useState(insights);

  // Firebase Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  // Sync with Firestore when user is logged in
  useEffect(() => {
    if (!user) {
      // Load from localStorage if not logged in
      try {
        const savedHero = localStorage.getItem('portfolio_hero');
        const savedStats = localStorage.getItem('portfolio_stats');
        const savedBest = localStorage.getItem('portfolio_best');
        const savedSnap = localStorage.getItem('portfolio_snap');
        const savedGoogle = localStorage.getItem('portfolio_google');
        const savedTiktok = localStorage.getItem('portfolio_tiktok');
        const savedExp = localStorage.getItem('portfolio_exp');
        const savedSkills = localStorage.getItem('portfolio_skills');
        const savedProjects = localStorage.getItem('portfolio_projects');
        const savedInsights = localStorage.getItem('portfolio_insights');

        if (savedHero) setHero(JSON.parse(savedHero));
        if (savedStats) setStats(JSON.parse(savedStats));
        if (savedBest) setBestCampaignsList(JSON.parse(savedBest));
        if (savedSnap) setSnapchatCampaignsList(JSON.parse(savedSnap));
        if (savedGoogle) setGoogleAdsCampaignsList(JSON.parse(savedGoogle));
        if (savedTiktok) setTiktokCampaignsList(JSON.parse(savedTiktok));
        if (savedExp) setExperiences(JSON.parse(savedExp));
        if (savedSkills) setSkills(JSON.parse(savedSkills));
        if (savedProjects) setProjects(JSON.parse(savedProjects));
        if (savedInsights) setInsights(JSON.parse(savedInsights));
      } catch (error) {
        console.error('Failed to load data from localStorage:', error);
      }
      return;
    }

    // Listen to Hero
    const unsubHero = onSnapshot(doc(db, 'users', user.uid, 'settings', 'hero'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as typeof initialHero;
        setHero(data);
        setDraftHero(data);
      }
    });

    // Listen to Stats
    const unsubStats = onSnapshot(collection(db, 'users', user.uid, 'stats'), (querySnap) => {
      if (!querySnap.empty) {
        const data = querySnap.docs.map(d => d.data() as typeof initialStats[0]);
        setStats(data);
        setDraftStats(data);
      }
    });

    // Listen to Snapchat
    const unsubSnapchat = onSnapshot(collection(db, 'users', user.uid, 'campaigns_snapchat'), (querySnap) => {
      if (!querySnap.empty) {
        const data = querySnap.docs.map(d => d.data() as typeof snapchatCampaigns[0]);
        setSnapchatCampaignsList(data);
        setDraftSnapchatCampaigns(data);
      }
    });

    // Listen to Google Ads
    const unsubGoogleAds = onSnapshot(collection(db, 'users', user.uid, 'campaigns_google_ads'), (querySnap) => {
      if (!querySnap.empty) {
        const data = querySnap.docs.map(d => d.data() as typeof initialGoogleAdsCampaigns[0]);
        setGoogleAdsCampaignsList(data);
        setDraftGoogleAdsCampaigns(data);
      }
    });

    // Listen to TikTok
    const unsubTikTok = onSnapshot(collection(db, 'users', user.uid, 'campaigns_tiktok'), (querySnap) => {
      if (!querySnap.empty) {
        const data = querySnap.docs.map(d => d.data() as typeof initialTikTokCampaigns[0]);
        setTiktokCampaignsList(data);
        setDraftTiktokCampaigns(data);
      }
    });

    // Listen to Experiences
    const unsubExperiences = onSnapshot(collection(db, 'users', user.uid, 'experiences'), (querySnap) => {
      if (!querySnap.empty) {
        const data = querySnap.docs.map(d => d.data() as typeof initialExperiences[0]);
        setExperiences(data);
        setDraftExperiences(data);
      }
    });

    // Listen to Skills
    const unsubSkills = onSnapshot(collection(db, 'users', user.uid, 'skills'), (querySnap) => {
      if (!querySnap.empty) {
        const data = querySnap.docs.map(d => d.data() as typeof initialSkills[0]);
        setSkills(data);
        setDraftSkills(data);
      }
    });

    // Listen to Projects
    const unsubProjects = onSnapshot(collection(db, 'users', user.uid, 'projects'), (querySnap) => {
      if (!querySnap.empty) {
        const data = querySnap.docs.map(d => d.data() as typeof initialProjects[0]);
        setProjects(data);
        setDraftProjects(data);
      }
    });

    // Listen to Insights
    const unsubInsights = onSnapshot(collection(db, 'users', user.uid, 'insights'), (querySnap) => {
      if (!querySnap.empty) {
        const data = querySnap.docs.map(d => d.data() as typeof initialInsights[0]);
        setInsights(data);
        setDraftInsights(data);
      }
    });

    return () => {
      unsubHero();
      unsubStats();
      unsubSnapchat();
      unsubGoogleAds();
      unsubTikTok();
      unsubExperiences();
      unsubSkills();
      unsubProjects();
      unsubInsights();
    };
  }, [user]);

  // Admin Access Logic
  useEffect(() => {
    const adminSecret = import.meta.env.VITE_ADMIN_SECRET;
    const urlParams = new URLSearchParams(window.location.search);
    const accessParam = urlParams.get('admin_access');
    const hasSavedAccess = localStorage.getItem('admin_access_unlocked') === 'true';

    if (hasSavedAccess || (adminSecret && accessParam === adminSecret) || import.meta.env.DEV) {
      setShowAdminButton(true);
      if (accessParam === adminSecret) {
        localStorage.setItem('admin_access_unlocked', 'true');
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, []);

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Sign in error:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const openAdmin = () => {
    setDraftHero({ ...hero });
    setDraftStats([...stats]);
    setDraftBestCampaigns(JSON.parse(JSON.stringify(bestCampaignsList)));
    setDraftSnapchatCampaigns(JSON.parse(JSON.stringify(snapchatCampaignsList)));
    setDraftGoogleAdsCampaigns(JSON.parse(JSON.stringify(googleAdsCampaignsList)));
    setDraftTiktokCampaigns(JSON.parse(JSON.stringify(tiktokCampaignsList)));
    setDraftExperiences(JSON.parse(JSON.stringify(experiences)));
    setDraftSkills([...skills]);
    setDraftProjects(JSON.parse(JSON.stringify(projects)));
    setDraftInsights(JSON.parse(JSON.stringify(insights)));
    setIsAdminOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        console.error("Image size too large. Please choose an image smaller than 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          // Simple compression using canvas
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
            
            // Max dimension 800px
            const maxDim = 800;
            if (width > height) {
              if (width > maxDim) {
                height *= maxDim / width;
                width = maxDim;
              }
            } else {
              if (height > maxDim) {
                width *= maxDim / height;
                height = maxDim;
              }
            }
            
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0, width, height);
            
            // Export as compressed JPEG
            const compressed = canvas.toDataURL('image/jpeg', 0.7);
            callback(compressed);
          };
          img.src = reader.result;
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const saveToFirestore = async () => {
    if (!user) return;

    try {
      await setDoc(doc(db, 'users', user.uid, 'settings', 'hero'), draftHero);

      const statsCol = collection(db, 'users', user.uid, 'stats');
      for (const stat of draftStats) {
        await setDoc(doc(statsCol, stat.label), stat);
      }

      const snapCol = collection(db, 'users', user.uid, 'campaigns_snapchat');
      for (const camp of draftSnapchatCampaigns) {
        await setDoc(doc(snapCol, camp.id), camp);
      }

      const googleCol = collection(db, 'users', user.uid, 'campaigns_google_ads');
      for (const camp of draftGoogleAdsCampaigns) {
        await setDoc(doc(googleCol, camp.id), camp);
      }

      const tiktokCol = collection(db, 'users', user.uid, 'campaigns_tiktok');
      for (const camp of draftTiktokCampaigns) {
        await setDoc(doc(tiktokCol, camp.id), camp);
      }

      const expCol = collection(db, 'users', user.uid, 'experiences');
      for (const exp of draftExperiences) {
        await setDoc(doc(expCol, exp.company), exp);
      }

      const skillCol = collection(db, 'users', user.uid, 'skills');
      for (const skill of draftSkills) {
        await setDoc(doc(skillCol, skill.name), skill);
      }

      const projCol = collection(db, 'users', user.uid, 'projects');
      for (const proj of draftProjects) {
        await setDoc(doc(projCol, proj.title), proj);
      }

      const insightCol = collection(db, 'users', user.uid, 'insights');
      for (const insight of draftInsights) {
        await setDoc(doc(insightCol, insight.id), insight);
      }
    } catch (error) {
      console.error("Save error:", error);
      throw error;
    }
  };

  const saveToLocal = async () => {
    setHero(draftHero);
    setStats(draftStats);
    setBestCampaignsList(draftBestCampaigns);
    setSnapchatCampaignsList(draftSnapchatCampaigns);
    setGoogleAdsCampaignsList(draftGoogleAdsCampaigns);
    setTiktokCampaignsList(draftTiktokCampaigns);
    setExperiences(draftExperiences);
    setSkills(draftSkills);
    setProjects(draftProjects);
    setInsights(draftInsights);
    
    const safeSave = (key: string, data: any) => {
      try {
        localStorage.setItem(key, JSON.stringify(data));
      } catch (e) {
        if (e instanceof DOMException && (e.code === 22 || e.code === 1014 || e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED')) {
          console.warn(`LocalStorage quota exceeded for ${key}. Data will only be saved to cloud.`);
        } else {
          console.error(`Error saving ${key} to localStorage:`, e);
        }
      }
    };

    safeSave('portfolio_hero', draftHero);
    safeSave('portfolio_stats', draftStats);
    safeSave('portfolio_best', draftBestCampaigns);
    safeSave('portfolio_snap', draftSnapchatCampaigns);
    safeSave('portfolio_google', draftGoogleAdsCampaigns);
    safeSave('portfolio_tiktok', draftTiktokCampaigns);
    safeSave('portfolio_exp', draftExperiences);
    safeSave('portfolio_skills', draftSkills);
    safeSave('portfolio_projects', draftProjects);
    safeSave('portfolio_insights', draftInsights);

    if (user) {
      try {
        await saveToFirestore();
      } catch (error) {
        alert("Error saving to Firestore. Data saved locally.");
      }
    }

    setIsAdminOpen(false);
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
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }).catch(err => console.error('Google Sheets Error:', err));
      }

      if (!serviceId || !templateId || !publicKey) {
        setTimeout(() => {
          setFormStatus('success');
          formRef.current?.reset();
          setTimeout(() => setFormStatus('idle'), 5000);
        }, 1500);
        return;
      }

      await emailjs.sendForm(serviceId, templateId, formRef.current, publicKey);

      setFormStatus('success');
      formRef.current.reset();
      setTimeout(() => setFormStatus('idle'), 5000);
    } catch (error) {
      console.error('Failed to send email:', error);
      setFormStatus('error');
      setTimeout(() => setFormStatus('idle'), 5000);
    }
  };

  const handleAskAI = async () => {
    if (!aiMessage.trim()) return;
    setIsAiLoading(true);
    setAiResponse('');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const modelName = highThinkingMode ? "gemini-3.1-pro-preview" : "gemini-3-flash-preview";
      
      const config: any = {
        systemInstruction: "You are an AI Assistant for a Media Buyer's portfolio. You help users understand the media buyer's experience, skills, and campaign performance. Be professional and concise.",
      };

      if (highThinkingMode) {
        config.thinkingConfig = { thinkingLevel: ThinkingLevel.HIGH };
      }

      const response = await ai.models.generateContent({
        model: modelName,
        contents: aiMessage,
        config: config
      });

      setAiResponse(response.text || "No response from AI.");
    } catch (error) {
      console.error("AI Error:", error);
      setAiResponse("Error communicating with AI. Please try again.");
    } finally {
      setIsAiLoading(false);
    }
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

      {/* AI Assistant Toggle */}
      <button 
        onClick={() => setShowAIAssistant(true)}
        className="fixed bottom-24 right-8 w-14 h-14 bg-white text-black rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-40 border border-black/10"
      >
        <MessageSquare size={24} />
      </button>

      {/* AI Assistant Modal */}
      <AnimatePresence>
        {showAIAssistant && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-8 right-8 w-96 max-h-[600px] bg-white text-black rounded-3xl shadow-2xl z-50 flex flex-col border border-black/10 overflow-hidden"
          >
            <div className="p-6 border-b border-black/10 flex items-center justify-between bg-black text-white">
              <div className="flex items-center gap-3">
                <Brain size={20} className="text-white" />
                <div>
                  <h3 className="text-sm font-bold tracking-tighter">AI Portfolio Assistant</h3>
                  <p className="text-[8px] uppercase tracking-widest opacity-60">Powered by Gemini 3.1 Pro</p>
                </div>
              </div>
              <button onClick={() => setShowAIAssistant(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 p-6 overflow-y-auto space-y-4 min-h-[300px]">
              {aiResponse ? (
                <div className="bg-black/5 p-4 rounded-2xl text-sm leading-relaxed">
                  {aiResponse}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                  <Brain size={40} />
                  <p className="text-xs font-medium">Ask me anything about this portfolio or media buying strategies.</p>
                </div>
              )}
              {isAiLoading && (
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-40 animate-pulse">
                  <Loader2 size={14} className="animate-spin" /> Thinking...
                </div>
              )}
            </div>

            <div className="p-6 border-t border-black/10 space-y-4 bg-black/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    onClick={() => setHighThinkingMode(!highThinkingMode)}
                    className={`w-10 h-5 rounded-full transition-colors cursor-pointer relative ${highThinkingMode ? 'bg-black' : 'bg-black/20'}`}
                  >
                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${highThinkingMode ? 'left-6' : 'left-1'}`} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest">High Thinking Mode</span>
                </div>
                {highThinkingMode && <Zap size={12} className="text-black animate-pulse" />}
              </div>

              <div className="relative">
                <input 
                  value={aiMessage}
                  onChange={(e) => setAiMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAskAI()}
                  placeholder="Type your question..."
                  className="w-full bg-white border border-black/10 rounded-2xl px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
                />
                <button 
                  onClick={handleAskAI}
                  disabled={isAiLoading || !aiMessage.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black text-white rounded-xl disabled:opacity-20 transition-opacity"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
              className="w-full sm:max-w-2xl bg-[var(--color-brand-bg)] h-full shadow-2xl overflow-y-auto p-4 sm:p-8 border-l border-black/10"
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

              {/* Profile & Hero Management */}
              <div className="mb-12">
                <h3 className="text-xs font-bold uppercase tracking-widest opacity-40 mb-6 flex items-center gap-2">
                  <User size={14} /> Profile & Hero Section
                </h3>
                <div className="space-y-6 p-6 border border-black/10 bg-white/50 rounded-xl">
                  {/* Profile Image - Moved to top and made more prominent */}
                  <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-black/5 rounded-2xl bg-black/[0.02]">
                    <div className="relative group">
                      <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl bg-gray-100 flex items-center justify-center">
                        {draftHero.image ? (
                          <img src={draftHero.image} alt="Profile Preview" className="w-full h-full object-cover" />
                        ) : (
                          <User size={48} className="text-black/20" />
                        )}
                      </div>
                      <label className="absolute bottom-0 right-0 p-2 bg-black text-white rounded-full cursor-pointer shadow-lg hover:scale-110 transition-transform">
                        <Camera size={18} />
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => handleImageUpload(e, (base64) => {
                            setDraftHero({...draftHero, image: base64});
                          })}
                        />
                      </label>
                      {draftHero.image && (
                        <button 
                          onClick={() => setDraftHero({...draftHero, image: ''})}
                          className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full cursor-pointer shadow-lg hover:scale-110 transition-transform"
                          title="Delete Image"
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>
                    <div className="mt-4 text-center">
                      <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">Profile Picture</p>
                      <p className="text-[9px] opacity-30 mt-1">Recommended: Square image, max 1MB</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  <ResponsiveContainer width="100%" height="100%" minHeight={0} minWidth={0}>
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
                  <ResponsiveContainer width="100%" height="100%" minHeight={0} minWidth={0}>
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
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
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

              {/* Google Ads Performance Management */}
              <div className="mb-12">
                <h3 className="text-xs font-bold uppercase tracking-widest opacity-40 mb-6 flex items-center gap-2">
                  <BarChart3 size={14} /> Google Ads Performance
                </h3>
                
                {/* Visual Chart for Google Ads Performance */}
                <div className="mb-8 p-6 bg-white/50 border border-black/10 rounded-2xl h-[300px]">
                  <ResponsiveContainer width="100%" height="100%" minHeight={0} minWidth={0}>
                    <BarChart data={(draftGoogleAdsCampaigns || []).slice(0, 8)}>
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
                      <Bar dataKey="spent" name="Spent ($)" fill="#4285F4" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="result" name="Results" fill="#34A853" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                  <p className="text-[10px] text-center mt-2 opacity-30 font-bold uppercase tracking-widest">Spent vs Results (Top 8)</p>
                </div>

                <div className="space-y-4">
                  <div className="max-h-96 overflow-y-auto space-y-2 pr-2">
                    {(draftGoogleAdsCampaigns || []).map((campaign, i) => (
                      <div key={i} className="p-4 border border-black/10 bg-white/50 rounded-xl flex gap-4 items-center">
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <input 
                            value={campaign.name} 
                            onChange={(e) => {
                              const newList = [...draftGoogleAdsCampaigns];
                              newList[i].name = e.target.value;
                              setDraftGoogleAdsCampaigns(newList);
                            }}
                            className="bg-transparent border-b border-black/10 py-1 text-xs font-bold"
                            placeholder="Name"
                          />
                          <input 
                            value={campaign.spent} 
                            type="number"
                            onChange={(e) => {
                              const newList = [...draftGoogleAdsCampaigns];
                              newList[i].spent = Number(e.target.value);
                              setDraftGoogleAdsCampaigns(newList);
                            }}
                            className="bg-transparent border-b border-black/10 py-1 text-xs"
                            placeholder="Spent"
                          />
                          <input 
                            value={campaign.result} 
                            type="number"
                            onChange={(e) => {
                              const newList = [...draftGoogleAdsCampaigns];
                              newList[i].result = Number(e.target.value);
                              setDraftGoogleAdsCampaigns(newList);
                            }}
                            className="bg-transparent border-b border-black/10 py-1 text-xs"
                            placeholder="Result"
                          />
                        </div>
                        <button 
                          onClick={() => setDraftGoogleAdsCampaigns(draftGoogleAdsCampaigns.filter((_, idx) => idx !== i))}
                          className="text-black/20 hover:text-red-500"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={() => setDraftGoogleAdsCampaigns([...draftGoogleAdsCampaigns, { id: Date.now().toString(), name: 'New Google Ad', status: 'Paused', spent: 0, result: 0, type: 'Conversions', cost: 0, impressions: 0, clicks: 0 }])}
                    className="w-full p-4 border border-dashed border-black/20 rounded-xl flex items-center justify-center gap-2 opacity-40 hover:opacity-100 transition-opacity"
                  >
                    <Plus size={16} /> Add Google Ads Entry
                  </button>
                </div>
              </div>

              {/* TikTok Performance Management */}
              <div className="mb-12">
                <h3 className="text-xs font-bold uppercase tracking-widest opacity-40 mb-6 flex items-center gap-2">
                  <Smartphone size={14} /> TikTok Performance
                </h3>
                
                {/* Visual Chart for TikTok Performance */}
                <div className="mb-8 p-6 bg-white/50 border border-black/10 rounded-2xl h-[300px]">
                  <ResponsiveContainer width="100%" height="100%" minHeight={0} minWidth={0}>
                    <BarChart data={(draftTiktokCampaigns || []).slice(0, 8)}>
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
                      <Bar dataKey="result" name="Results" fill="#EE1D52" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                  <p className="text-[10px] text-center mt-2 opacity-30 font-bold uppercase tracking-widest">Spent vs Results (Top 8)</p>
                </div>

                <div className="space-y-4">
                  <div className="max-h-96 overflow-y-auto space-y-2 pr-2">
                    {(draftTiktokCampaigns || []).map((campaign, i) => (
                      <div key={i} className="p-4 border border-black/10 bg-white/50 rounded-xl flex flex-col gap-4">
                        <div className="flex justify-between items-center">
                          <input 
                            value={campaign.name} 
                            onChange={(e) => {
                              const newList = [...draftTiktokCampaigns];
                              newList[i].name = e.target.value;
                              setDraftTiktokCampaigns(newList);
                            }}
                            className="bg-transparent border-b border-black/10 py-1 text-xs font-bold flex-1 mr-4"
                            placeholder="Campaign Name"
                          />
                          <button 
                            onClick={() => setDraftTiktokCampaigns(draftTiktokCampaigns.filter((_, idx) => idx !== i))}
                            className="text-black/20 hover:text-red-500"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <div className="space-y-1">
                            <label className="text-[8px] font-bold uppercase opacity-30">Spent ($)</label>
                            <input 
                              value={campaign.spent} 
                              type="number"
                              onChange={(e) => {
                                const newList = [...draftTiktokCampaigns];
                                newList[i].spent = Number(e.target.value);
                                setDraftTiktokCampaigns(newList);
                              }}
                              className="w-full bg-transparent border-b border-black/10 py-1 text-xs"
                              placeholder="Spent"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[8px] font-bold uppercase opacity-30">Results</label>
                            <input 
                              value={campaign.result} 
                              type="number"
                              onChange={(e) => {
                                const newList = [...draftTiktokCampaigns];
                                newList[i].result = Number(e.target.value);
                                setDraftTiktokCampaigns(newList);
                              }}
                              className="w-full bg-transparent border-b border-black/10 py-1 text-xs"
                              placeholder="Result"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[8px] font-bold uppercase opacity-30">Result Type</label>
                            <input 
                              value={campaign.type} 
                              onChange={(e) => {
                                const newList = [...draftTiktokCampaigns];
                                newList[i].type = e.target.value;
                                setDraftTiktokCampaigns(newList);
                              }}
                              className="w-full bg-transparent border-b border-black/10 py-1 text-xs"
                              placeholder="e.g. Views"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={() => setDraftTiktokCampaigns([...draftTiktokCampaigns, { id: Date.now().toString(), name: 'New TikTok Ad', status: 'Active', spent: 0, result: 0, type: 'Views', cost: 0, impressions: 0, clicks: 0 }])}
                    className="w-full p-4 border border-dashed border-black/20 rounded-xl flex items-center justify-center gap-2 opacity-40 hover:opacity-100 transition-opacity"
                  >
                    <Plus size={16} /> Add TikTok Entry
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
                          {project.image && (
                            <button 
                              onClick={() => {
                                const newProjects = [...draftProjects];
                                newProjects[i].image = '';
                                setDraftProjects(newProjects);
                              }}
                              className="p-2 border border-red-200 text-red-500 rounded-lg hover:bg-red-50 hover:border-red-500 transition-colors flex items-center gap-2 text-[10px] font-bold uppercase"
                            >
                              <Trash2 size={14} />
                              Delete
                            </button>
                          )}
                        </div>
                        <div className="mt-2 relative w-20 h-20 rounded-lg overflow-hidden border border-black/5 bg-black/[0.02] flex items-center justify-center">
                          {project.image ? (
                            <img src={project.image} alt="Preview" className="w-full h-full object-cover" />
                          ) : (
                            <Camera size={20} className="text-black/10" />
                          )}
                        </div>
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

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase opacity-30">Tags</label>
                        <div className="flex flex-wrap gap-2">
                          {(project.tags || []).map((tag, j) => (
                            <div key={j} className="flex items-center gap-1 bg-black/5 px-2 py-1 rounded">
                              <input 
                                value={tag} 
                                onChange={(e) => {
                                  const newProjects = [...draftProjects];
                                  newProjects[i].tags[j] = e.target.value;
                                  setDraftProjects(newProjects);
                                }}
                                className="bg-transparent text-[10px] font-bold uppercase w-20"
                              />
                              <button 
                                onClick={() => {
                                  const newProjects = [...draftProjects];
                                  newProjects[i].tags = newProjects[i].tags.filter((_, idx) => idx !== j);
                                  setDraftProjects(newProjects);
                                }}
                                className="text-black/20 hover:text-red-500"
                              >
                                <Trash2 size={10} />
                              </button>
                            </div>
                          ))}
                          <button 
                            onClick={() => {
                              const newProjects = [...draftProjects];
                              newProjects[i].tags = [...(newProjects[i].tags || []), 'New Tag'];
                              setDraftProjects(newProjects);
                            }}
                            className="text-[10px] font-bold uppercase tracking-widest opacity-40 hover:opacity-100"
                          >
                            + Add Tag
                          </button>
                        </div>
                      </div>
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
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                          {exp.image && (
                            <button 
                              onClick={() => {
                                const newExp = [...draftExperiences];
                                newExp[i].image = '';
                                setDraftExperiences(newExp);
                              }}
                              className="p-2 border border-red-200 text-red-500 rounded-lg hover:bg-red-50 hover:border-red-500 transition-colors flex items-center gap-2 text-[10px] font-bold uppercase"
                            >
                              <Trash2 size={14} />
                              Delete
                            </button>
                          )}
                        </div>
                        <div className="mt-2 relative w-20 h-20 rounded-lg overflow-hidden border border-black/5 bg-black/[0.02] flex items-center justify-center">
                          {exp.image ? (
                            <img src={exp.image} alt="Preview" className="w-full h-full object-cover" />
                          ) : (
                            <Camera size={20} className="text-black/10" />
                          )}
                        </div>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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

              {/* Insights Management */}
              <div className="mb-12">
                <h3 className="text-xs font-bold uppercase tracking-widest opacity-40 mb-6 flex items-center gap-2">
                  <TrendingUp size={14} /> Campaign Insights
                </h3>
                <div className="space-y-4">
                  {(draftInsights || []).map((insight, i) => (
                    <div key={i} className="p-6 border border-black/10 bg-white/50 rounded-xl space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 space-y-2">
                          <input 
                            value={insight.title} 
                            onChange={(e) => {
                              const newInsights = [...draftInsights];
                              newInsights[i].title = e.target.value;
                              setDraftInsights(newInsights);
                            }}
                            className="w-full bg-transparent border-b border-black/10 py-1 font-bold"
                            placeholder="Campaign Title"
                          />
                          <input 
                            value={insight.market} 
                            onChange={(e) => {
                              const newInsights = [...draftInsights];
                              newInsights[i].market = e.target.value;
                              setDraftInsights(newInsights);
                            }}
                            className="w-full bg-transparent border-b border-black/10 py-1 text-xs opacity-60"
                            placeholder="Market/Focus"
                          />
                        </div>
                        <button 
                          onClick={() => setDraftInsights(draftInsights.filter((_, idx) => idx !== i))}
                          className="text-black/20 hover:text-red-500 transition-colors ml-4"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {insight.metrics.map((metric, j) => (
                          <div key={j} className="p-3 border border-black/5 rounded-lg space-y-2 relative group-item">
                            <div className="flex justify-between items-center">
                              <input 
                                value={metric.label} 
                                onChange={(e) => {
                                  const newInsights = [...draftInsights];
                                  newInsights[i].metrics[j].label = e.target.value;
                                  setDraftInsights(newInsights);
                                }}
                                className="w-full bg-transparent border-b border-black/5 text-[10px] uppercase opacity-40 mr-2"
                                placeholder="Metric Label"
                              />
                              <button 
                                onClick={() => {
                                  const newInsights = [...draftInsights];
                                  newInsights[i].metrics = newInsights[i].metrics.filter((_, idx) => idx !== j);
                                  setDraftInsights(newInsights);
                                }}
                                className="text-black/20 hover:text-red-500"
                              >
                                <Trash2 size={10} />
                              </button>
                            </div>
                            <input 
                              value={metric.value} 
                              onChange={(e) => {
                                const newInsights = [...draftInsights];
                                newInsights[i].metrics[j].value = e.target.value;
                                setDraftInsights(newInsights);
                              }}
                              className="w-full bg-transparent border-b border-black/10 py-1 font-bold text-sm"
                              placeholder="Value"
                            />
                          </div>
                        ))}
                        <button 
                          onClick={() => {
                            const newInsights = [...draftInsights];
                            newInsights[i].metrics.push({ label: 'New Metric', value: '0' });
                            setDraftInsights(newInsights);
                          }}
                          className="p-4 border border-dashed border-black/20 rounded-xl flex items-center justify-center gap-2 opacity-40 hover:opacity-100 transition-opacity text-[10px] font-bold uppercase"
                        >
                          <Plus size={12} /> Add Metric
                        </button>
                      </div>

                      <textarea 
                        value={insight.description} 
                        onChange={(e) => {
                          const newInsights = [...draftInsights];
                          newInsights[i].description = e.target.value;
                          setDraftInsights(newInsights);
                        }}
                        className="w-full bg-transparent border border-black/5 p-2 text-sm h-20"
                        placeholder="Description"
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase opacity-30">Icon (Lucide Name)</label>
                          <input 
                            value={insight.icon} 
                            onChange={(e) => {
                              const newInsights = [...draftInsights];
                              newInsights[i].icon = e.target.value;
                              setDraftInsights(newInsights);
                            }}
                            className="w-full bg-transparent border-b border-black/10 py-1 text-xs"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase opacity-30">Accent Color</label>
                          <input 
                            type="color"
                            value={insight.color} 
                            onChange={(e) => {
                              const newInsights = [...draftInsights];
                              newInsights[i].color = e.target.value;
                              setDraftInsights(newInsights);
                            }}
                            className="w-full h-8 bg-transparent border-none p-0 cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <button 
                    onClick={() => setDraftInsights([...draftInsights, { id: Date.now().toString(), title: 'New Insight', market: 'New Market', metrics: [{ label: 'Metric 1', value: '0' }, { label: 'Metric 2', value: '0' }], description: '', icon: 'TrendingUp', color: '#000000' }])}
                    className="w-full p-4 border border-dashed border-black/20 rounded-xl flex items-center justify-center gap-2 opacity-40 hover:opacity-100 transition-opacity"
                  >
                    <Plus size={16} /> Add Insight
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
        {((stats && stats.length > 0) || 
          (bestCampaignsList && bestCampaignsList.length > 0) || 
          (googleAdsCampaignsList && googleAdsCampaignsList.length > 0) || 
          (tiktokCampaignsList && tiktokCampaignsList.length > 0) || 
          (snapchatCampaignsList && snapchatCampaignsList.length > 0)) && (
          <section id="results" className="py-24 px-6 bg-black text-white">
            <div className="max-w-7xl mx-auto">
              {stats && stats.length > 0 && (
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
              )}

              {/* Best Performance Section */}
              {bestCampaignsList && bestCampaignsList.length > 0 && (
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
              )}

              {/* Google Ads Detailed Results */}
              {googleAdsCampaignsList && googleAdsCampaignsList.length > 0 && (
                <div className="mb-24">
                  <div className="flex items-center justify-between mb-12">
                    <div>
                      <h2 className="text-4xl font-bold tracking-tighter mb-4">Google Ads Performance</h2>
                      <p className="text-white/40 max-w-xl">Strategic search and display campaigns focused on high-intent keywords and conversion optimization.</p>
                    </div>
                    <div className="hidden md:block">
                      <div className="px-4 py-2 border border-white/20 rounded-full text-[10px] font-bold uppercase tracking-widest">
                        Live Campaign Data
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
                        {(googleAdsCampaignsList || []).map((campaign, i) => (
                          <tr key={campaign.id || i} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                            <td className="py-6 font-medium">{campaign.name}</td>
                            <td className="py-6">
                              <span className={`px-2 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest ${campaign.status === 'Active' ? 'bg-blue-500/20 text-blue-400' : 'bg-white/10 text-white/40'}`}>
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
              )}

              {/* TikTok Detailed Results */}
              {tiktokCampaignsList && tiktokCampaignsList.length > 0 && (
                <div className="mb-24">
                  <div className="flex items-center justify-between mb-12">
                    <div>
                      <h2 className="text-4xl font-bold tracking-tighter mb-4">TikTok Performance</h2>
                      <p className="text-white/40 max-w-xl">High-energy video campaigns leveraging trending sounds and UGC-style content to drive massive engagement.</p>
                    </div>
                    <div className="hidden md:block">
                      <div className="px-4 py-2 border border-white/20 rounded-full text-[10px] font-bold uppercase tracking-widest">
                        Viral Campaign Data
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
                        {(tiktokCampaignsList || []).map((campaign, i) => (
                          <tr key={campaign.id || i} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                            <td className="py-6 font-medium">{campaign.name}</td>
                            <td className="py-6">
                              <span className={`px-2 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest ${campaign.status === 'Active' ? 'bg-[#EE1D52]/20 text-[#EE1D52]' : 'bg-white/10 text-white/40'}`}>
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
              )}

              {/* Snapchat Detailed Results */}
              {snapchatCampaignsList && snapchatCampaignsList.length > 0 && (
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
              )}
            </div>
          </section>
        )}


        {/* Projects Section */}
        {projects && projects.length > 0 && (
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
        )}


        {/* Experience Section */}
        {experiences && experiences.length > 0 && (
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
        )}


        {/* Skills & Tools */}
        {skills && skills.length > 0 && (
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
        )}


        {/* Campaign Insights / Case Study Style */}
        {insights && insights.length > 0 && (
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
                {(insights || []).map((insight, i) => {
                  const Icon = IconMap[insight.icon] || TrendingUp;
                  return (
                    <div key={i} className="p-8 border border-white/10 rounded-2xl bg-white/5">
                      <div className="flex items-center gap-3 mb-8">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: insight.color }}
                        >
                          <Icon className="text-black" size={20} />
                        </div>
                        <div>
                          <div className="font-bold">{insight.title}</div>
                          <div className="text-xs opacity-50 uppercase tracking-widest">{insight.market}</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-8">
                        {insight.metrics.map((metric, j) => (
                          <div key={j} className="p-4 bg-white/5 rounded-xl">
                            <div className="text-2xl font-bold">{metric.value}</div>
                            <div className="text-[10px] uppercase opacity-40">{metric.label}</div>
                          </div>
                        ))}
                      </div>
                      <div className="text-sm text-white/60 leading-relaxed">
                        {insight.description}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}


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
