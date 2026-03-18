import { Timestamp } from 'firebase/firestore';

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  createdAt?: Timestamp;
}

export interface Testimonial {
  id: string;
  name: string;
  company: string;
  message: string;
  image?: string;
  createdAt?: Timestamp;
}

export interface BlogPost {
  id: string;
  title: string;
  summary: string;
  content?: string;
  date?: string;
  image: string;
  author: string;
  createdAt?: Timestamp;
}

export interface CaseStudy {
  id: string;
  title: string;
  problem: string;
  solution: string;
  technologies: string[];
  outcome: string;
  image: string;
  createdAt?: Timestamp;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image?: string;
  bio?: string;
  linkedin?: string;
  twitter?: string;
  createdAt?: Timestamp;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  status: 'Live' | 'Concept' | 'In Development';
  image: string;
  ctaLink: string;
  createdAt?: Timestamp;
}

export interface Partner {
  id: string;
  name: string;
  logo: string;
  description: string;
  createdAt?: Timestamp;
}
