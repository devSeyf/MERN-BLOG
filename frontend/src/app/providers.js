'use client';

import { Provider } from 'react-redux';
import { store } from '@/redux/store';
import ThemeWrapper from '@/components/common/ThemeWrapper';

export function Providers({ children }) {
  return (
    <Provider store={store}>
      <ThemeWrapper>
        {children}
      </ThemeWrapper>
    </Provider>
  );
}
