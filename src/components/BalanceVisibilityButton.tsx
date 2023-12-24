'use client';

import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useContext } from 'react';
import { BalanceVisibilityContext } from './Providers';
import { Button } from './ui/button';

const BalanceVisibilityButton = () => {
  const { isBalanceVisible, setIsBalanceVisible } = useContext(BalanceVisibilityContext);

  return (
    <Button className="-mt-4 gap-1" variant="ghost" onClick={() => setIsBalanceVisible(!isBalanceVisible)}>
      {isBalanceVisible ? (
        <>
          <EyeOffIcon />
          <span>Hide balance</span>
        </>
      ) : (
        <>
          <EyeIcon />
          <span>Show balance</span>
        </>
      )}
    </Button>
  );
};

export default BalanceVisibilityButton;
