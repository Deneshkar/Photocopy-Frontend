function StatusBox({ title, data }) {
  return (
    <div className="panel p-5">
      <h2 className="font-display text-lg font-semibold text-slate-900">{title}</h2>

      <div className="mt-4 space-y-2">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between rounded-xl border border-paper-200 bg-paper-100 px-3 py-2">
            <span className="text-sm capitalize text-slate-600">{key}</span>
            <strong className="rounded-full bg-white px-2.5 py-0.5 text-sm text-slate-800">{value}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StatusBox;
