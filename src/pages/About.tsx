import { CheckCircle2 } from 'lucide-react';
import logo from '../assets/logo.png';

export default function About() {
  const values = [
    'Integrity & Accountability',
    'Innovation & Continuous Improvement',
    'Collaboration & Respect',
    'Excellence & Quality',
    'Community & Social Responsibility'
  ];

  return (
    <div className="bg-white min-h-screen py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-blue mb-6">About Our Company</h1>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                Founded in 2023, Sardauna Tech Lab began as an independent freelance initiative and has since grown into a structured, registered technology company.
              </p>
              <p>
                Over time, this gradually evolved into a more structured operation. Recognizing the potential to create greater impact, I brought together a team of equally passionate and like-minded individuals. Together, we restructured the venture and officially registered it as Sardauna Tech Lab Ltd.
              </p>
              <p>
                From the beginning, our focus has been on solving real business challenges through innovative digital solutions. Today, Sardauna Tech Lab Ltd provides web development, automation tools, and scalable platforms that empower small and medium enterprises to operate efficiently, reach more customers, and grow sustainably.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl bg-white flex items-center justify-center p-12">
              <img src={logo} alt="Sardauna Tech Lab Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
            </div>
            <div className="absolute -bottom-8 -left-8 bg-brand-yellow p-8 rounded-2xl shadow-xl max-w-xs">
              <p className="font-serif font-bold text-brand-blue text-xl">"Driven by innovation, reliability, and impact."</p>
            </div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          <div className="bg-brand-light p-12 rounded-3xl border border-gray-100">
            <h2 className="text-3xl font-serif font-bold text-brand-blue mb-6 border-b-2 border-brand-yellow pb-4 inline-block">Our Vision</h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              To become a leading African technology company building digital infrastructure and automation systems that empower businesses to operate efficiently, scale confidently, and compete in a modern digital economy. We envision a future where local businesses are no longer limited by manual processes or lack of visibility, but are supported by smart, scalable technology that drives sustainable growth and economic development.
            </p>
          </div>
          <div className="bg-brand-blue text-white p-12 rounded-3xl shadow-xl">
            <h2 className="text-3xl font-serif font-bold text-brand-yellow mb-6 border-b-2 border-white/20 pb-4 inline-block">Our Mission</h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              To design and deliver practical, scalable digital solutions that solve real business problems. We are committed to helping small and medium enterprises transition from manual, fragmented operations to structured, automated systems through web development, intelligent tools, and innovative technology products.
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div className="text-center">
          <h2 className="text-3xl font-serif font-bold text-brand-blue mb-12">Company Values & Culture</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {values.map((value, index) => (
              <div key={index} className="flex items-center gap-3 bg-white px-6 py-4 rounded-full shadow-sm border border-gray-100">
                <CheckCircle2 className="h-6 w-6 text-brand-yellow" />
                <span className="font-semibold text-brand-blue">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
