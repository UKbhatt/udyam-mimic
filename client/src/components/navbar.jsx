import { useState, useEffect } from "react";
import logo from "../assets/logo.png";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const menuItems = [
    "NIC Code",
    "Useful Documents",
    "Print / Verify",
    "Update Details",
    "Login",
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#4634b8] text-white">
      <nav className=" mx-auto max-w-7xl px-4 sm:px-6 py-3" aria-label="Primary">
        <div className="sticky flex items-center justify-between gap-3">
          <a href="/" className="flex items-center gap-3 min-w-0" aria-label="UDYAM Home">
            <img
              src={logo}
              alt="UDYAM Logo"
              className="h-9 w-9 sm:h-10 sm:w-10 shrink-0"
            />
            <div className="leading-tight sm:block">
              <p className="text-xs sm:text-sm">
                सूक्ष्म, लघु और मध्यम उद्यम मंत्रालय
              </p>
              <p className="text-[11px] sm:text-xs/5 opacity-90">
                Ministry of Micro, Small &amp; Medium Enterprises
              </p>
            </div>
          </a>

          <ul className="hidden md:flex items-center gap-8 font-semibold">
            <li className="relative group cursor-pointer text-white">
              <span className="text-[15px]">HOME</span>
              <span
                className="pointer-events-none absolute left-0 -bottom-1 h-[2px] w-full 
                bg-white scale-x-100 origin-left transition-transform duration-300 ease-out group-hover:scale-x-100"
                aria-hidden
              />
            </li>
            {menuItems.map((item) => (
              <li
                key={item}
                className="relative group cursor-pointer select-none opacity-80 hover:opacity-100"
              >
                <a href="#" className="text-[15px] inline-block focus:outline-none focus-visible:ring-2 
                focus-visible:ring-white/60 rounded">
                  {item}
                </a>
                <span
                  className="pointer-events-none absolute left-0 -bottom-1 h-[2px] w-0 bg-white 
                  transition-all duration-300 ease-out group-hover:w-full"
                  aria-hidden
                />
              </li>
            ))}
          </ul>

          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center rounded-md p-2 
            hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? (
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M6 6l12 12M18 6L6 18" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
            ) : (
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M4 7h16M4 12h16M4 17h16" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>

        <div
          id="mobile-menu"
          className={`md:hidden overflow-hidden transition-[max-height] duration-300 ${open ? "max-h-96" : "max-h-0"}`}
          aria-hidden={!open}
        >
          <ul className="py-2">
            <li className="group">
              <a
                href="#"
                className="block px-2 py-2 text-[15px] rounded-md bg-white/10"
                onClick={() => setOpen(false)}
              >
                <span className="relative inline-block">
                  HOME
                  <span className="block h-[2px] w-full bg-white mt-1" aria-hidden />
                </span>
              </a>
            </li>

            {menuItems.map((item) => (
              <li key={item} className="group">
                <a
                  href="#"
                  className="block px-2 py-2 text-[15px] rounded-md hover:bg-white/10 focus:outline-none 
                  focus-visible:ring-2 focus-visible:ring-white/60"
                  onClick={() => setOpen(false)}
                >
                  <span className="relative inline-block">
                    {item}
                    <span
                      className="absolute left-0 -bottom-0.5 h-[2px] w-0 bg-white transition-all 
                      duration-300 ease-out group-hover:w-full"
                      aria-hidden
                    />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      <div className="bg-[#f5f6fa] py-4 sm:py-6">
        <h1 className="mx-auto max-w-7xl px-4 sm:px-6 text-center text-base sm:text-xl md:text-2xl 
        font-normal text-[#3F3FAD]">
          UDYAM REGISTRATION FORM - For New Enterprise who are not Registered yet as MSME
        </h1>
      </div>
    </header>
  );
}
