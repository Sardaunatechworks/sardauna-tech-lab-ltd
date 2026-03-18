import { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import { format } from 'date-fns';
import { Trash2, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  submittedAt: any;
}

export default function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('submittedAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: Message[] = [];
      snapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() } as Message);
      });
      setMessages(msgs);
      setIsLoading(false);
    }, (error) => {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'messages', id));
      toast.success('Message deleted');
      setDeletingId(null);
    } catch (error) {
      toast.error('Failed to delete message');
    }
  };

  if (isLoading) {
    return <div>Loading messages...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Contact Messages</h2>
        <div className="bg-brand-blue text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
          <Mail className="h-4 w-4" />
          {messages.length} Total
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {messages.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No messages found.</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {messages.map((msg) => (
              <div key={msg.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{msg.name}</h3>
                    <a href={`mailto:${msg.email}`} className="text-brand-blue hover:underline text-sm">
                      {msg.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">
                      {msg.submittedAt?.toDate ? format(msg.submittedAt.toDate(), 'MMM d, yyyy h:mm a') : 'Unknown date'}
                    </span>
                    <button
                      onClick={() => setDeletingId(msg.id)}
                      className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                      title="Delete message"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <p className="text-gray-700 whitespace-pre-wrap">{msg.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {deletingId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-xl font-bold mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this message? This action cannot be undone.</p>
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
