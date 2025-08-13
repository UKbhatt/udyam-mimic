import { useState } from "react";
import logo from "../assets/logo.png";

export default function Navbar() {
    const [open, setOpen] = useState(false);

    const menuItems = [
        "NIC Code",
        "Useful Documents",
        "Print / Verify",
        "Update Details",
        "Login",
    ];

    return (
        <div>
            <nav className="bg-[#4634b8] text-white h-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3">
                    <div className="flex h-14 items-center justify-between">
                        <a href="/" className="flex items-center gap-3">
                            <img src={logo} alt="Logo" className="h-10 w-10" />

                            <div className="leading-tight  xs:block">
                                <p className="text-xl gap-0.5">सूक्ष्म, लघु और मध्यम उद्यम मंत्रालय</p>
                                <p className="text-0.5xl opacity-90 ">
                                    Ministry of Micro, Small & Medium Enterprises
                                </p>
                            </div>
                        </a>

                        <ul className="hidden md:flex items-center gap-10 font-bold">
                            <li className="relative group cursor-pointer opacity-100 text-white hover:opacity-100 
                            hover:text-white">
                                <span className="text-[15px]">HOME</span>
                                <span
                                    className="pointer-events-none absolute left-0 -bottom-1 h-[2px] w-full bg-white
                                                transition-all duration-300 ease-out
                                                group-hover:w-full group-hover:left-0"
                                />
                            </li>
                            {menuItems.map((item) => (
                                <li
                                    key={item}
                                    className="relative group cursor-pointer select-none opacity-50 hover:opacity-100 
                                    hover:text-white"
                                >
                                    <span className="text-[15px]">{item}</span>
                                    <span
                                        className="
                                            pointer-events-none absolute left-1 -bottom-1 h-[2px] w-0 bg-white
                                            transition-all duration-300 ease-out
                                            group-hover:w-full group-hover:left-0"
                                    />
                                </li>
                            ))}
                        </ul>

                        <button
                            className="md:hidden inline-flex items-center justify-center rounded-md p-2 hover:bg-white/10 
                            focus:outline-none"
                            aria-expanded={open}
                            aria-label="Toggle menu"
                            onClick={() => setOpen((v) => !v)}
                        >
                            {open ? (
                                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
                                    <path d="M6 6l12 12M18 6L6 18" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            ) : (
                                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
                                    <path d="M4 7h16M4 12h16M4 17h16" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            )}
                        </button>
                    </div>

                    <div
                        className={`
                        md:hidden overflow-hidden transition-[max-height] duration-300
                        ${open ? "max-h-96" : "max-h-0"}
                        `}
                    >
                        <ul className="py-2">
                            {menuItems.map((item) => (
                                <li key={item} className="group">
                                    <a
                                        href="#"
                                        className="block px-2 py-2 text-[15px] hover:bg-white/10 rounded-md"
                                        onClick={() => setOpen(false)}
                                    >
                                        <span className="relative inline-block">
                                            {item}
                                            <span className="absolute left-0-bottom-0.5 h-[2px] w-0 bg-white
                                                            transition-all duration-300 ease-out
                                                            group-hover:w-full"/>
                                        </span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </nav>
            <div className="bg-[#f5f6fa] py-6">
                <h1 className="text-center text-2xl font-semibold  text-[#3F3FAD]">
                    UDYAM REGISTRATION FORM - For New Enterprise who are not Registered yet as MSME
                </h1>
            </div>

        </div>
    );
}
