import { LucideIcon } from 'lucide-react';

interface ServiceCardProps {
  title: string;
  description: string;
  Icon: LucideIcon;
}

export default function ServiceCard({ title, description, Icon }: ServiceCardProps) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
      <div className="bg-brand-light w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:bg-brand-yellow/10 transition-colors">
        <Icon className="h-8 w-8 text-brand-blue group-hover:text-brand-yellow transition-colors" />
      </div>
      <h3 className="text-2xl font-serif font-bold text-brand-blue mb-4">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}
