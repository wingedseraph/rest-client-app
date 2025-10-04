import type { ReactNode } from 'react';

import { Providers } from '@/app/providers';

type Props = {
  children: ReactNode;
};

export default function RootLayout({ children }: Props) {
  return <Providers>{children}</Providers>;
}
