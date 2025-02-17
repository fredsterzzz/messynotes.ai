/** @jsxImportSource react */
import { createContext, useContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

interface Subscription {
  status: 'active' | 'inactive' | 'canceled';
  plan: string;
  currentPeriodEnd: Date;
}

interface SubscriptionContextType {
  subscription: Subscription | null;
  loading: boolean;
  error: string | null;
  refreshSubscription: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType>({
  subscription: null,
  loading: true,
  error: null,
  refreshSubscription: async () => {}
});

export function useSubscription() {
  return useContext(SubscriptionContext);
}

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const auth = getAuth();
  const db = getFirestore();

  const fetchSubscription = async (userId: string) => {
    try {
      const subscriptionDoc = await getDoc(doc(db, 'subscriptions', userId));
      
      if (subscriptionDoc.exists()) {
        const data = subscriptionDoc.data();
        setSubscription({
          status: data.status,
          plan: data.plan,
          currentPeriodEnd: data.currentPeriodEnd.toDate()
        });
      } else {
        setSubscription(null);
      }
    } catch (err) {
      console.error('Error fetching subscription:', err);
      setError('Failed to fetch subscription status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchSubscription(user.uid);
      } else {
        setSubscription(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const refreshSubscription = async () => {
    const user = auth.currentUser;
    if (user) {
      setLoading(true);
      await fetchSubscription(user.uid);
    }
  };

  return (
    <SubscriptionContext.Provider
      value={{
        subscription,
        loading,
        error,
        refreshSubscription
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}
