import { useState } from "react";
import { api } from "../lib/api";
import { toast } from "react-toastify";

const AadhaarRe = /^[0-9]{12}$/;
const OTPRe = /^[0-9]{6}$/;
const PANRe = /^[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}$/;
const DOBRe = /^(0?[1-9]|[12][0-9]|3[01])\/(0?[1-9]|1[0-2])\/\d{4}$/;

export default function AadhaarStep({ defaultValues, onComplete }) {
  const [step, setStep] = useState(1);
  const [still, setstill] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    aadhaar: defaultValues?.aadhaar || "",
    name: defaultValues?.name || "",
    consent: true,
  });
  const [err, setErr] = useState("");

  const [otp, setOtp] = useState("");
  const [otpErr, setOtpErr] = useState("");

  const [orgType, setOrgType] = useState("");
  const [pan, setPan] = useState("");
  const [nameAsPerPan, setNameAsPerPan] = useState("");
  const [dobdoi, setDobdoi] = useState("");
  const [panConsent, setPanConsent] = useState(false);
  const [panErr, setPanErr] = useState("");

  const validAadhaar = AadhaarRe.test(form.aadhaar);
  const canSendOtp = validAadhaar && form.consent && !loading;

  function update(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function sendOtp(e) {
    e.preventDefault();
    if (!validAadhaar) return setErr("Enter a valid 12-digit Aadhaar");
    if (!form.consent) return setErr("Please accept the consent");

    setErr("");
    setLoading(true);
    try {
      await api.post("/api/otp/send", { aadhaar: form.aadhaar });
      toast.success("OTP sent (demo: 123456)");
      setStep(2);
    } catch {
      setErr("Failed to send OTP. Try again.");
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp(e) {
    e.preventDefault();
    if (!OTPRe.test(otp)) {
      setOtpErr("Enter a valid 6-digit OTP");
      return;
    }
    setOtpErr("");
    setLoading(true);
    try {
      await api.post("/api/otp/verify", { aadhaar: form.aadhaar, otp });
      toast.success("OTP verified");
      setStep(3);
    } catch {
      setOtpErr("Wrong OTP");
    } finally {
      setLoading(false);
    }
  }

  async function validatePan(e) {
    e.preventDefault();
    const upPan = pan.toUpperCase();

    if (!orgType) return setPanErr("Please select Type of Organisation");
    if (!PANRe.test(upPan)) return setPanErr("Invalid PAN format (e.g., ABCDE1234F)");
    if (nameAsPerPan.trim().length === 0) return setPanErr("Enter name as per PAN");
    if (!DOBRe.test(dobdoi)) return setPanErr("Enter DOB/DOI in DD/MM/YYYY");
    if (!panConsent) return setPanErr("Please accept the PAN consent");

    setPanErr("");
    setLoading(true);
    try {
      const payload = {
        aadhaar: form.aadhaar,
        nameAsAadhaar: form.name || undefined,
        pan: upPan,
        nameAsPerPan,
        orgType,
        dobdoi,
      };
      const res = await api.post("/api/submit", payload);
      toast.success("PAN validated & submission stored");
      onComplete?.(res.data);
    } catch {
      setPanErr("Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }


  async function submitAll(e) {
    e.preventDefault();
    const upPan = pan.toUpperCase();
    if (!PANRe.test(upPan)) {
      setPanErr("Invalid PAN format (e.g., ABCDE1234F)");
      return;
    }
    setPanErr("");
    setLoading(true);
    try {
      const payload = {
        aadhaar: form.aadhaar,
        nameAsAadhaar: form.name || undefined,
        pan: upPan,
        nameAsPerPan: nameAsPerPan || undefined,
      };
      const res = await api.post("/api/submit", payload);
      toast.success("Submission stored");
      setStep(4);
      onComplete?.(res.data);
    } catch {
      setPanErr("Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="m-5 px-50 py-20">
      <section className="bg-white rounded-lg border border-gray-200 ">
        <div className="rounded-t-lg bg-[#0b63ea] px-4 py-2 text-white font-semibold border-b ">
          Aadhaar Verification With OTP
        </div>
        <div className="px-6 py-6 space-y-5">
          {(
            <form onSubmit={sendOtp} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1">
                    1. Aadhaar Number/ आधार संख्या
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={12}
                    placeholder="Your Aadhaar No"
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 focus:outline-none 
                    focus:ring-2 focus:ring-blue-500"
                    value={form.aadhaar}
                    onChange={(e) =>
                      update("aadhaar", e.target.value.replace(/\D/g, ""))
                    }
                  />
                  {!validAadhaar && form.aadhaar.length > 0 && (
                    <p className="mt-1 text-sm text-red-600">
                      Enter a valid 12-digit Aadhaar
                    </p>
                  )}
                </div>

                <div>
                  <label className="block font-semibold mb-1">
                    2. Name of Entrepreneur / उद्यमी का नाम
                  </label>
                  <input
                    type="text"
                    placeholder="Name as per Aadhaar"
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                  />
                </div>
              </div>

              <ul className="list-disc pl-6 space-y-1 text-[15px] text-gray-800">
                <li>Aadhaar number shall be required for Udyam Registration.</li>
                <li>
                  The Aadhaar number shall be of the proprietor in the case of a proprietorship firm, of the managing partner in the
                  case of a partnership firm and of a karta in the case of a Hindu Undivided Family (HUF).
                </li>
                <li>
                  In case of a Company or a Limited Liability Partnership or a Cooperative Society or a Society or a Trust,
                  the organisation or its authorised signatory shall provide
                  its GSTIN(As per applicablity of CGST Act 2017 and as notified by the ministry of MSME.{" "}
                  <a
                    className="text-blue-600 underline"
                    href="https://udyamregistration.gov.in/UdyamRegistration.aspx"
                    target="_blank"
                    rel="noreferrer"
                  >
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
                  onChange={(e) => update("consent", e.target.checked)}
                />
                <span>
                  I, the holder of the above Aadhaar, hereby give my consent to Ministry of MSME,
                  Government of India, for using my Aadhaar number as alloted by UIDAI for Udyam Registration. NIC / Ministry of MSME, Government of India, have informed me that my aadhaar data will not be stored/shared. / मैं, आधार धारक, इस प्रकार उद्यम पंजीकरण के लिए यूआईडीएआई के साथ अपने आधार संख्या का उपयोग करने के लिए सू0ल0म0उ0 मंत्रालय, भारत सरकार को अपनी सहमति देता हूं। एनआईसी /
                  सू0ल0म0उ0 मंत्रालय, भारत सरकार ने मुझे सूचित किया है कि मेरा आधार डेटा संग्रहीत / साझा नहीं किया जाएगा।
                </span>
              </label>

              {err && <p className="text-sm text-red-600">{err}</p>}

              {step == 1 && (<button
                type="submit"
                disabled={!canSendOtp}
                onClick={() => { setstill(!still) }}
                className={`inline-flex items-center rounded-md px-4 py-2 text-white ${canSendOtp
                  ? "bg-[#1F6AE5] hover:bg-[#1858bd]"
                  : "bg-[#1F6AE5]/60 cursor-not-allowed"
                  }`}
              >
                {loading ? "Sending OTP..." : "Validate & Generate OTP"}
              </button>)}
            </form>
          )}

          {step === 2 && (
            <form onSubmit={verifyOtp} className="space-y-4">

              <div >
                <div className="flex flex-wrap flex-row">

                  <p className="text-red-600">*</p>
                  <label className="block font-semibold mb-1">Enter One Time Password(OTP) Code</label>
                </div>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="OTP code"
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                />
                {otpErr && (
                  <p className="mt-1 text-sm text-red-600">{otpErr}</p>
                )}
                <p className="text-sm">
                  OTP Error Code:- 8899 - Somthing unexpected Happened
                </p>
              </div>


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
          )}
          {
            step == 3 && (
              <p className="text-green-700 font-bold">
                Your Aadhaar has been successfully verified. You can continue Udyam Registration process.
              </p>
            )
          }
        </div>
      </section>
      {step === 3 && (
        <div className="py-5">
          <section className="bg-white rounded-sm border border-gray-200 h-10">
            <div className="rounded-t-lg bg-[#1a9b3a] px-4 py-2 text-white font-semibold border-b">
              PAN Verification
            </div>
            <form onSubmit={validatePan} className="px-6 py-6 space-y-4 shadow">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
                <div>
                  <label className="block font-semibold mb-1">
                    3. Type of Organisation / संगठन के प्रकार
                  </label>
                  <select
                    className="w-full rounded-md border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={orgType}
                    onChange={(e) => setOrgType(e.target.value)}
                  >
                    <option value="Proprietorship"> Type of Organisation / संगठन के प्रकार</option>
                    <option value="Proprietorship">1.Proprietary / एकल स्वामित्व</option>
                    <option value="Proprietorship">2.Hindu Undivided Family / हिंदू अविभाजित परिवार (एचयूएफ)</option>
                    <option value="Partnership">3.Partnership / पार्टनरशिप</option>
                    <option value="Partnership">4.Co-Operative / सहकारी</option>
                    <option value="Partnership">5.Private Limited Company / प्राइवेट लिमिटेड कंपनी</option>
                    <option value="Partnership">6.Public Limited Company / पब्लिक लिमिटेड कंपनी</option>
                    <option value="Partnership">7.Self Help Group / स्वयं सहायता समूह</option>
                    <option value="LLP">8.Limited Liability Partnership / सीमित दायित्व भागीदारी</option>
                    <option value="Company">9.Society / सोसाइटी</option>
                    <option value="HUF">10.Trust / ट्रस्ट</option>
                    <option value="Society/Trust/Other">11.Others / अन्य </option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">4.1 PAN / पैन</label>
                  <input
                    type="text"
                    placeholder="ENTER PAN NUMBER"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={pan}
                    onChange={(e) => setPan(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">
                    4.1.1 Name of PAN Holder / पैन धारक का नाम
                  </label>
                  <input
                    type="text"
                    placeholder="Name as per PAN"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={nameAsPerPan}
                    onChange={(e) => setNameAsPerPan(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">
                    4.1.2 DOB or DOI as per PAN / पैन के अनुसार…
                  </label>
                  <input
                    type="text"
                    placeholder="DD/MM/YYYY"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={dobdoi}
                    onChange={(e) => setDobdoi(e.target.value)}
                  />
                </div>
              </div>
              <label className="flex items-start gap-2 text-[15px] text-gray-900">
                <input
                  type="checkbox"
                  className="mt-[3px] h-4 w-4"
                  checked={panConsent}
                  onChange={(e) => setPanConsent(e.target.checked)}
                />
                <span>
                  I, the holder of the above PAN, hereby give my consent to Ministry of MSME, Government of India, for using
                  my data/ information available in the Income Tax Returns filed by me, and also the same available in the GST Returns
                  and also from other Government organizations,
                  for MSME classification and other official purposes,
                  in pursuance of the MSMED Act, 2006.
                </span>
              </label>

              {panErr && <p className="text-sm text-red-600">{panErr}</p>}

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 
                disabled:opacity-60"
              >
                {loading ? "Validating..." : "Validate"}
              </button>
            </form>
          </section>
        </div>

      )}
      {step === 4 && (
        <div className="rounded-md border p-6 text-center">
          <p className="mt-2 text-gray-700">
            Your details have been saved to the database.
          </p>
          <button
            className="mt-4 rounded-md border px-4 py-2"
            onClick={() => {
              setStep(1);
              setForm({ aadhaar: "", name: "", consent: true });
              setOtp("");
              setPan("");
              setNameAsPerPan("");
              setErr("");
              setOtpErr("");
              setPanErr("");
              toast.success("Thank You");
            }}
          >
            Start over
          </button>
        </div>
      )}

    </div>
  );
}
