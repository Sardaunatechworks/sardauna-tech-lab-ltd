import { orderBy, limit } from 'firebase/firestore';
import { useFirestore } from '../hooks/useFirestore';
import { getIcon } from '../utils/getIcon';
import * as Icons from 'lucide-react';
import { Service, Testimonial } from '../types';

const DEFAULT_SERVICES = [
  {
    id: 'default-1',
    title: 'Web Development & Design',
    description: 'Modern, responsive websites that reflect your brand and help businesses reach customers online.',
    icon: 'LayoutTemplate'
  },
  {
    id: 'default-2',
    title: 'Custom Business Systems',
    description: 'Tailored digital solutions like admin dashboards, CRM systems, and automation tools.',
    icon: 'Database'
  },
  {
    id: 'default-3',
    title: 'AI & Automation',
    description: 'Intelligent automation and AI solutions that streamline business processes and increase productivity.',
    icon: 'Bot'
  },
  {
    id: 'default-4',
    title: 'UI/UX Design',
    description: 'Intuitive interfaces and seamless user experiences that enhance customer engagement.',
    icon: 'PenTool'
  }
];

const DEFAULT_TESTIMONIALS = [
  {
    id: 'default-t1',
    name: 'Amina Yusuf',
    company: 'CEO, TechGrow Africa',
    message: 'Sardauna Tech Lab transformed our operations. Their custom dashboard saved us countless hours and improved our efficiency by 40%.',
    image: 'https://images.unsplash.com/photo-1531123897727-8f129e1bfa8ea?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 'default-t2',
    name: 'Chinedu Okoro',
    company: 'Founder, LogisticsPro',
    message: 'The logistics tracking system they built for us is world-class. It gave us real-time visibility and helped us scale our fleet.',
    image: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 'default-t3',
    name: 'Fatima Bello',
    company: 'Director, EduTech Solutions',
    message: 'Professional, reliable, and deeply knowledgeable. They understood our unique challenges and delivered a solution that exceeded expectations.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80'
  }
];

export default function Home() {
  const { data: services } = useFirestore<Service>('services', {
    queryConstraints: [orderBy('createdAt', 'desc'), limit(4)],
    initialData: DEFAULT_SERVICES
  });

  const { data: testimonials } = useFirestore<Testimonial>('testimonials', {
    queryConstraints: [orderBy('createdAt', 'desc'), limit(3)],
    initialData: DEFAULT_TESTIMONIALS
  });

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-brand-blue text-white py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 leading-tight">
            Building Digital Infrastructure <br className="hidden md:block" />
            <span className="text-brand-yellow">for African Businesses</span>
          </h1>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            We empower small and medium enterprises to transition from manual, fragmented operations to structured, automated systems.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/contact" className="bg-brand-yellow text-brand-blue px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-400 transition-colors shadow-lg shadow-brand-yellow/20">
              Start a Project
            </a>
            <a href="/case-studies" className="bg-white/10 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition-colors border border-white/20 backdrop-blur-sm">
              View Our Work
            </a>
          </div>
        </div>
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-yellow rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500 rounded-full blur-[120px]"></div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-brand-blue mb-4">Our Core Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Comprehensive digital solutions tailored to solve real business challenges.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => {
              const IconComponent = getIcon(service.icon);
                return (
                  <div key={service.id || index} className="p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                    <div className="bg-brand-light w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:bg-brand-yellow/10 transition-colors">
                      <IconComponent className="h-7 w-7 text-brand-blue group-hover:text-brand-yellow transition-colors" />
                    </div>
                    <h3 className="text-xl font-bold text-brand-blue mb-3">{service.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{service.description}</p>
                  </div>
                );
              })}
            </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-brand-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-serif font-bold text-brand-blue mb-8">Why Choose Us</h2>
              <div className="space-y-6">
                <div>
                  <h4 className="text-xl font-bold text-brand-yellow mb-2">Local Expertise</h4>
                  <p className="text-gray-600">Deep understanding of Nigerian businesses for practical, relevant solutions.</p>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-brand-yellow mb-2">Innovative Technology</h4>
                  <p className="text-gray-600">Modern tools, automation, and AI to solve real business challenges.</p>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-brand-yellow mb-2">Reliable Delivery</h4>
                  <p className="text-gray-600">High-quality projects completed on time with ongoing support.</p>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-brand-yellow mb-2">Impact-Driven</h4>
                  <p className="text-gray-600">Solutions designed to simplify operations, boost efficiency, and drive measurable results.</p>
                </div>
              </div>
            </div>
            <div className="bg-brand-blue p-12 rounded-3xl text-white relative overflow-hidden shadow-2xl">
              <div className="relative z-10">
                <Icons.Quote className="h-12 w-12 text-brand-yellow/30 mb-6" />
                <p className="text-2xl font-serif italic leading-relaxed">
                  "We combine local expertise, innovative technology, and reliable delivery to create solutions that drive measurable business impact. Our hybrid approach ensures continuous innovation while helping businesses operate efficiently, scale confidently, and achieve sustainable growth."
                </p>
              </div>
              <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-brand-yellow rounded-full opacity-20 blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-brand-blue mb-4">What Our Clients Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Don't just take our word for it. Hear from the businesses we've helped transform.</p>
          </div>
 
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={testimonial.id || index} className="bg-gray-50 p-8 rounded-2xl border border-gray-100 relative hover:shadow-lg transition-shadow duration-300">
                  <Icons.Quote className="absolute top-8 right-8 h-12 w-12 text-gray-200" />
                  <p className="text-gray-700 mb-8 relative z-10 leading-relaxed italic">"{testimonial.message}"</p>
                  <div className="flex items-center gap-4">
                    {testimonial.image && (
                      <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md" referrerPolicy="no-referrer" />
                    )}
                    <div>
                      <h4 className="font-bold text-brand-blue">{testimonial.name}</h4>
                      <p className="text-sm text-gray-500 font-medium">{testimonial.company}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
        </div>
      </section>
    </div>
  );
}
