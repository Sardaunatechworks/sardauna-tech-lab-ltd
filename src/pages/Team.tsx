import React from 'react';
import { orderBy } from 'firebase/firestore';
import { useFirestore } from '../hooks/useFirestore';
import { TeamMember } from '../types';

const DEFAULT_TEAM: TeamMember[] = [
  {
    id: 't-1',
    name: 'Muhammad Auwal Abubakar',
    role: 'Founder/CEO',
    image: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 't-2',
    name: 'Maryam Abubakar',
    role: 'Co-Founder',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 't-3',
    name: 'Jibril Raji',
    role: 'Chief Technology Officer',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 't-4',
    name: 'Mustapha Abdulsalam',
    role: 'Assistant CTO',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 't-5',
    name: 'Khalid Murtala',
    role: 'Developer',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 't-6',
    name: 'Hussaini Jibril',
    role: 'AI/ML Engineer',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 't-7',
    name: 'Ibrahim Rabie Ismail',
    role: 'Business Development Manager',
    image: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 't-8',
    name: 'Muhammad Mukthar',
    role: 'Product Designer',
    image: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&w=400&q=80',
  },
];

export default function Team() {
  const { data: team } = useFirestore<TeamMember>('team', {
    queryConstraints: [orderBy('createdAt', 'asc')],
    initialData: DEFAULT_TEAM
  });

  return (
    <div className="bg-brand-light min-h-screen py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-blue mb-6">Leadership & Team</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Meet the passionate individuals driving innovation and building digital infrastructure for African businesses.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <div key={member.id || index} className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="relative w-32 h-32 mx-auto mb-6">
                <div className="absolute inset-0 bg-brand-yellow rounded-full transform translate-x-2 translate-y-2 opacity-20"></div>
                {member.image ? (
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="relative w-full h-full object-cover rounded-full border-4 border-white shadow-md"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="relative w-full h-full rounded-full border-4 border-white shadow-md bg-gray-200 flex items-center justify-center text-3xl text-gray-500 font-bold">
                    {member.name.charAt(0)}
                  </div>
                )}
              </div>
              <h3 className="text-xl font-bold text-brand-blue mb-1">{member.name}</h3>
              <p className="text-brand-yellow font-medium mb-3">{member.role}</p>
              {member.bio && <p className="text-gray-600 text-sm mb-4 line-clamp-3">{member.bio}</p>}
              
              {(member.linkedin || member.twitter) && (
                <div className="flex justify-center gap-3 mt-4">
                  {member.linkedin && (
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-brand-blue transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                    </a>
                  )}
                  {member.twitter && (
                    <a href={member.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-brand-blue transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
