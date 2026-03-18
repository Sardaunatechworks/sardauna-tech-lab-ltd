import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, QueryConstraint, DocumentData } from 'firebase/firestore';
import { db } from '../firebase';

interface FirestoreOptions<T> {
  queryConstraints?: QueryConstraint[];
  initialData?: T[];
}

/**
 * Custom hook for real-time Firestore collection data.
 * @param collectionName The name of the Firestore collection
 * @param options Query constraints and initial/fallback data
 * @returns Array of document data
 */
export function useFirestore<T = DocumentData>(
  collectionName: string,
  options: FirestoreOptions<T> = {}
) {
  const [data, setData] = useState<T[]>(options.initialData || []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let q = query(collection(db, collectionName), ...(options.queryConstraints || []));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
        setData(docs);
        setLoading(false);
      },
      (err) => {
        console.error(`Error fetching collection ${collectionName}:`, err);
        setError(err);
        setLoading(false);
        
        // Fallback to initial data if index is missing (common Firestore dev issue)
        if (err.message.includes('index') && options.initialData) {
          console.warn(`Falling back to initial data for ${collectionName} due to missing index.`);
          setData(options.initialData);
        }
      }
    );

    return () => unsubscribe();
  }, [collectionName, JSON.stringify(options.queryConstraints)]);

  return { data, loading, error };
}
