import React from 'react';
import { orderBy } from 'firebase/firestore';
import { useFirestore } from '../hooks/useFirestore';
import { ArrowRight } from 'lucide-react';
import { CaseStudy } from '../types';

const DEFAULT_CASE_STUDIES: CaseStudy[] = [
  {
    id: 'cs-1',
    title: 'E-Commerce Automation Platform',
    problem: 'A local retailer struggled with manual inventory tracking and fragmented sales channels, leading to stockouts and lost revenue.',
    solution: 'Developed a custom inventory management system integrated with their POS and online store, featuring automated reordering alerts.',
    technologies: ['React', 'Node.js', 'Firebase', 'Stripe'],
    outcome: 'Reduced inventory errors by 95% and increased online sales by 40% within the first quarter.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'cs-2',
    title: 'Healthcare Patient Portal',
    problem: 'A clinic needed a secure way for patients to book appointments, view records, and communicate with doctors remotely.',
    solution: 'Built a HIPAA-compliant web application with real-time chat, appointment scheduling, and secure document sharing.',
    technologies: ['Next.js', 'PostgreSQL', 'WebRTC', 'Tailwind CSS'],
    outcome: 'Improved patient satisfaction scores by 60% and reduced administrative workload for clinic staff by 30%.',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'cs-3',
    title: 'Logistics Tracking Dashboard',
    problem: 'A logistics company lacked real-time visibility into their fleet operations, causing delays and inefficient routing.',
    solution: 'Created a centralized dashboard with GPS integration, route optimization algorithms, and driver performance analytics.',
    technologies: ['Vue.js', 'Python', 'Google Maps API', 'AWS'],
    outcome: 'Decreased average delivery times by 20% and reduced fuel costs by 15% across the fleet.',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8ed7c80a30?auto=format&fit=crop&w=800&q=80',
  },
];

export default function CaseStudies() {
  const { data: caseStudies } = useFirestore<CaseStudy>('caseStudies', {
    queryConstraints: [orderBy('createdAt', 'desc')],
    initialData: DEFAULT_CASE_STUDIES
  });

  return (
    <div className="bg-white min-h-screen py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-blue mb-6">Our Work</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover how we've helped businesses transform their operations and achieve sustainable growth through innovative technology.
          </p>
        </div>

        <div className="space-y-16">
          {caseStudies.map((study, index) => (
            <div key={study.id || index} className={`flex flex-col lg:flex-row gap-12 items-center ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
                <div className="w-full lg:w-1/2">
                  <div className="relative rounded-2xl overflow-hidden shadow-xl">
                    <img src={study.image} alt={study.title} className="w-full h-[400px] object-cover" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-brand-blue/10"></div>
                  </div>
                </div>
                <div className="w-full lg:w-1/2 space-y-6">
                  <h2 className="text-3xl font-serif font-bold text-brand-blue">{study.title}</h2>
                  
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">The Challenge</h4>
                    <p className="text-gray-600">{study.problem}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">Our Solution</h4>
                    <p className="text-gray-600">{study.solution}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">Technologies Used</h4>
                    <div className="flex flex-wrap gap-2">
                      {study.technologies && study.technologies.map((tech: string, i: number) => (
                        <span key={i} className="px-3 py-1 bg-brand-light text-brand-blue rounded-full text-sm font-medium border border-gray-200">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-brand-yellow/10 p-6 rounded-xl border border-brand-yellow/20">
                    <h4 className="text-lg font-bold text-brand-blue mb-2">The Impact</h4>
                    <p className="text-gray-800 font-medium">{study.outcome}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
      </div>
    </div>
  );
}
