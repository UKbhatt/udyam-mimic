import AadhaarCard from "./components/AadhaarCard";
import PanCard from "./components/PanCard";
import SubmissionCard from "./components/SubmissionCard";
import { useRegistration } from "./hooks/useRegistration";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/navbar";
import { motion, AnimatePresence } from "framer-motion";
import { PiPersonArmsSpreadFill } from "react-icons/pi";
import { useState } from "react";

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
  const [hovered, setHovered] = useState(false);


  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />
      <Navbar />
      <div className="m-5 lg:px-40 lg:py-10">
        <AadhaarCard
          form={form}
          updateForm={updateForm}
          err={err}
          canSendOtp={canSendOtp}
          aadhaarLocked={aadhaarLocked}
          loading={loading}
          step={step}
          setOtp={setOtp}
          verifyOtp={verifyOtp}
          otp={otp}
          otpErr={otpErr}
          sendOtp={sendOtp}
        />

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

      </div>
      <motion.button
        type="button"
        aria-label="Accessibility Options"
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        initial={false}
        animate={{ width: hovered ? 208 : 64 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="
        fixed bottom-6 right-6 z-50
        bg-[#512fc2] text-white
        rounded-full shadow-lg h-16 flex items-center overflow-hidden
        focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60">
        <motion.span
          layout
          className={`flex items-center justify-center h-full ${hovered ? "w-auto pl-4" : "w-full"}`}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        >
          <PiPersonArmsSpreadFill className="h-8 w-8" />
        </motion.span>

        <AnimatePresence initial={false}>
          {hovered && (
            <motion.span
              key="label"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.2 }}
              className="whitespace-nowrap ml-1 pr-10"
            >
              Accessibility Options
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
