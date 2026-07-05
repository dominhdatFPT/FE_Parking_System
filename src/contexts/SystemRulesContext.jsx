import { useCallback, useEffect, useMemo, useState } from 'react';
import SystemRulesModal from '../components/SystemRulesModal';
import { STORAGE_KEYS } from '../constants/storageKeys';
import { useAuth } from './useAuth';
import { SystemRulesContext } from './SystemRulesContextCore';

export function SystemRulesProvider({ children }) {
  const { user } = useAuth();
  const [isRulesOpen, setIsRulesOpen] = useState(false);

  const closeRules = useCallback(() => setIsRulesOpen(false), []);
  const openRules = useCallback(() => setIsRulesOpen(true), []);

  useEffect(() => {
    if (!user) {
      setIsRulesOpen(false);
      return;
    }

    const shouldCheckRules =
      window.sessionStorage.getItem(STORAGE_KEYS.SHOW_SYSTEM_RULES_AFTER_LOGIN) === 'true';

    if (!shouldCheckRules) return;

    window.sessionStorage.removeItem(STORAGE_KEYS.SHOW_SYSTEM_RULES_AFTER_LOGIN);
    setIsRulesOpen(true);
  }, [user]);

  const contextValue = useMemo(
    () => ({ isRulesOpen, openRules, closeRules }),
    [closeRules, isRulesOpen, openRules],
  );

  return (
    <SystemRulesContext.Provider value={contextValue}>
      {children}
      <SystemRulesModal open={isRulesOpen} onClose={closeRules} />
    </SystemRulesContext.Provider>
  );
}
