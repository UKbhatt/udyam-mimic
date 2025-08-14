export default function OtpCard({ step, loading, otp, setOtp, otpErr, verifyOtp }) {
  if (step !== 2) return null;

  return (
    <form onSubmit={verifyOtp} className="space-y-4">
      {/* Opt Card */}
      <div>
        <div className="flex items-center gap-1">
          <p className="text-red-600">*</p>
          <label className="block font-semibold mb-1">
            Enter One Time Password (OTP) Code
          </label>
        </div>
        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          placeholder="OTP code"
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-2
          focus:ring-blue-500"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
        />
        {otpErr && <p className="mt-1 text-sm text-red-600">{otpErr}</p>}
        <p className="text-sm">OTP Error Code:- 8899 - Something unexpected happened</p>
      </div>
      {/* Submission of OTP -123456(demo) */}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? "Verifying..." : "Validate"}
        </button>
      </div>
    </form>
  );
}
