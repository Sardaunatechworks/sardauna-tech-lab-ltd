import React, { useState } from 'react';
import { Phone, MapPin, Mail, Send } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import toast from 'react-hot-toast';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await addDoc(collection(db, 'messages'), {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        submittedAt: serverTimestamp()
      });
      
      toast.success('Message sent successfully! We will get back to you soon.');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Error submitting message:', error);
      toast.error('Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="bg-white min-h-screen py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-blue mb-6">Contact Us</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We are ready to collaborate with you. Contact us for more information on our products, services, or partnership opportunities.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div className="bg-brand-light p-12 rounded-3xl border border-gray-100">
            <h2 className="text-3xl font-serif font-bold text-brand-blue mb-8">Get in Touch</h2>
            
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="bg-white p-3 rounded-full shadow-sm">
                  <Phone className="h-6 w-6 text-brand-yellow" />
                </div>
                <div>
                  <h4 className="font-bold text-brand-blue mb-1">Phone</h4>
                  <p className="text-gray-600">+2347019672820</p>
                  <p className="text-gray-600">+2349060276333</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-white p-3 rounded-full shadow-sm">
                  <MapPin className="h-6 w-6 text-brand-yellow" />
                </div>
                <div>
                  <h4 className="font-bold text-brand-blue mb-1">Location</h4>
                  <p className="text-gray-600">Dutse, Jigawa State</p>
                  <p className="text-gray-600">Nigeria</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-white p-3 rounded-full shadow-sm">
                  <Mail className="h-6 w-6 text-brand-yellow" />
                </div>
                <div>
                  <h4 className="font-bold text-brand-blue mb-1">Email</h4>
                  <p className="text-gray-600">sardaunatechlabs@gmail.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-12 rounded-3xl shadow-xl border border-gray-100">
            <h2 className="text-3xl font-serif font-bold text-brand-blue mb-8">Send a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none transition-all"
                  placeholder="John Doe"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none transition-all"
                  placeholder="john@example.com"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Your Message</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none transition-all resize-none"
                  placeholder="How can we help you?"
                ></textarea>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-brand-blue text-white py-4 rounded-xl font-bold text-lg hover:bg-brand-blue/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isSubmitting ? 'Sending...' : (
                  <>
                    Send Message <Send className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
