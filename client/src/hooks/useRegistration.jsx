import { useState } from "react";
import { api } from "../lib/api";
import { toast } from "react-toastify";
import { AadhaarRe, OTPRe, PANRe, DOBRe } from "../utlis/validators";

export function useRegistration(defaultValues) {
  const [step, setStep] = useState(1);
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

  const aadhaarLocked = step >= 2;
  const panLocked = step >= 4;

  function updateForm(key, val) {
    setForm((f) => ({ ...f, [key]: val }));
  }

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
