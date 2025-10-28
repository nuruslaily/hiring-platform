import React, { useEffect, useRef, useState } from "react";
import avatar from "../assets/avatar.png";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeftIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import {
  ArrowUpTrayIcon,
  CalendarDateRangeIcon,
} from "@heroicons/react/24/outline";
import type { Job } from "../types/job";
import { indonesiaCities } from "../data/region";
import { DayPicker } from "react-day-picker";
import { normalizeLinkedInUrl } from "../utils/normalizeLinkedInUrl";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import TakePictureModal from "../components/TakePictureModal";
import { countryCodes } from "../data/countryCodes";
import SuccessApplyState from "../components/state/SuccessApply";
import { CheckCircle } from "lucide-react";

const schema = yup.object({
  fullname: yup.string().required("Full name is required"),
  dateOfBirth: yup.date().required("Date of birth is required"),
  gender: yup.string().oneOf(["male", "female"]).required("Gender is required"),
  domicile: yup.string().required("Please select your domicile"),
  phone: yup
    .string()
    .matches(/^[0-9]+$/, "Only numbers allowed")
    .min(10, "At least 10 digits")
    .required("Phone number is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  linkedinLink: yup
    .string()
    .test("linkedin", "Invalid LinkedIn URL", (value) =>
      value ? !!normalizeLinkedInUrl(value) : false
    )
    .required("LinkedIn link is required"),
});

const ApplyPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const job = (location.state as { job: Job })?.job;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  const [photo, setPhoto] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [query, setQuery] = useState("");
  const [filteredCities, setFilteredCities] = useState<string[]>([]); // ✅ AWALNYA KOSONG
  const [selectedCountry, setSelectedCountry] = useState(countryCodes[0]);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showDomicileDropdown, setShowDomicileDropdown] = useState(false); // ✅ STATE BARU

  const domicileRef = useRef<HTMLDivElement>(null);

  // Tutup dropdown jika klik di luar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        domicileRef.current &&
        !domicileRef.current.contains(event.target as Node)
      ) {
        setShowDomicileDropdown(false); // ✅ tutup dropdown domicile
        setShowCountryDropdown(false); // tutup dropdown country
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleCalendar = () => setShowCalendar(!showCalendar);

  const handleSelect = (date?: Date) => {
    if (date) {
      setValue("dateOfBirth", date);
    }
    setShowCalendar(false);
  };

  const handleSearch = (q: string) => {
    setQuery(q);
    if (q.trim() === "") {
      setFilteredCities([]); // ✅ kosongkan jika query kosong
      setShowDomicileDropdown(false);
    } else {
      const filtered = indonesiaCities.filter((city) =>
        city.toLowerCase().includes(q.toLowerCase())
      );
      setFilteredCities(filtered);
      setShowDomicileDropdown(true); // ✅ tampilkan dropdown saat mengetik
    }
  };

  const handleDomicileInputClick = () => {
    if (query.trim() === "") {
      // ✅ Jika input kosong, tampilkan semua kota saat diklik
      setFilteredCities(indonesiaCities);
      setShowDomicileDropdown(true);
    } else {
      // ✅ Jika sudah ada query, tetap tampilkan hasil pencarian
      setShowDomicileDropdown(true);
    }
  };

  const handleSelectCity = (city: string) => {
    setValue("domicile", city);
    setQuery(city);
    setFilteredCities([]); // ✅ kosongkan filtered cities
    setShowDomicileDropdown(false); // ✅ tutup dropdown setelah pilih
  };

  const onSubmit = (data: any) => {
    const fullPhone = `${selectedCountry.dialCode}${data.phone}`;
    const finalData = {
      id: Date.now().toString(),
      jobId: job.id,
      name: data.fullname,
      email: data.email,
      phone: fullPhone,
      birthDate: data.dateOfBirth,
      domicile: data.domicile,
      gender: data.gender,
      linkedinLink: data.linkedinLink,
      profilePhoto: photo || "",
      appliedDate: new Date().toISOString(),
      status: "applied",
    };

    const existingCandidates = JSON.parse(
      localStorage.getItem("candidates") || "[]"
    );
    existingCandidates.push(finalData);

    localStorage.setItem("candidates", JSON.stringify(existingCandidates));

    setSuccess(true);

    setTimeout(() => navigate("/jobs"), 3000);
  };

  if (success) {
    return <SuccessApplyState />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 font-['Nunito_Sans'] overflow-y-auto">
      <div className="bg-white w-full max-w-4xl m-10 rounded-xl shadow-xl flex flex-col relative">
        {/* Header */}
        <div className="flex justify-between items-center p-6 text-[#1D1F20]">
          <div className="flex flex-row p-2">
            <ArrowLeftIcon
              className="w-10 h-10 border-[#E0E0E0] border-2 rounded-lg shadow cursor-pointer"
              onClick={() => navigate(-1)}
            />
            <h3 className="text-xl font-semibold text-[#1D1F20] p-2">
              Apply {job?.jobName || `Job ID: ${id}`} at Rakamin
            </h3>
          </div>
          <p>ℹ️ Required fields must be filled</p>
        </div>

        {/* Content */}
        <div className="px-8 pb-8">
          {/* Photo Profile */}
          <div className="flex flex-col items-start mt-4">
            <span className="text-red-500 text-sm font-bold">*Required</span>
            <p className="text-sm text-[#404040] font-semibold mb-2">
              Photo Profile
            </p>
            <img
              src={photo || avatar}
              alt="Profile"
              className={`w-32 h-32 object-cover border border-[#E0E0E0] ${
                photo ? "rounded-lg" : "rounded-full"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="mt-3 text-sm text-[#1D1F20] font-bold border-2 shadow border-[#E0E0E0] hover:bg-[#F0F0F0] rounded-md flex items-center gap-2 px-4 py-2 transition"
            >
              <ArrowUpTrayIcon className="w-5 h-5 font-bold text-[#1D1F20]" />
              Take a Picture
            </button>

            <TakePictureModal
              open={showModal}
              onClose={() => setShowModal(false)}
              onCapture={(capturedPhoto) => {
                setPhoto(capturedPhoto);
                setShowModal(false);
              }}
            />
          </div>

          {/* Form */}
          <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-[#404040] mb-1">
                Full name<span className="text-red-500">*</span>
              </label>
              <input
                {...register("fullname")}
                placeholder="Enter your full name"
                className="w-full bg-white focus:bg-white border-2 border-[#E0E0E0] 
             text-[#404040] rounded-md px-3 py-2 focus:ring-2 
             focus:ring-[#01959F] focus:outline-none"
              />
              {errors.fullname && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.fullname.message}
                </p>
              )}
            </div>

            {/* Date of Birth */}
            <div className="relative">
              <label className="block text-sm font-medium text-[#404040] mb-1">
                Date of birth<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <CalendarDateRangeIcon
                  onClick={toggleCalendar}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#01959F] cursor-pointer"
                />
                <input
                  readOnly
                  onClick={toggleCalendar}
                  value={
                    watch("dateOfBirth")
                      ? new Date(watch("dateOfBirth")).toLocaleDateString(
                          "id-ID"
                        )
                      : ""
                  }
                  placeholder="Select date of birth"
                  className="w-full pl-10 pr-3 bg-white border-2 text-[#404040] border-[#E0E0E0] focus:ring-2 focus:ring-[#01959F] focus:outline-none rounded-md py-2 cursor-pointer"
                />
              </div>
              {showCalendar && (
                <div className="absolute z-20 bg-white text-[#404040] border border-[#E0E0E0] rounded-lg shadow-lg mt-2">
                  <DayPicker
                    mode="single"
                    selected={watch("dateOfBirth")}
                    onSelect={handleSelect}
                    fromYear={1950}
                    toYear={2025}
                    captionLayout="dropdown"
                    navLayout="around"
                    className="bg-white text-[#404040]"
                  />
                </div>
              )}
              {errors.dateOfBirth && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.dateOfBirth.message}
                </p>
              )}
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-[#404040] mb-1">
                Pronoun (gender)<span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-6 mt-2">
                {[
                  { value: "female", label: "She/her (Female)" },
                  { value: "male", label: "He/him (Male)" },
                ].map((g) => (
                  <label
                    key={g.value}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      value={g.value}
                      {...register("gender")}
                      className="appearance-none w-5 h-5 border-2 border-[#404040] rounded-full checked:border-white checked:bg-[#01959F] checked:ring-2 checked:ring-[#404040] transition-all cursor-pointer"
                    />
                    <span className="text-[#404040] font-medium">
                      {g.label}
                    </span>
                  </label>
                ))}
              </div>
              {errors.gender && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.gender.message}
                </p>
              )}
            </div>

            {/* Domicile - FIXED */}
            <div className="relative" ref={domicileRef}>
              <label className="block text-sm font-medium text-[#404040] mb-1">
                Domicile<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => handleSearch(e.target.value)}
                  onClick={handleDomicileInputClick} // ✅ TAMPILKAN DROPDOWN SAAT DIKLIK
                  placeholder="Choose your domicile"
                  className="w-full border-2 border-[#E0E0E0] bg-white rounded-md pl-3 pr-10 py-2 
      focus:ring-2 focus:ring-[#01959F] text-[#404040] focus:outline-none cursor-pointer"
                />
                <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#01959F] pointer-events-none" />
              </div>

              {/* ✅ DROPDOWN HANYA TAMPIL JIKA showDomicileDropdown = true */}
              {showDomicileDropdown && filteredCities.length > 0 && (
                <ul className="absolute z-10 bg-white border-2 border-[#E0E0E0] rounded-lg mt-1 w-full max-h-60 overflow-y-auto shadow-lg">
                  {filteredCities.map((city) => (
                    <li key={city}>
                      <button
                        type="button"
                        onClick={() => handleSelectCity(city)}
                        className="w-full text-left px-4 py-2 hover:bg-[#E6F9FA] text-[#404040]"
                      >
                        {city}
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {/* ✅ TAMPILAN JIKA TIDAK ADA HASIL PENCARIAN */}
              {showDomicileDropdown &&
                filteredCities.length === 0 &&
                query.trim() !== "" && (
                  <ul className="absolute z-10 bg-white border-2 border-[#E0E0E0] rounded-lg mt-1 w-full max-h-60 overflow-y-auto shadow-lg">
                    <li className="px-4 py-2 text-gray-500 text-sm">
                      No cities found
                    </li>
                  </ul>
                )}

              {errors.domicile && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.domicile.message}
                </p>
              )}
            </div>

            {/* Phone */}
            <div className="relative">
              <label className="block text-sm font-medium text-[#404040] mb-1">
                Phone Number<span className="text-red-500">*</span>
              </label>
              <div className="flex flex-row items-center gap-2 w-full">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowCountryDropdown((prev) => !prev)}
                    className="flex items-center gap-2 border-2 border-[#E0E0E0] rounded-md px-2 py-2 hover:bg-[#F0F0F0]"
                  >
                    <img
                      src={selectedCountry.flag}
                      alt={selectedCountry.name}
                      className="w-5 h-3 rounded-sm"
                    />
                    <span className="text-[#404040] text-sm">
                      {selectedCountry.dialCode}
                    </span>
                    <ChevronDownIcon className="w-5 h-5 text-[#404040]" />
                  </button>

                  {showCountryDropdown && (
                    <ul className="absolute z-10 bg-white border-2 border-[#E0E0E0] rounded-lg mt-1 w-40 max-h-60 overflow-y-auto shadow-lg">
                      {countryCodes.map((c) => (
                        <li key={c.code}>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedCountry(c);
                              setShowCountryDropdown(false);
                            }}
                            className="w-full flex items-center gap-2 text-left px-3 py-2 hover:bg-[#E6F9FA]"
                          >
                            <img
                              src={c.flag}
                              alt={c.name}
                              className="w-5 h-3 rounded-sm"
                            />
                            <span className="text-[#404040] text-sm">
                              {c.dialCode}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <input
                  {...register("phone")}
                  placeholder="81234567890"
                  className="flex-1 border-2 border-[#E0E0E0] text-[#404040] rounded-md px-3 py-2 focus:ring-2 focus:ring-[#01959F] focus:outline-none"
                />
              </div>

              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[#404040] mb-1">
                Email<span className="text-red-500">*</span>
              </label>
              <input
                {...register("email")}
                placeholder="Enter your email address"
                className="w-full border-2 border-[#E0E0E0] text-[#404040] rounded-md px-3 py-2 focus:ring-2 focus:ring-[#01959F] focus:outline-none"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* LinkedIn */}
            <div>
              <label className="block text-sm font-medium text-[#404040] mb-1">
                LinkedIn Link<span className="text-red-500">*</span>
              </label>
              <input
                {...register("linkedinLink")}
                placeholder="http://linkedin.com/in/username"
                className="w-full border-2 border-[#E0E0E0] text-[#404040] rounded-md px-3 py-2 focus:bg-white focus:text-[#404040] focus:ring-2 focus:ring-[#01959F] focus:outline-none"
              />
              {errors.linkedinLink ? (
                <p className="text-red-500 text-xs mt-1">
                  {errors.linkedinLink.message}
                </p>
              ) : (
                watch("linkedinLink") &&
                /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-_]+\/?$/.test(
                  watch("linkedinLink")
                ) && (
                  <div className="flex items-center gap-1 text-[#01959F] text-xs mt-1">
                    <CheckCircle className="h-4 w-4" />
                    <span>URL address found</span>
                  </div>
                )
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-[#01959F] text-white font-semibold py-2.5 rounded-md hover:bg-[#f6c94e] transition"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplyPage;
