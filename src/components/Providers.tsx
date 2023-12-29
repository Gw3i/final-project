'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createContext, useState } from 'react';

export interface ProvidersProps {
  children: React.ReactNode;
}

export interface IsBalanceVisibleContextProviderProps {
  isBalanceVisible: boolean;
  setIsBalanceVisible: (isVisible: boolean) => void;
}

export const BalanceVisibilityContext = createContext<IsBalanceVisibleContextProviderProps>({
  isBalanceVisible: false,
  setIsBalanceVisible: () => {},
});

const Providers = ({ children }: ProvidersProps) => {
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);

  const queryClient = new QueryClient();

  return (
    <BalanceVisibilityContext.Provider value={{ isBalanceVisible, setIsBalanceVisible }}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </BalanceVisibilityContext.Provider>
  );
};

export default Providers;
