import type { HttpRequest } from '@/features/RequestForm/useHttpRequest';
import { getUserRequests } from '@/services/serverAuthService';

export default async function HistoryRequest() {
  const user = await getUserRequests();

  try {
    return (
      <div className="p-6">
        {user?.length === 0 ? (
          <p className="text-gray-600">No requests found in your history.</p>
        ) : (
          <div className="space-y-4">
            {user.map((request: HttpRequest, index: number) => (
              <div
                key={`${request.timestamp}-${request.url}-${index}`}
                className="rounded-lg border bg-white p-4 shadow-sm"
              >
                <div className="mb-2 flex items-start justify-between">
                  <h3 className="font-semibold text-lg">
                    {request.name || ''}
                  </h3>
                  <span
                    className={`rounded px-2 py-1 text-xs ${
                      request.method === 'GET'
                        ? 'bg-green-100 text-green-800'
                        : request.method === 'POST'
                          ? 'bg-blue-100 text-blue-800'
                          : request.method === 'PUT'
                            ? 'bg-yellow-100 text-yellow-800'
                            : request.method === 'DELETE'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {request.method}
                  </span>
                </div>

                <p className="mb-2 text-gray-600 text-sm">
                  <strong>URL:</strong> {request.url}
                </p>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Body:</strong> {JSON.stringify(request.body)}
                  </div>
                  <div>
                    <strong>Time:</strong> {request.timestamp}
                  </div>
                  <div>
                    <strong>Duration:</strong> {request.duration}ms
                  </div>
                  <div>
                    <strong>Size:</strong> {request.size} bytes
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  } catch (error) {
    return (
      <div className="p-6">
        <h1 className="mb-4 font-bold text-2xl">Request History</h1>
        <p className="text-red-600">
          Error loading request history. Please try again later. Error:{'·'}
          {`${error}`}
        </p>
      </div>
    );
  }
}
