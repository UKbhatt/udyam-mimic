export default function SubmissionCard({
  visible,
  form, pan, nameAsPerPan, orgType, dobdoi,
  onRestart,
}) {
  if (!visible) return null;
  // Displays is the submitted Data 
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="rounded-t-lg bg-gray-800 px-4 py-2 text-white font-semibold">
          Submission:
        </div>
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div><strong>Aadhaar:</strong> {form.aadhaar}</div>
          <div><strong>Name (Aadhaar):</strong> {form.name || "-"}</div>
          <div><strong>PAN:</strong> {pan}</div>
          <div><strong>Name (PAN):</strong> {nameAsPerPan || "-"}</div>
          <div><strong>Organisation Type:</strong> {orgType || "-"}</div>
          <div><strong>DOB:</strong> {dobdoi || "-"}</div>
        </div>
      </div>

      <div className="text-center">
        <button className="mt-4 rounded-md border px-4 py-2" onClick={onRestart}>
          Start over
        </button>
      </div>
    </div>
  );
}
