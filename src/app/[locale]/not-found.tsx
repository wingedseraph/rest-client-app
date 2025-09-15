import { Link } from '@/i18n/navigation';

import { useTranslations } from 'next-intl';

export default function NotFoundPage() {
  const t = useTranslations('NotFound');

  return (
    <div className="flex min-h-screen flex-col items-center justify-center space-y-6 p-8 text-center">
      <h1 className="font-bold text-3xl text-gray-900 dark:text-gray-100">
        {t('title')}
      </h1>
      <p className="max-w-md text-gray-600 text-lg dark:text-gray-400">
        {t('description')}
      </p>
      <Link
        href="/"
        className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-background transition hover:bg-blue-700"
      >
        {t('back')}
      </Link>
    </div>
  );
}
