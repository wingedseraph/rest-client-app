'use client';

import CodegenForm from '@/features/Codegen/CodegenForm';
import RequestForm from '@/features/RequestForm/RequestForm';
import { useSharedRequest } from '@/features/RequestForm/useSharedRequest';

export default function RestClientPage() {
  const {
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
  } = useSharedRequest();

  return (
    <div className="flex flex-col gap-4 p-2">
      <RequestForm
        request={request}
        currentMethod={currentMethod}
        setCurrentMethod={setCurrentMethod}
        response={response}
        error={error}
        addHeader={addHeader}
        removeHeader={removeHeader}
        updateRequest={updateRequest}
        setRequestError={setRequestError}
        setRequestResponse={setRequestResponse}
      />
      <CodegenForm request={request} />
    </div>
  );
}
