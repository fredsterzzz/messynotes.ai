import React, { createContext, useContext, useState, useEffect } from 'react';
import { PaymentService } from '../services/paymentService';
import { useAuth } from './AuthContext';

export type PlanType = 'free' | 'basic' | 'premium' | 'team';

interface PlanFeatures {
  transformationsPerMonth: number;
  aiTones: 'basic' | 'advanced' | 'all';
  templates: 'basic' | 'advanced' | 'all';
  noteTypes: 'text' | 'all';
  teamMembers: number;
  customBranding: boolean;
  prioritySupport: boolean;
  apiAccess: boolean;
  imageGeneration: boolean;
  maxNoteLength: number;
  maxProjects: number;
  exportFormats: string[];
}

export const PLAN_FEATURES: Record<PlanType, PlanFeatures> = {
  free: {
    transformationsPerMonth: 5,
    aiTones: 'basic',
    templates: 'basic',
    noteTypes: 'text',
    teamMembers: 1,
    customBranding: false,
    prioritySupport: false,
    apiAccess: false,
    imageGeneration: false,
    maxNoteLength: 1000, // 1000 characters
    maxProjects: 3,
    exportFormats: ['txt', 'pdf']
  },
  basic: {
    transformationsPerMonth: 50,
    aiTones: 'advanced',
    templates: 'advanced',
    noteTypes: 'text',
    teamMembers: 1,
    customBranding: false,
    prioritySupport: false,
    apiAccess: false,
    imageGeneration: false,
    maxNoteLength: 5000, // 5000 characters
    maxProjects: 10,
    exportFormats: ['txt', 'pdf', 'docx']
  },
  premium: {
    transformationsPerMonth: 200,
    aiTones: 'all',
    templates: 'all',
    noteTypes: 'all',
    teamMembers: 5,
    customBranding: true,
    prioritySupport: true,
    apiAccess: false,
    imageGeneration: true,
    maxNoteLength: 20000, // 20000 characters
    maxProjects: 100,
    exportFormats: ['txt', 'pdf', 'docx', 'md', 'html']
  },
  team: {
    transformationsPerMonth: 1000,
    aiTones: 'all',
    templates: 'all',
    noteTypes: 'all',
    teamMembers: 20,
    customBranding: true,
    prioritySupport: true,
    apiAccess: true,
    imageGeneration: true,
    maxNoteLength: 50000, // 50000 characters
    maxProjects: -1, // unlimited
    exportFormats: ['txt', 'pdf', 'docx', 'md', 'html', 'json', 'xml']
  }
};

export const STRIPE_PRICE_IDS = {
  basic: import.meta.env.VITE_STRIPE_BASIC_PRICE_ID!,
  premium: import.meta.env.VITE_STRIPE_PREMIUM_PRICE_ID!,
  team: import.meta.env.VITE_STRIPE_TEAM_PRICE_ID!,
} as const;

interface SubscriptionContextType {
  currentPlan: PlanType;
  transformationsLeft: number;
  updatePlan: (plan: PlanType) => void;
  canUseFeature: (feature: keyof PlanFeatures) => boolean;
  canTransform: () => boolean;
  useTransformation: () => void;
  getFeatureLimit: (feature: 'maxNoteLength' | 'maxProjects' | 'transformationsPerMonth') => number;
  getAvailableFormats: () => string[];
  resetTransformationsCount: () => void;
  isLoading: boolean;
  error: string | null;
  subscriptionStatus: string | null;
  checkoutSubscription: (priceId: string) => Promise<void>;
  cancelSubscription: () => Promise<void>;
  updateSubscription: (newPriceId: string) => Promise<void>;
  getSubscriptionStatus: () => Promise<any>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [currentPlan, setCurrentPlan] = useState<PlanType>('free');
  const [transformationsLeft, setTransformationsLeft] = useState(PLAN_FEATURES.free.transformationsPerMonth);
  const [lastReset, setLastReset] = useState<string>(new Date().toISOString());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const checkSubscriptionStatus = async () => {
      if (!user) {
        setCurrentPlan('free');
        setSubscriptionStatus(null);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const status = await PaymentService.getSubscriptionStatus();
        setSubscriptionStatus(status.status);
        if (status.plan) {
          setCurrentPlan(status.plan as PlanType);
        } else {
          setCurrentPlan('free');
        }
      } catch (err: any) {
        setError(err.message);
        setCurrentPlan('free');
      } finally {
        setIsLoading(false);
      }
    };

    checkSubscriptionStatus();
  }, [user]);

  const resetTransformationsCount = () => {
    setTransformationsLeft(PLAN_FEATURES[currentPlan].transformationsPerMonth);
    setLastReset(new Date().toISOString());
  };

  useEffect(() => {
    const now = new Date();
    const lastResetDate = new Date(lastReset);

    if (now.getMonth() !== lastResetDate.getMonth() || now.getFullYear() !== lastResetDate.getFullYear()) {
      resetTransformationsCount();
    }
  }, [lastReset, resetTransformationsCount]);

  const updatePlan = (plan: PlanType) => {
    setCurrentPlan(plan);
    setTransformationsLeft(PLAN_FEATURES[plan].transformationsPerMonth);
    setLastReset(new Date().toISOString());
  };

  const canUseFeature = (feature: keyof PlanFeatures) => {
    if (typeof PLAN_FEATURES[currentPlan][feature] === 'boolean') {
      return PLAN_FEATURES[currentPlan][feature] as boolean;
    }
    return true; // For non-boolean features
  };

  const canTransform = () => {
    return transformationsLeft > 0;
  };

  const useTransformation = () => {
    if (canTransform()) {
      setTransformationsLeft(prev => prev - 1);
      return true;
    }
    return false;
  };

  const getFeatureLimit = (feature: 'maxNoteLength' | 'maxProjects' | 'transformationsPerMonth') => {
    return PLAN_FEATURES[currentPlan][feature];
  };

  const getAvailableFormats = () => {
    return PLAN_FEATURES[currentPlan].exportFormats;
  };

  const checkoutSubscription = async (priceId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await PaymentService.createSubscription(priceId);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const cancelSubscription = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await PaymentService.cancelSubscription();
      setCurrentPlan('free');
      setSubscriptionStatus('canceled');
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateSubscription = async (newPriceId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await PaymentService.updateSubscription(newPriceId);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getSubscriptionStatus = async () => {
    try {
      setIsLoading(true);
      setError(null);
      return await PaymentService.getSubscriptionStatus();
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SubscriptionContext.Provider
      value={{
        currentPlan,
        transformationsLeft,
        updatePlan,
        canUseFeature,
        canTransform,
        useTransformation,
        getFeatureLimit,
        getAvailableFormats,
        resetTransformationsCount,
        isLoading,
        error,
        subscriptionStatus,
        checkoutSubscription,
        cancelSubscription,
        updateSubscription,
        getSubscriptionStatus,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}
