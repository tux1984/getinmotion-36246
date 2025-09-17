import { useState, useCallback } from 'react';

export interface WizardState {
  images: File[];
  name: string;
  description: string;
  price: number | null;
  category: string;
  tags: string[];
  shortDescription?: string;
  inventory?: number;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  materials?: string[];
  productionTime?: string;
}

const initialState: WizardState = {
  images: [],
  name: '',
  description: '',
  price: null,
  category: '',
  tags: [],
};

export const useWizardState = () => {
  const [wizardState, setWizardState] = useState<WizardState>(() => {
    // Try to restore from localStorage
    const saved = localStorage.getItem('ai-product-wizard-state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...initialState, ...parsed, images: [] }; // Don't restore images from localStorage
      } catch (error) {
        console.warn('Could not restore wizard state:', error);
      }
    }
    return initialState;
  });

  const updateWizardState = useCallback((updates: Partial<WizardState>) => {
    setWizardState(prev => {
      const newState = { ...prev, ...updates };
      
      // Save to localStorage (excluding images)
      const stateToSave = { ...newState };
      delete stateToSave.images;
      localStorage.setItem('ai-product-wizard-state', JSON.stringify(stateToSave));
      
      return newState;
    });
  }, []);

  const resetWizard = useCallback(() => {
    setWizardState(initialState);
    localStorage.removeItem('ai-product-wizard-state');
  }, []);

  return {
    wizardState,
    updateWizardState,
    resetWizard,
  };
};