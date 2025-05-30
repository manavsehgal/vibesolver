import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';
import { QueryProvider } from '@/lib/react-query';

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <QueryProvider>{children}</QueryProvider>;
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
