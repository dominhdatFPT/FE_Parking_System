import { useContext } from 'react';
import { SystemRulesContext } from './SystemRulesContextCore';

export function useSystemRules() {
  const context = useContext(SystemRulesContext);

  if (!context) {
    throw new Error('useSystemRules must be used within SystemRulesProvider');
  }

  return context;
}
