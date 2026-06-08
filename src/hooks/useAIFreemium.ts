import { useState, useEffect } from 'react';
import { toast } from 'sonner';

const MAX_FREE_USES = 3;
const STORAGE_KEY = 'aadhyra_ai_uses';

export const useAIFreemium = () => {
  const [usesCount, setUsesCount] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setUsesCount(parseInt(saved, 10));
    }
  }, []);

  const incrementUse = () => {
    const newCount = usesCount + 1;
    setUsesCount(newCount);
    localStorage.setItem(STORAGE_KEY, newCount.toString());
  };

  const checkCanUse = () => {
    if (usesCount >= MAX_FREE_USES) {
      toast.error('Free trial limit reached', {
        description: 'You have used your 3 free AI checkups. Please upgrade to continue using AADHYRA AI.'
      });
      return false;
    }
    return true;
  };

  return {
    usesCount,
    usesLeft: Math.max(0, MAX_FREE_USES - usesCount),
    checkCanUse,
    incrementUse,
    isPremiumBlocked: usesCount >= MAX_FREE_USES
  };
};
