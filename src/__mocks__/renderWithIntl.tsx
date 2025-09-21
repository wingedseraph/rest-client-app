import type React from 'react';

import en from '../../messages/en.json';
import { render } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';

export function renderWithIntl(ui: React.ReactElement) {
  return render(
    <NextIntlClientProvider locale="en" messages={en}>
      {ui}
    </NextIntlClientProvider>,
  );
}
