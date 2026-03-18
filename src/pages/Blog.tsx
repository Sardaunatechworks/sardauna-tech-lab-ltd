import React, { useState } from 'react';
import { orderBy } from 'firebase/firestore';
import { useFirestore } from '../hooks/useFirestore';
import { format } from 'date-fns';
import { X } from 'lucide-react';
import { BlogPost } from '../types';

const DEFAULT_POSTS: BlogPost[] = [
  {
    id: 'b-1',
    title: 'The Future of AI in African E-Commerce',
    summary: 'Explore how artificial intelligence is transforming the way local businesses interact with customers and manage inventory.',
    content: 'Artificial intelligence is no longer just a buzzword; it is actively reshaping the e-commerce landscape across Africa. From personalized product recommendations to automated customer support via chatbots, AI helps businesses scale efficiently.\n\nLocal merchants are leveraging machine learning algorithms to predict inventory needs, reducing waste and ensuring popular items are always in stock. Furthermore, AI-driven analytics provide deep insights into consumer behavior, allowing for highly targeted marketing campaigns.\n\nAs internet penetration continues to grow, the adoption of AI tools will become a critical differentiator for e-commerce success in the region.',
    date: 'March 15, 2026',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
    author: 'Hussaini Jibril'
  },
  {
    id: 'b-2',
    title: 'Why Your Business Needs a Custom Dashboard',
    summary: 'Off-the-shelf solutions often fall short. Learn how a custom admin dashboard can save you hours of manual work every week.',
    content: 'Every business operates uniquely, yet many rely on generic software that forces them to adapt their workflows to the tool, rather than the other way around. A custom admin dashboard changes this dynamic.\n\nBy building a dashboard tailored to your specific KPIs and operational needs, you eliminate unnecessary features and focus entirely on what matters. This streamlines data entry, improves reporting accuracy, and significantly reduces the time spent on administrative tasks.\n\nInvesting in a custom solution pays dividends in productivity and provides a clear, real-time overview of your business health.',
    date: 'March 10, 2026',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    author: 'Muhammad Auwal Abubakar'
  },
  {
    id: 'b-3',
    title: 'UI/UX Best Practices for Mobile-First Markets',
    summary: 'With mobile internet usage dominating the continent, designing for small screens is no longer optional. Here are our top tips.',
    content: 'In many emerging markets, a smartphone is the primary—and often only—device used to access the internet. This reality makes mobile-first design an absolute necessity.\n\nKey best practices include optimizing touch targets (minimum 44x44 pixels), ensuring fast load times by compressing assets, and designing intuitive navigation that doesn\'t rely on complex hover states. High contrast text and clear calls-to-action are also crucial for usability in varying lighting conditions.\n\nBy prioritizing the mobile experience, businesses can engage a broader audience and significantly improve conversion rates.',
    date: 'March 5, 2026',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80',
    author: 'Muhammad Mukthar'
  }
];

export default function Blog() {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  const { data: posts } = useFirestore<BlogPost>('blog', {
    queryConstraints: [orderBy('createdAt', 'desc')],
    initialData: DEFAULT_POSTS
  });

  return (
    <div className="bg-brand-light min-h-screen py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-blue mb-6">Latest Insights</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Thoughts, news, and strategies from the Sardauna Tech Lab team.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <article key={post.id || index} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col hover:shadow-lg transition-shadow">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>{post.createdAt?.toDate ? format(post.createdAt.toDate(), 'MMMM d, yyyy') : (post.date || 'No date')}</span>
                    <span className="font-medium text-brand-yellow">{post.author}</span>
                  </div>
                  <h3 className="text-xl font-serif font-bold text-brand-blue mb-3 line-clamp-2">{post.title}</h3>
                  <p className="text-gray-600 mb-6 flex-grow line-clamp-3">{post.summary}</p>
                  <button 
                    onClick={() => setSelectedPost(post)}
                    className="text-brand-blue font-bold hover:text-brand-yellow transition-colors inline-flex items-center gap-2 self-start"
                  >
                    Read Article &rarr;
                  </button>
                </div>
              </article>
            ))}
          </div>
      </div>

      {/* Blog Post Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedPost(null)}
          ></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col">
            <button 
              onClick={() => setSelectedPost(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur rounded-full text-gray-600 hover:text-gray-900 hover:bg-white transition-colors shadow-sm"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="w-full h-64 sm:h-80 relative shrink-0">
              <img 
                src={selectedPost.image} 
                alt={selectedPost.title} 
                className="w-full h-full object-cover rounded-t-2xl"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-t-2xl"></div>
              <div className="absolute bottom-0 left-0 p-6 sm:p-8 text-white w-full">
                <div className="flex items-center gap-4 text-sm mb-3 font-medium text-white/90">
                  <span>{selectedPost.createdAt?.toDate ? format(selectedPost.createdAt.toDate(), 'MMMM d, yyyy') : selectedPost.date}</span>
                  <span className="w-1 h-1 rounded-full bg-brand-yellow"></span>
                  <span className="text-brand-yellow">{selectedPost.author}</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-serif font-bold leading-tight">
                  {selectedPost.title}
                </h2>
              </div>
            </div>
            
            <div className="p-6 sm:p-8 md:p-10 bg-white rounded-b-2xl">
              <div className="prose prose-lg max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
                {selectedPost.content || selectedPost.summary}
              </div>
              
              <div className="mt-12 pt-8 border-t border-gray-100 flex justify-end">
                <button 
                  onClick={() => setSelectedPost(null)}
                  className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-full transition-colors"
                >
                  Close Article
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
