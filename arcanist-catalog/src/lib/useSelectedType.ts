import { useEffect, useState } from 'react';
import { TYPE_EVENT, readTypeFromUrl } from './productType';

// The type in the address, followed through the menu and Back/Forward. Empty means "Todo".
export function useSelectedType(): string {
  const [type, setType] = useState('');
  useEffect(() => {
    const sync = () => setType(readTypeFromUrl());
    sync();
    window.addEventListener('popstate', sync);
    window.addEventListener(TYPE_EVENT, sync);
    return () => {
      window.removeEventListener('popstate', sync);
      window.removeEventListener(TYPE_EVENT, sync);
    };
  }, []);
  return type;
}
