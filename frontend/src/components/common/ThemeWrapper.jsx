'use client';

import { useEffect } from 'react';
import { useSelector } from 'react-redux';

export default function ThemeWrapper({ children }) {
  const mode = useSelector((state) => state.theme.mode);

  useEffect(() => {
    // Get the root html element
    const root = document.documentElement;
    
    // Remove both classes first
    root.classList.remove('light', 'dark');
    
    // Add the current mode class
    root.classList.add(mode);
    
    console.log('Theme changed to:', mode);  
  }, [mode]);

  return <>{children}</>;
}
