import { LucideIcon } from 'lucide-react';

export interface Experience {
  role: string;
  company: string;
  period: string;
  description: string[];
}

export interface Skill {
  name: string;
  category: 'Platform' | 'Skill' | 'Tool';
}

export interface ResultCard {
  platform: string;
  metric: string;
  value: string;
  subtext: string;
  icon: LucideIcon;
}
