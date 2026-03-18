import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { compressImage } from '../../utils/imageCompression';
import { Plus, Edit2, Trash2, X, GripVertical, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

export default function AdminTeam() {
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({ name: '', role: '', bio: '', image: '', linkedin: '', twitter: '' });

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'team'), (snapshot) => {
      const members: any[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Sort by order, fallback to createdAt or just 0 if missing
      members.sort((a, b) => {
        const orderA = a.order !== undefined ? a.order : 9999;
        const orderB = b.order !== undefined ? b.order : 9999;
        return orderA - orderB;
      });
      setTeamMembers(members);
    }, (err) => {
      toast.error('Error fetching team members: ' + err.message);
    });
    return () => unsubscribe();
  }, []);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setFormData(prev => ({ ...prev, image: URL.createObjectURL(file) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    try {
      let imageUrl = formData.image;
      
      if (selectedFile) {
        imageUrl = await compressImage(selectedFile);
      }

      const dataToSave = { ...formData, image: imageUrl };

      if (editingId) {
        await updateDoc(doc(db, 'team', editingId), { ...dataToSave, updatedAt: serverTimestamp() });
        toast.success('Team member updated successfully!');
      } else {
        await addDoc(collection(db, 'team'), { 
          ...dataToSave, 
          order: teamMembers.length,
          createdAt: serverTimestamp() 
        });
        toast.success('New team member added successfully!');
      }
      setIsModalOpen(false);
      setFormData({ name: '', role: '', bio: '', image: '', linkedin: '', twitter: '' });
      setEditingId(null);
      setSelectedFile(null);
    } catch (error: any) {
      toast.error(error.message || 'Error saving team member');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'team', id));
      toast.success('Team member deleted');
      setDeletingId(null);
    } catch (error: any) {
      toast.error(error.message || 'Error deleting team member');
    }
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const items = Array.from(teamMembers);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setTeamMembers(items); // Optimistic update

    try {
      await Promise.all(items.map((item, index) => 
        updateDoc(doc(db, 'team', item.id), { order: index })
      ));
      toast.success('Order updated successfully');
    } catch (error: any) {
      toast.error('Error updating order: ' + error.message);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Manage Team</h2>
        <button
          onClick={() => {
            setFormData({ name: '', role: '', bio: '', image: '', linkedin: '', twitter: '' });
            setEditingId(null);
            setSelectedFile(null);
            setIsModalOpen(true);
          }}
          className="bg-brand-blue text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-brand-blue/90"
        >
          <Plus className="h-4 w-4" /> Add Team Member
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <DragDropContext onDragEnd={handleDragEnd}>
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="p-4 font-semibold text-gray-600 w-12"></th>
                  <th className="p-4 font-semibold text-gray-600">Member</th>
                  <th className="p-4 font-semibold text-gray-600">Bio</th>
                  <th className="p-4 font-semibold text-gray-600 w-24">Actions</th>
                </tr>
              </thead>
              <Droppable droppableId="team-list">
                {(provided) => (
                  <tbody 
                    className="divide-y divide-gray-100"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {teamMembers.map((member, index) => (
                      <Draggable key={member.id} draggableId={member.id} index={index}>
                        {(provided, snapshot) => (
                          <tr 
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`hover:bg-gray-50 ${snapshot.isDragging ? 'bg-blue-50/50 shadow-sm' : ''}`}
                          >
                            <td className="p-4">
                              <div {...provided.dragHandleProps} className="text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing">
                                <GripVertical className="h-5 w-5" />
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                {member.image ? (
                                  <img src={member.image} alt="" className="w-10 h-10 rounded-full object-cover shadow-sm border border-gray-200" referrerPolicy="no-referrer" />
                                ) : (
                                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold shadow-sm border border-gray-200">
                                    {member.name.charAt(0)}
                                  </div>
                                )}
                                <div>
                                  <p className="font-medium text-gray-900">{member.name}</p>
                                  <p className="text-xs text-gray-500">{member.role}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 text-gray-600 text-sm line-clamp-2">{member.bio}</td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <button onClick={() => {
                                  setFormData({
                                    name: member.name || '',
                                    role: member.role || '',
                                    bio: member.bio || '',
                                    image: member.image || '',
                                    linkedin: member.linkedin || '',
                                    twitter: member.twitter || ''
                                  });
                                  setEditingId(member.id);
                                  setSelectedFile(null);
                                  setIsModalOpen(true);
                                }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                                  <Edit2 className="h-4 w-4" />
                                </button>
                                <button onClick={() => setDeletingId(member.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    {teamMembers.length === 0 && (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-gray-500">No team members found. Add one to get started.</td>
                      </tr>
                    )}
                  </tbody>
                )}
              </Droppable>
            </table>
          </DragDropContext>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">{editingId ? 'Edit Team Member' : 'Add Team Member'}</h3>
              <button onClick={() => { setIsModalOpen(false); setSelectedFile(null); }} className="text-gray-500 hover:bg-gray-100 p-2 rounded-full">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-blue outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <input required type="text" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-blue outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio (Optional)</label>
                <textarea rows={3} value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-blue outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                <div className="flex items-center gap-3">
                  {formData.image && (
                    <img src={formData.image} alt="Preview" className="w-12 h-12 rounded-full object-cover border" referrerPolicy="no-referrer" />
                  )}
                  <div className="flex-1">
                    <label className="flex items-center justify-center w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-brand-blue hover:bg-blue-50 transition-colors">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Upload className="h-4 w-4" />
                        <span className="text-sm font-medium">{isUploading ? 'Uploading...' : 'Upload Image'}</span>
                      </div>
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageSelect} disabled={isUploading} />
                    </label>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs text-gray-500">Or provide a URL:</span>
                  <input type="url" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="flex-1 px-3 py-1 text-sm border rounded focus:ring-2 focus:ring-brand-blue outline-none" placeholder="https://..." />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL (Optional)</label>
                <input type="url" value={formData.linkedin} onChange={e => setFormData({...formData, linkedin: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-blue outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Twitter URL (Optional)</label>
                <input type="url" value={formData.twitter} onChange={e => setFormData({...formData, twitter: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-blue outline-none" />
              </div>
              <button type="submit" disabled={isUploading} className="w-full bg-brand-blue text-white py-2 rounded-lg font-medium hover:bg-brand-blue/90 disabled:opacity-50">
                {editingId ? 'Update Team Member' : 'Save Team Member'}
              </button>
            </form>
          </div>
        </div>
      )}

      {deletingId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-xl font-bold mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this team member? This action cannot be undone.</p>
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
