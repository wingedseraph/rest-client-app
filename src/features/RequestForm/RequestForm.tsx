import BodyEditor from './BodyEditor';
import HeaderEditor from './HeaderEditor';
import HeaderList from './HeaderList';
import MethodUrl from './MethodUrl';
import ResponseViewer from './ResponseViewer';
import { useHttpRequest } from './useHttpRequest';
import type { HttpRequest, RequestError } from './useSharedRequest';

type Props = {
  request: HttpRequest;
  currentMethod: HttpRequest['method'];
  setCurrentMethod: (method: HttpRequest['method']) => void;
  response: unknown;
  error: RequestError;
  addHeader: (key: string, value: string) => void;
  removeHeader: (key: string) => void;
  updateRequest: (updates: Partial<HttpRequest>) => void;
  setRequestError: (error: RequestError) => void;
  setRequestResponse: (response: unknown) => void;
};

export default function RequestForm({
  request,
  currentMethod,
  setCurrentMethod,
  response,
  error,
  addHeader,
  removeHeader,
  updateRequest,
  setRequestError,
  setRequestResponse,
}: Props) {
  const { handleSubmit, isLoading } = useHttpRequest({
    request,
    updateRequest,
    setRequestError,
    setRequestResponse,
  });

  return (
    <div className="flex w-full max-w-full flex-col overflow-hidden p-2">
      <form onSubmit={handleSubmit} className="flex flex-col">
        <MethodUrl
          method={currentMethod}
          onMethodChange={(method) => {
            setCurrentMethod(method);
            updateRequest({ method });
          }}
          defaultUrl={request.url || ''}
          onUrlChange={(url) => updateRequest({ url })}
          isLoading={isLoading}
        />

        <HeaderList headers={request.headers} onRemove={removeHeader} />
        <HeaderEditor onAdd={addHeader} />

        <BodyEditor
          method={currentMethod}
          defaultBody={request.body || ''}
          bodyError={error.body}
          onBodyChange={(body) => updateRequest({ body })}
        />
      </form>

      <ResponseViewer response={response} />
    </div>
  );
}
