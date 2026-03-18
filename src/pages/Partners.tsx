import React from 'react';
import { orderBy } from 'firebase/firestore';
import { useFirestore } from '../hooks/useFirestore';
import { Partner } from '../types';

const DEFAULT_PARTNERS: Partner[] = [
  {
    id: 'pr-1',
    name: 'TechFort Foundation',
    logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=300&q=80',
    description: 'Collaborating on digital literacy and technology education initiatives across the region.'
  },
  {
    id: 'pr-2',
    name: 'Pinkpetals Initiative',
    logo: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=300&q=80',
    description: 'Partnering to empower women in tech and support female-led businesses with digital tools.'
  }
];

export default function Partners() {
  const { data: partners } = useFirestore<Partner>('partners', {
    queryConstraints: [orderBy('createdAt', 'desc')],
    initialData: DEFAULT_PARTNERS
  });

  return (
    <div className="bg-white min-h-screen py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-blue mb-6">Our Partners & Collaborators</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We work with industry leaders and organizations to deliver the best solutions and create meaningful impact.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          {partners.map((partner, index) => (
            <div key={partner.id || index} className="bg-brand-light rounded-3xl p-8 text-center border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-48 h-48 mx-auto bg-white rounded-full shadow-sm flex items-center justify-center p-6 mb-8">
                  <img 
                    src={partner.logo} 
                    alt={partner.name} 
                    className="max-w-full max-h-full object-contain mix-blend-multiply"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <h3 className="text-2xl font-serif font-bold text-brand-blue mb-4">{partner.name}</h3>
                <p className="text-gray-600">{partner.description}</p>
              </div>
            ))}
          </div>
      </div>
    </div>
  );
}
