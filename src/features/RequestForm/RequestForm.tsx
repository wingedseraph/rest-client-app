'use client';

import BodyEditor from './BodyEditor';
import HeaderEditor from './HeaderEditor';
import HeaderList from './HeaderList';
import MethodUrl from './MethodUrl';
import ResponseViewer from './ResponseViewer';
import { useHttpRequest } from './useHttpRequest';

export default function RequestForm() {
  const {
    request,
    currentMethod,
    setCurrentMethod,
    response,
    error,
    addHeader,
    removeHeader,
    handleSubmit,
  } = useHttpRequest();

  return (
    <div className="flex w-full max-w-full flex-col overflow-hidden p-2">
      <form onSubmit={handleSubmit} className="flex flex-col">
        <MethodUrl
          method={currentMethod}
          onMethodChange={setCurrentMethod}
          defaultUrl={request.url || ''}
        />

        <HeaderList headers={request.headers} onRemove={removeHeader} />
        <HeaderEditor onAdd={addHeader} />

        <BodyEditor
          method={currentMethod}
          defaultBody={request.body || ''}
          bodyError={error.body}
        />
      </form>

      <ResponseViewer response={response} />
    </div>
  );
}
