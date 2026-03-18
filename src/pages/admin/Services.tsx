import React, { useState, useEffect, useMemo } from 'react';
import { collection, query, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';
import * as Icons from 'lucide-react';
import { Plus, Edit2, Trash2, X, CheckCircle2, Search, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';

const iconNames = Object.keys(Icons).filter(
  key => key !== 'createLucideIcon' && key !== 'default' && /^[A-Z]/.test(key)
);

export default function AdminServices() {
  const [services, setServices] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ title: '', description: '', icon: 'Briefcase' });
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [iconSearch, setIconSearch] = useState('');

  const filteredIcons = useMemo(() => {
    return iconNames
      .filter(name => name.toLowerCase().includes(iconSearch.toLowerCase()))
      .slice(0, 50);
  }, [iconSearch]);

  useEffect(() => {
    const q = query(collection(db, 'services'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setServices(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (err) => {
      console.error(err);
      if (err.message.includes('index')) {
        const qFallback = query(collection(db, 'services'));
        onSnapshot(qFallback, (snap) => setServices(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateDoc(doc(db, 'services', editingId), { ...formData, updatedAt: serverTimestamp() });
        toast.success('Service updated successfully!');
      } else {
        await addDoc(collection(db, 'services'), { ...formData, createdAt: serverTimestamp() });
        toast.success('New service added successfully!');
      }
      setIsModalOpen(false);
      setFormData({ title: '', description: '', icon: 'Briefcase' });
      setEditingId(null);
    } catch (error: any) {
      toast.error(error.message || 'Error saving service');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'services', id));
      toast.success('Service deleted');
      setDeletingId(null);
    } catch (error: any) {
      toast.error(error.message || 'Error deleting service');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Manage Services</h2>
        <button
          onClick={() => {
            setFormData({ title: '', description: '', icon: 'Briefcase' });
            setEditingId(null);
            setIsModalOpen(true);
          }}
          className="bg-brand-blue text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-brand-blue/90"
        >
          <Plus className="h-4 w-4" /> Add Service
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="p-4 font-semibold text-gray-600">Title</th>
              <th className="p-4 font-semibold text-gray-600">Description</th>
              <th className="p-4 font-semibold text-gray-600 w-24">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {services.map((service) => (
              <tr key={service.id} className="hover:bg-gray-50">
                <td className="p-4 font-medium text-gray-900">{service.title}</td>
                <td className="p-4 text-gray-600 text-sm line-clamp-2">{service.description}</td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <button onClick={() => {
                      setFormData({ title: service.title, description: service.description, icon: service.icon || 'Briefcase' });
                      setEditingId(service.id);
                      setIsModalOpen(true);
                    }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button onClick={() => setDeletingId(service.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {services.length === 0 && (
              <tr>
                <td colSpan={3} className="p-8 text-center text-gray-500">No services found. Add one to get started.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">{editingId ? 'Edit Service' : 'Add Service'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:bg-gray-100 p-2 rounded-full">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-blue outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea required rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-blue outline-none" />
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Icon Name (Lucide)</label>
                <div 
                  className="w-full px-3 py-2 border rounded-lg flex items-center justify-between cursor-pointer hover:border-brand-blue"
                  onClick={() => setShowIconPicker(!showIconPicker)}
                >
                  <div className="flex items-center gap-2">
                    {formData.icon && (Icons as any)[formData.icon] ? (
                      React.createElement((Icons as any)[formData.icon], { className: "h-5 w-5 text-brand-blue" })
                    ) : (
                      <Icons.Briefcase className="h-5 w-5 text-gray-400" />
                    )}
                    <span className="text-gray-700">{formData.icon || 'Select an icon'}</span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>
                
                {showIconPicker && (
                  <div className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-60 overflow-hidden flex flex-col">
                    <div className="p-2 border-b flex items-center gap-2 sticky top-0 bg-white">
                      <Search className="h-4 w-4 text-gray-400" />
                      <input 
                        type="text" 
                        placeholder="Search icons..." 
                        value={iconSearch}
                        onChange={e => setIconSearch(e.target.value)}
                        className="w-full outline-none text-sm"
                        onClick={e => e.stopPropagation()}
                      />
                    </div>
                    <div className="overflow-y-auto p-2 grid grid-cols-5 gap-2">
                      {filteredIcons.map(iconName => {
                        const IconComponent = (Icons as any)[iconName];
                        return (
                          <button
                            key={iconName}
                            type="button"
                            onClick={() => {
                              setFormData({...formData, icon: iconName});
                              setShowIconPicker(false);
                              setIconSearch('');
                            }}
                            className={`p-2 flex flex-col items-center justify-center rounded hover:bg-brand-blue/10 transition-colors ${formData.icon === iconName ? 'bg-brand-blue/10 text-brand-blue' : 'text-gray-600'}`}
                            title={iconName}
                          >
                            <IconComponent className="h-6 w-6 mb-1" />
                            <span className="text-[10px] truncate w-full text-center">{iconName}</span>
                          </button>
                        );
                      })}
                      {filteredIcons.length === 0 && (
                        <div className="col-span-5 text-center py-4 text-sm text-gray-500">No icons found</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <button type="submit" className="w-full bg-brand-blue text-white py-2 rounded-lg font-medium hover:bg-brand-blue/90">
                {editingId ? 'Update Service' : 'Save Service'}
              </button>
            </form>
          </div>
        </div>
      )}

      {deletingId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-xl font-bold mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this service? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeletingId(null)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium">
                Cancel
              </button>
              <button onClick={() => handleDelete(deletingId)} className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg font-medium">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
