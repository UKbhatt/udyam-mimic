import { toast } from "react-toastify";
export default function PanCard({
  visible, loading, panLocked,
  orgType, setOrgType,
  pan, setPan,
  nameAsPerPan, setNameAsPerPan,
  dobdoi, setDobdoi,
  panConsent, setPanConsent,
  panErr, validatePan,
}) {
  if (!visible)
    return null;

  return (
    <div className="py-5">
      <section className="bg-white rounded-sm border border-gray-200">
        <div className="rounded-t-lg bg-[#1a9b3a] px-4 py-2 text-white font-semibold border-b">
          PAN Verification
        </div>
        {/* Pan Card form */}
        <form onSubmit={validatePan} className="px-6 py-6 space-y-4 shadow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">3. Type of Organisation / संगठन के प्रकार</label>
              <select
                className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${panLocked ? "bg-gray-100 cursor-not-allowed border-gray-200" : "bg-white border-gray-300"
                  }`}
                value={orgType}
                disabled={panLocked}
                onChange={(e) => setOrgType(e.target.value)}
              >
                {/* fields */}
                <option value="">Type of Organisation / संगठन के प्रकार</option>
                <option value="Proprietorship">1. Proprietary / एकल स्वामित्व</option>
                <option value="HUF">2. Hindu Undivided Family / HUF</option>
                <option value="Partnership">3. Partnership / पार्टनरशिप</option>
                <option value="Co-Operative">4. Co-Operative / सहकारी</option>
                <option value="Pvt Ltd">5. Private Limited Company</option>
                <option value="Public Ltd">6. Public Limited Company</option>
                <option value="SHG">7. Self Help Group</option>
                <option value="LLP">8. Limited Liability Partnership</option>
                <option value="Society">9. Society</option>
                <option value="Trust">10. Trust</option>
                <option value="Other">11. Others / अन्य</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">4.1 PAN / पैन</label>
              <input
                type="text"
                readOnly={panLocked}
                placeholder="ENTER PAN NUMBER"
                className={`w-full rounded-md border px-3 py-2 uppercase focus:outline-none focus:ring-2 focus:ring-blue-500 ${panLocked ? "bg-gray-100 cursor-not-allowed border-gray-200" : "bg-white border-gray-300"
                  }`}
                value={pan}
                onChange={(e) => setPan(e.target.value)}
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">4.1.1 Name of PAN Holder / पैन धारक का नाम</label>
              <input
                type="text"
                readOnly={panLocked}
                placeholder="Name as per PAN"
                className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${panLocked ? "bg-gray-100 cursor-not-allowed border-gray-200" : "bg-white border-gray-300"
                  }`}
                value={nameAsPerPan}
                onChange={(e) => setNameAsPerPan(e.target.value)}
              />
            </div>

            <div>
              {/* DOB - input */}
              <label className="block font-semibold mb-1">4.1.2 DOB or DOI as per PAN / पैन के अनुसार…</label>
              <input
                type="text"
                readOnly={panLocked}
                placeholder="DD/MM/YYYY"
                className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${panLocked ? "bg-gray-100 cursor-not-allowed border-gray-200" : "bg-white border-gray-300"
                  }`}
                value={dobdoi}
                onChange={(e) => setDobdoi(e.target.value)}
              />
            </div>
          </div>
          <label className="flex items-start gap-2 text-[15px] text-gray-900">
            {/* term and condition acceptance checkbox */}
            <input
              disabled={panLocked}
              type="checkbox"
              className="mt-[3px] h-4 w-4"
              checked={panConsent}
              onChange={(e) => setPanConsent(e.target.checked)}
            />
            <span>
              I, the holder of the above PAN, hereby give my consent to Ministry of MSME, Government of India, for
              using my data/ information available in the Income Tax Returns filed by me, and also the same available in the GST
              Returns and also from other Government organizations, for MSME classification and
              other official purposes, in pursuance of the MSMED Act, 2006.
            </span>
          </label>
          {panErr && toast.error(panErr)}
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Validating..." : "PAN Validate"}
          </button>
        </form>
      </section>
    </div>
  );
}
