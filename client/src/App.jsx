import AadhaarCard from "./components/AadhaarCard";
import OtpCard from "./components/OtpCard";
import PanCard from "./components/PanCard";
import SubmissionCard from "./components/SubmissionCard";
import { useRegistration } from "./hooks/useRegistration";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/navbar";

export default function App() {
  const {
    step, loading,
    form, err,
    otp, otpErr,
    orgType, pan, nameAsPerPan, dobdoi, panConsent, panErr,
    canSendOtp, aadhaarLocked, panLocked,
    updateForm, setOtp, setOrgType, setPan, setNameAsPerPan, setDobdoi, setPanConsent,
    sendOtp, verifyOtp, validatePan, resetAll,
  } = useRegistration();

  return (
    <div>
      <Navbar />
    <div className="m-5 px-50 py-10">
      <AadhaarCard
        form={form}
        updateForm={updateForm}
        err={err}
        canSendOtp={canSendOtp}
        aadhaarLocked={aadhaarLocked}
        loading={loading}
        step={step}
        sendOtp={sendOtp}
      />

      <div className="px-6 py-6 space-y-5">
        <OtpCard
          step={step}
          loading={loading}
          otp={otp}
          setOtp={setOtp}
          otpErr={otpErr}
          verifyOtp={verifyOtp}
        />

        {step === 3 && (
          <p className="text-green-700 font-bold">
            Your Aadhaar has been successfully verified. You can continue Udyam Registration process.
          </p>
        )}
      </div>

      <PanCard
        visible={step >= 3}
        loading={loading}
        panLocked={panLocked}
        orgType={orgType}
        setOrgType={setOrgType}
        pan={pan}
        setPan={setPan}
        nameAsPerPan={nameAsPerPan}
        setNameAsPerPan={setNameAsPerPan}
        dobdoi={dobdoi}
        setDobdoi={setDobdoi}
        panConsent={panConsent}
        setPanConsent={setPanConsent}
        panErr={panErr}
        validatePan={(e) => validatePan(e)}
      />

      <SubmissionCard
        visible={step === 4}
        form={form}
        pan={pan}
        nameAsPerPan={nameAsPerPan}
        orgType={orgType}
        dobdoi={dobdoi}
        onRestart={() => resetAll()}
        />

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
        </div>
  );
}
