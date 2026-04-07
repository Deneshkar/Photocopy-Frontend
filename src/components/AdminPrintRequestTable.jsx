import { buildFileUrl } from "../services/api";

function AdminPrintRequestTable({
  requests,
  onStatusChange,
  onDeleteRequest,
  updatingRequestId,
}) {
  return (
    <div className="panel overflow-x-auto p-5">
      <h2 className="font-display text-lg font-semibold text-slate-900">Print Request List</h2>

      {requests.length === 0 ? (
        <p className="mt-3 text-sm text-slate-500">No print requests found.</p>
      ) : (
        <table className="mt-4 min-w-full border-separate border-spacing-y-2">
          <thead className="text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-3 py-2">Customer</th>
              <th className="px-3 py-2">Phone</th>
              <th className="px-3 py-2">File</th>
              <th className="px-3 py-2">Copies</th>
              <th className="px-3 py-2">Print Type</th>
              <th className="px-3 py-2">Paper Size</th>
              <th className="px-3 py-2">Sides</th>
              <th className="px-3 py-2">Note</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Date</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="stagger-fade">
            {requests.map((request) => (
              <tr key={request._id} className="rounded-xl bg-paper-100 text-sm text-slate-700">
                <td className="rounded-l-xl px-3 py-3 font-medium">{request.customerName}</td>
                <td className="px-3 py-3">{request.phone}</td>
                <td className="px-3 py-3">
                  <div className="min-w-[160px]">
                    <div>{request.originalFileName}</div>
                    {request.file && (
                      <a
                        href={buildFileUrl(request.file)}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1 inline-block font-semibold text-brand-700 hover:text-brand-800"
                      >
                        Open File
                      </a>
                    )}
                  </div>
                </td>
                <td className="px-3 py-3">{request.copies}</td>
                <td className="px-3 py-3">{formatText(request.printType)}</td>
                <td className="px-3 py-3">{request.paperSize}</td>
                <td className="px-3 py-3">{formatText(request.sides)}</td>
                <td className="px-3 py-3">{request.note || "No note"}</td>
                <td className="px-3 py-3">
                  <span className={`status-badge ${getStatusStyle(request.status)}`}>
                    {request.status}
                  </span>
                </td>
                <td className="px-3 py-3">
                  {new Date(request.createdAt).toLocaleString()}
                </td>
                <td className="rounded-r-xl px-3 py-3">
                  <div className="flex items-start gap-2">
                    <div className="flex flex-col">
                      <select
                        value={request.status}
                        onChange={(e) =>
                          onStatusChange(request._id, e.target.value)
                        }
                        disabled={updatingRequestId === request._id}
                        className="input-ui h-10 w-32"
                      >
                        <option value="pending">Pending</option>
                        <option value="accepted">Accepted</option>
                        <option value="printing">Printing</option>
                        <option value="completed">Completed</option>
                        <option value="rejected">Rejected</option>
                      </select>

                      {updatingRequestId === request._id && (
                        <p className="mt-1 text-xs text-slate-500">Updating...</p>  
                      )}
                    </div>
                    <button
                      onClick={() => onDeleteRequest && onDeleteRequest(request._id)}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600 transition-colors hover:bg-red-100 hover:text-red-700"
                      title="Delete Print Request"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const formatText = (text) => {
  if (!text) return "";
  return text.replaceAll("_", " ");
};

const getStatusStyle = (status) => {
  if (status === "pending") return "bg-amber-100 text-amber-700";
  if (status === "accepted") return "bg-blue-100 text-blue-700";
  if (status === "printing") return "bg-violet-100 text-violet-700";
  if (status === "completed") return "bg-mint-100 text-mint-500";
  if (status === "rejected") return "bg-red-100 text-red-700";
  return "bg-paper-100 text-slate-600";
};

export default AdminPrintRequestTable;
