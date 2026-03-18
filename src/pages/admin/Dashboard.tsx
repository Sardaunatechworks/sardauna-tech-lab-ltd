import { useEffect, useState } from 'react';
import { collection, getCountFromServer } from 'firebase/firestore';
import { db } from '../../firebase';
import { Briefcase, FileText, Box, MessageSquare, Users, Handshake } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    services: 0,
    caseStudies: 0,
    products: 0,
    blog: 0,
    messages: 0,
    partners: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [servicesSnap, caseStudiesSnap, productsSnap, blogSnap, messagesSnap, partnersSnap] = await Promise.all([
          getCountFromServer(collection(db, 'services')),
          getCountFromServer(collection(db, 'caseStudies')),
          getCountFromServer(collection(db, 'products')),
          getCountFromServer(collection(db, 'blog')),
          getCountFromServer(collection(db, 'messages')),
          getCountFromServer(collection(db, 'partners'))
        ]);

        setStats({
          services: servicesSnap.data().count,
          caseStudies: caseStudiesSnap.data().count,
          products: productsSnap.data().count,
          blog: blogSnap.data().count,
          messages: messagesSnap.data().count,
          partners: partnersSnap.data().count
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { name: 'Services', value: stats.services, icon: Briefcase, color: 'bg-blue-500' },
    { name: 'Case Studies', value: stats.caseStudies, icon: FileText, color: 'bg-indigo-500' },
    { name: 'Products', value: stats.products, icon: Box, color: 'bg-purple-500' },
    { name: 'Blog Posts', value: stats.blog, icon: FileText, color: 'bg-pink-500' },
    { name: 'Messages', value: stats.messages, icon: MessageSquare, color: 'bg-green-500' },
    { name: 'Partners', value: stats.partners, icon: Handshake, color: 'bg-yellow-500' },
  ];

  if (isLoading) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center gap-4">
              <div className={`${stat.color} p-4 rounded-lg text-white`}>
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
