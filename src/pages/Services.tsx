import React from 'react';
import { orderBy } from 'firebase/firestore';
import { useFirestore } from '../hooks/useFirestore';
import { getIcon } from '../utils/getIcon';
import { Service } from '../types';
import * as Icons from 'lucide-react';
import ServiceCard from '../components/ServiceCard';

const DEFAULT_SERVICES: Service[] = [
  {
    id: 's-1',
    title: 'AI Solutions & Automation',
    description: 'We implement intelligent automation and AI solutions that streamline business processes, improve decision-making, and increase productivity. From chatbots to predictive analytics, we help you leverage the power of AI.',
    icon: 'Bot',
  },
  {
    id: 's-2',
    title: 'Web & App Development',
    description: 'We create modern, responsive websites and applications that reflect your brand and help businesses reach customers online. Our designs focus on usability, performance, and growth.',
    icon: 'Code',
  },
  {
    id: 's-3',
    title: 'Business Systems',
    description: 'We build tailored digital solutions like admin dashboards, CRM systems, and automation tools to help businesses manage operations efficiently and reduce manual work.',
    icon: 'Database',
  },
  {
    id: 's-4',
    title: 'UI/UX Design',
    description: 'Our team designs intuitive interfaces and seamless user experiences that enhance customer engagement and satisfaction, ensuring your digital products are easy to use and visually appealing.',
    icon: 'LayoutTemplate',
  },
];

export default function Services() {
  const { data: services } = useFirestore<Service>('services', {
    queryConstraints: [orderBy('createdAt', 'desc')],
    initialData: DEFAULT_SERVICES
  });

  return (
    <div className="bg-brand-light min-h-screen py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-blue mb-6">Our Services</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive digital solutions tailored to solve real business challenges and drive sustainable growth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => {
            const IconComponent = getIcon(service.icon);
              return (
                <ServiceCard key={String(service.id || index)} title={String(service.title)} description={String(service.description)} Icon={IconComponent as Icons.LucideIcon} />
              );
            })}
          </div>
      </div>
    </div>
  );
}
