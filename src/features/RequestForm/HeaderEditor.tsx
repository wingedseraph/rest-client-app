import { useState } from 'react';

import { Button } from '@/shared/ui/Button';

export default function HeaderEditor({
  onAdd,
}: {
  onAdd: (key: string, value: string) => void;
}) {
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const submit = () => {
    if (!key || !value) {
      setError('wrong header key or value');
      return;
    }
    onAdd(key, value);
    setKey('');
    setValue('');
    setError('');
  };

  return (
    <div className="flex flex-col">
      <div className="mt-4 flex flex-wrap gap-2">
        <input
          type="text"
          id="headerKey"
          placeholder="key"
          className="flex-1 rounded border border-gray-300 px-2 py-1 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />
        <input
          type="text"
          id="headerValue"
          placeholder="value"
          className="flex-1 rounded border border-gray-300 px-2 py-1 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <Button
          type="button"
          variant="ghost"
          className="text-foreground text-sm no-underline no-underline hover:bg-foreground hover:text-background"
          onClick={submit}
        >
          Add Header
        </Button>
      </div>
      {error && (
        <span className="mt-4 w-fit bg-foreground text-background">
          {error}
        </span>
      )}
    </div>
  );
}
