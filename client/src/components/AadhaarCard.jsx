import OtpCard from "./OtpCard";

export default function AadhaarCard({
  form, updateForm, err,
  canSendOtp, aadhaarLocked, loading, step,
  sendOtp, setOtp,
  verifyOtp,
  otp,
  otpErr,
}) {
  const validAadhaar = /^[0-9]{12}$/.test(form.aadhaar);

  return (
    <section className={`bg-white border border-gray-200 ${aadhaarLocked ? "opacity-75" : ""}`}>
      <div className="rounded-sm bg-blue-500 px-4 py-2 text-white font-normal border-b h-12 items-center">
        Aadhaar Verification With OTP
      </div>
      {/* Aadhar form to fill details */}
      <div className="px-6 py-6 space-y-5">
        <form onSubmit={sendOtp} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold mb-1 text-sm">1. Aadhaar Number/ आधार संख्या</label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={12}
                placeholder="Your Aadhaar No"
                className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 
                  ${aadhaarLocked ? "bg-gray-400 cursor-not-allowed border-gray-200" : "bg-white border-gray-300"
                  }`}
                value={form.aadhaar}
                readOnly={aadhaarLocked}
                onChange={(e) => updateForm("aadhaar", e.target.value.replace(/\D/g, ""))}
              />
              {!validAadhaar && form.aadhaar.length > 0 && (
                <p className="mt-1 text-sm text-red-600">Enter a valid 12-digit Aadhaar</p>
              )}
            </div>

            <div>
              <label className="block font-bold mb-1 text-sm">2. Name of Entrepreneur / उद्यमी का नाम</label>
              <input
                type="text"
                placeholder="Name as per Aadhaar"
                className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 
                  ${aadhaarLocked ? "bg-gray-400 cursor-not-allowed border-gray-400" : "bg-white border-gray-300"
                  }`}
                value={form.name}
                readOnly={aadhaarLocked}
                onChange={(e) => updateForm("name", e.target.value)}
              />
            </div>
          </div>

          <ul className="list-disc pl-6 space-y-1 text-[15px] text-gray-800">
            <li>Aadhaar number shall be required for Udyam Registration.</li>
            <li>The Aadhaar number shall be of the proprietor in the case of a proprietorship firm, of the managing
              partner in the case of a partnership firm and of a karta in the case of a Hindu Undivided Family (HUF).</li>
            <li>
              In case of a Company or a Limited Liability Partnership or a Cooperative Society or a Society or a Trust,
              the organisation or its authorised signatory
              shall provide its GSTIN(As per applicablity of CGST Act 2017 and as notified by the ministry of MSME{" "}
              <a className="text-blue-600 underline" href="https://udyamregistration.gov.in/UdyamRegistration.aspx" 
              target="_blank" rel="noreferrer">
                vide S.O. 1055(E) dated 05th March 2021
              </a>
              ) and PAN along with its Aadhaar number.
            </li>
          </ul>

          <label className="flex items-start gap-2 text-[15px] text-gray-900">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4"
              checked={form.consent}
              disabled={aadhaarLocked}
              onChange={(e) => updateForm("consent", e.target.checked)}
            />
            <span>
              I, the holder of the above Aadhaar, hereby give my consent to Ministry of MSME, Government of India,
              for using my Aadhaar number as alloted by UIDAI for Udyam Registration. NIC / Ministry of MSME, Government of
              India, have informed me that my aadhaar data will not be stored/shared. / मैं, आधार धारक, इस प्रकार उद्यम पंजीकरण
              के लिए यूआईडीएआई के साथ अपने आधार संख्या का उपयोग करने के लिए सू0ल0म0उ0 मंत्रालय, भारत सरकार को अपनी सहमति देता हूं।
              एनआईसी / सू0ल0म0उ0 मंत्रालय, भारत सरकार ने मुझे सूचित किया है कि मेरा आधार डेटा संग्रहीत / साझा नहीं किया जाएगा।
            </span>
          </label>

          {err && <p className="text-sm text-red-600">{err}</p>}

          {step === 1 && (
            <button
              type="submit"
              disabled={!canSendOtp}
              className={`inline-flex items-center rounded-md px-4 py-2 text-white 
                hover:bg-[#1556bf] bg-[#2c77ef] duration-100`}
            >
              {loading ? "Sending OTP..." : "Validate & Generate OTP"}
            </button>
          )}
        </form>
        <OtpCard
          step={step}
          loading={loading}
          otp={otp}
          setOtp={setOtp}
          otpErr={otpErr}
          verifyOtp={verifyOtp}
        />
        {/* Message on successful registration */}
        {step === 3 && (
          <p className="text-green-700 font-bold">
            Your Aadhaar has been successfully verified. You can continue Udyam Registration process.
          </p>
        )}
      </div>
    </section>
  );
}
