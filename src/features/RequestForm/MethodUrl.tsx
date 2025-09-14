import { Button } from '@/shared/ui/Button';

import type { HttpRequest } from './useHttpRequest';
import { HTML_METHODS } from './useHttpRequest';

type Props = {
  method: HttpRequest['method'];
  onMethodChange: (method: HttpRequest['method']) => void;
  defaultUrl: string;
};

export default function MethodUrl({
  method,
  onMethodChange,
  defaultUrl,
}: Props) {
  return (
    <div className="flex flex-col items-center gap-4 p-4 sm:flex-row sm:p-0">
      <select
        name="method"
        defaultValue={method}
        onChange={(e) =>
          onMethodChange(e.target.value as HttpRequest['method'])
        }
      >
        {Object.values(HTML_METHODS).map((method) => (
          <option key={method.id} value={method.value}>
            {method.value}
          </option>
        ))}
      </select>
      <input
        name="url"
        type="text"
        required
        className="my-4 w-full flex-1 rounded border border-gray-300 px-2 py-1 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-foreground sm:w-auto"
        defaultValue={defaultUrl}
        placeholder="external source"
      />
      <Button
        type="submit"
        variant="ghost"
        className="text-foreground text-sm no-underline hover:bg-foreground hover:text-background"
      >
        Request
      </Button>
    </div>
  );
}
