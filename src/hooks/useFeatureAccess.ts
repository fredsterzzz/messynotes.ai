import { useSubscription } from '../contexts/SubscriptionContext';
import { PLAN_FEATURES } from '../contexts/SubscriptionContext';
import type { PlanType } from '../contexts/SubscriptionContext';

export const useFeatureAccess = () => {
  const {
    currentPlan,
    canUseFeature,
    canTransform,
    transformationsLeft,
    getFeatureLimit,
    getAvailableFormats
  } = useSubscription();

  const checkAccess = {
    // Tone features
    canUseAdvancedTones: () => ['basic', 'premium', 'enterprise'].includes(currentPlan),
    canUseAllTones: () => ['premium', 'enterprise'].includes(currentPlan),
    
    // Template features
    canUseAdvancedTemplates: () => ['basic', 'premium', 'enterprise'].includes(currentPlan),
    canUseAllTemplates: () => ['premium', 'enterprise'].includes(currentPlan),
    
    // Premium features
    canUseImageGeneration: () => canUseFeature('imageGeneration'),
    canUseCustomBranding: () => canUseFeature('customBranding'),
    canUsePrioritySupport: () => canUseFeature('prioritySupport'),
    canUseApiAccess: () => canUseFeature('apiAccess'),
    
    // Team features
    canAddTeamMembers: () => PLAN_FEATURES[currentPlan].teamMembers > 1,
    getMaxTeamMembers: () => PLAN_FEATURES[currentPlan].teamMembers,
    
    // Content limits
    getMaxNoteLength: () => getFeatureLimit('maxNoteLength'),
    getMaxProjects: () => getFeatureLimit('maxProjects'),
    getAvailableExportFormats: () => getAvailableFormats(),
    
    // Transformation features
    getRemainingTransformations: () => transformationsLeft,
    getMonthlyTransformations: () => getFeatureLimit('transformationsPerMonth'),
    canPerformTransformation: () => canTransform(),
    
    // Helper methods
    getCurrentPlan: () => currentPlan,
    isFreePlan: () => currentPlan === 'free',
    needsUpgrade: (feature: keyof typeof PLAN_FEATURES[PlanType]) => !canUseFeature(feature),
    
    // Get upgrade suggestions
    getUpgradeSuggestion: () => {
      if (currentPlan === 'free') return 'basic';
      if (currentPlan === 'basic') return 'premium';
      if (currentPlan === 'premium') return 'enterprise';
      return null;
    }
  };

  return checkAccess;
};
