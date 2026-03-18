import React from 'react';
import { orderBy } from 'firebase/firestore';
import { useFirestore } from '../hooks/useFirestore';
import { ExternalLink } from 'lucide-react';
import { Product } from '../types';

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'p-1',
    name: 'Community Business Platform',
    description: 'Connects local businesses with customers through a digital marketplace and directory. Solves visibility and operational challenges for SMEs, fostering local commerce and economic growth.',
    status: 'Live',
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80',
    ctaLink: '#',
  },
  {
    id: 'p-2',
    name: 'AI Omnichannel Support Automation',
    description: 'Automates customer support across multiple channels. Improves response times, customer satisfaction, and scalability for businesses.',
    status: 'Concept',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
    ctaLink: '#',
  },
  {
    id: 'p-3',
    name: 'Inventory & Vendor Platform',
    description: 'Helps vendors manage inventory and track products efficiently. Reduces operational errors and boosts sales efficiency for small and medium enterprises.',
    status: 'Concept',
    image: 'https://images.unsplash.com/photo-1580828369019-18ba11dc122f?auto=format&fit=crop&w=800&q=80',
    ctaLink: '#',
  },
];

export default function Products() {
  const { data: products } = useFirestore<Product>('products', {
    queryConstraints: [orderBy('createdAt', 'desc')],
    initialData: DEFAULT_PRODUCTS
  });

  return (
    <div className="bg-brand-light min-h-screen py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-blue mb-6">Flagship Products & Innovations</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our core products designed to empower businesses and streamline operations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <div key={product.id || index} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      product.status === 'Live' ? 'bg-green-100 text-green-800' : 'bg-brand-yellow/90 text-brand-blue'
                    }`}>
                      {product.status}
                    </span>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-2xl font-serif font-bold text-brand-blue mb-3">{product.name}</h3>
                  <p className="text-gray-600 mb-6 flex-grow">{product.description}</p>
                  <a 
                    href={product.ctaLink}
                    className="inline-flex items-center justify-center gap-2 w-full bg-brand-blue text-white py-3 rounded-xl font-medium hover:bg-brand-blue/90 transition-colors"
                  >
                    Learn More <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
      </div>
    </div>
  );
}
