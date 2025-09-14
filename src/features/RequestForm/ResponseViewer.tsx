import { responseSchema } from '@/app/api/request/schema';

import { useTranslations } from 'next-intl';

export default function ResponseViewer({ response }: { response: unknown }) {
  const t = useTranslations('RequestForm');
  if (!response) return null;
  const { status, statusText, responseTime } = responseSchema.parse(response);
  return (
    <div className="mt-4 flex flex-col">
      <p className="text-sm">
        {t('status.status')}: {status}
      </p>
      <p className="text-sm">
        {t('status.statusText')}: {statusText}
      </p>
      <p className="text-sm">
        {t('status.responseTime')}: {responseTime} ms
      </p>
      <pre className="mt-4 max-h-[70vh] max-w-full overflow-auto whitespace-pre-wrap break-words break-all rounded border bg-gray-100 p-2 text-sm">
        {JSON.stringify(response, null, 2)}
      </pre>
    </div>
  );
}
