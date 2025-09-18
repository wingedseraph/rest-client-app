import type { HttpRequest } from '@/features/RequestForm/useHttpRequest';
import { getFirestore, initializeAdminApp } from '@/lib/firebase/admin';
import { getServerUser } from '@/lib/firebase/server-auth';

interface UserData {
  uid: string;
  name: string;
  authProvider: string;
  email: string;
  requests?: HttpRequest[];
}

export default async function HistoryRequest() {
  const user = await getServerUser();

  if (!user) {
    return (
      <div className="p-6">
        <h1 className="mb-4 font-bold text-2xl">Request History</h1>
        <p className="text-gray-600">
          Please sign in to view your request history.
        </p>
      </div>
    );
  }

  try {
    initializeAdminApp();
    const db = getFirestore();

    const userDoc = await db.collection('users').doc(user.uid).get();

    if (!userDoc.exists) {
      return (
        <div className="p-6">
          <h1 className="mb-4 font-bold text-2xl">Request History</h1>
          <p className="text-gray-600">No user data found.</p>
        </div>
      );
    }

    const userData = userDoc.data() as UserData;
    const userRequests: HttpRequest[] = userData?.requests || [];

    return (
      <div className="p-6">
        <h1 className="mb-6 font-bold text-2xl">Request History</h1>
        <p className="mb-4 text-gray-600 text-sm">
          Welcome, {userData.name} ({userData.email})
        </p>

        {userRequests.length === 0 ? (
          <p className="text-gray-600">No requests found in your history.</p>
        ) : (
          <div className="space-y-4">
            {userRequests.map((request) => (
              <div
                key={request.timestamp}
                className="rounded-lg border bg-white p-4 shadow-sm"
              >
                <div className="mb-2 flex items-start justify-between">
                  <h3 className="font-semibold text-lg">
                    {request.name || 'Unnamed Request'}
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
                    <strong>Time:</strong>{' '}
                    {new Date(request.timestamp).toLocaleString()}
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
