import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';
import { compressImage } from '../../utils/imageCompression';
import { Plus, Edit2, Trash2, X, CheckCircle2, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '', status: 'Live', image: '', ctaLink: '' });

  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (err) => {
      if (err.message.includes('index')) {
        onSnapshot(query(collection(db, 'products')), (snap) => setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
      }
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
        await updateDoc(doc(db, 'products', editingId), { ...dataToSave, updatedAt: serverTimestamp() });
        setSuccessMessage('Product updated successfully!');
      } else {
        await addDoc(collection(db, 'products'), { ...dataToSave, createdAt: serverTimestamp() });
        setSuccessMessage('New product added successfully!');
      }
      setIsModalOpen(false);
      setFormData({ name: '', description: '', status: 'Live', image: '', ctaLink: '' });
      setEditingId(null);
      setSelectedFile(null);
    } catch (error: any) {
      toast.error(error.message || 'Error saving product');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'products', id));
      toast.success('Product deleted');
      setDeletingId(null);
    } catch (error: any) {
      toast.error(error.message || 'Error deleting product');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Manage Products</h2>
        <button
          onClick={() => {
            setFormData({ name: '', description: '', status: 'Live', image: '', ctaLink: '' });
            setEditingId(null);
            setSelectedFile(null);
            setIsModalOpen(true);
          }}
          className="bg-brand-blue text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-brand-blue/90"
        >
          <Plus className="h-4 w-4" /> Add Product
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="p-4 font-semibold text-gray-600">Product</th>
              <th className="p-4 font-semibold text-gray-600">Status</th>
              <th className="p-4 font-semibold text-gray-600 w-24">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    {product.image && <img src={product.image} alt="" className="w-10 h-10 rounded object-cover" />}
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-xs text-gray-500 line-clamp-1">{product.description}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.status === 'Live' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {product.status}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <button onClick={() => {
                      setFormData({ name: product.name, description: product.description, status: product.status, image: product.image, ctaLink: product.ctaLink });
                      setEditingId(product.id);
                      setSelectedFile(null);
                      setIsModalOpen(true);
                    }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button onClick={() => setDeletingId(product.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={3} className="p-8 text-center text-gray-500">No products found. Add one to get started.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">{editingId ? 'Edit Product' : 'Add Product'}</h3>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea required rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-blue outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-blue outline-none">
                  <option value="Live">Live</option>
                  <option value="Concept">Concept</option>
                  <option value="In Development">In Development</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                <div className="flex items-center gap-3">
                  {formData.image && (
                    <img src={formData.image} alt="Preview" className="w-12 h-12 rounded object-cover border" referrerPolicy="no-referrer" />
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
                <label className="block text-sm font-medium text-gray-700 mb-1">CTA Link</label>
                <input type="text" value={formData.ctaLink} onChange={e => setFormData({...formData, ctaLink: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-blue outline-none" />
              </div>
              <button type="submit" disabled={isUploading} className="w-full bg-brand-blue text-white py-2 rounded-lg font-medium hover:bg-brand-blue/90 disabled:opacity-50">
                {editingId ? 'Update Product' : 'Save Product'}
              </button>
            </form>
          </div>
        </div>
      )}

      {deletingId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-xl font-bold mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this product? This action cannot be undone.</p>
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

      {successMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm text-center">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">Success</h3>
            <p className="text-gray-600 mb-6">{successMessage}</p>
            <button onClick={() => setSuccessMessage(null)} className="w-full px-4 py-2 bg-brand-blue text-white hover:bg-brand-blue/90 rounded-lg font-medium">
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
