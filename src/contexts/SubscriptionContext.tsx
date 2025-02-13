import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type PlanType = 'free' | 'basic' | 'premium' | 'enterprise';

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
  enterprise: {
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
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [currentPlan, setCurrentPlan] = useState<PlanType>('free');
  const [transformationsLeft, setTransformationsLeft] = useState(PLAN_FEATURES.free.transformationsPerMonth);
  const [lastReset, setLastReset] = useState<string>(new Date().toISOString());

  // Consider moving constants or functions to a separate file to support fast refresh

  const resetTransformationsCount = useCallback(() => {
    setTransformationsLeft(PLAN_FEATURES[currentPlan].transformationsPerMonth);
    setLastReset(new Date().toISOString());
  }, [currentPlan]);

  // Reset transformations count monthly
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

  return (
    <SubscriptionContext.Provider value={{
      currentPlan,
      transformationsLeft,
      updatePlan,
      canUseFeature,
      canTransform,
      useTransformation,
      getFeatureLimit,
      getAvailableFormats,
      resetTransformationsCount
    }}>
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
