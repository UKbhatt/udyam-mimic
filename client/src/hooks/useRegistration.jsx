import { useState } from "react";
import { api } from "../lib/api";
import { toast } from "react-toastify";
import { AadhaarRe, OTPRe, PANRe, DOBRe } from "../utlis/validators";

export function useRegistration(defaultValues) {
  const [step, setStep] = useState(1); // State of level step
  const [loading, setLoading] = useState(false);

  // form state
  const [form, setForm] = useState({
    aadhaar: defaultValues?.aadhaar || "",
    name: defaultValues?.name || "",
    consent: true,
  });
  // Error state
  const [err, setErr] = useState("");

  // Otp state
  const [otp, setOtp] = useState(""); 
  const [otpErr, setOtpErr] = useState("");

  // State to store Pan Data
  const [orgType, setOrgType] = useState("");
  const [pan, setPan] = useState("");
  const [nameAsPerPan, setNameAsPerPan] = useState("");
  const [dobdoi, setDobdoi] = useState("");
  const [panConsent, setPanConsent] = useState(false);
  const [panErr, setPanErr] = useState("");

  // Validate Aadhaar
  const validAadhaar = AadhaarRe.test(form.aadhaar);
  const canSendOtp = validAadhaar && form.consent && !loading;

  const aadhaarLocked = step >= 2;
  const panLocked = step >= 4;

  function updateForm(key, val) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  // function to sendOtp
  async function sendOtp(e) { 
    e?.preventDefault?.();
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

  // Function of verifyOtp
  async function verifyOtp(e) {
    e?.preventDefault?.();
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

  // function to validate Pan data
  async function validatePan(e, onComplete) {
    e?.preventDefault?.();
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
        aadhaarConsent: form.consent,
        orgType,
        pan: upPan,
        nameAsPerPan,
        dobdoi,
        panConsent,
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

  // Reset All Data 
  function resetAll() {
    setStep(1);
    setForm({ aadhaar: "", name: "", consent: true });
    setOtp("");
    setPan("");
    setNameAsPerPan("");
    setDobdoi("");
    setOrgType("");
    setPanConsent(false);
    setErr("");
    setOtpErr("");
    setPanErr("");
  }

  // Returning the final states 
  return {
    step, loading,
    form, err,
    otp, otpErr,
    orgType, pan, nameAsPerPan, dobdoi, panConsent, panErr,
    canSendOtp, aadhaarLocked, panLocked,
    updateForm, setOtp, setOrgType, setPan, setNameAsPerPan, setDobdoi, setPanConsent,
    sendOtp, verifyOtp, validatePan, resetAll, setStep,
  };
}
