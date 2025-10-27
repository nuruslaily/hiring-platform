import React, { useState } from "react";
import logo from "../assets/logo-rakamin.svg";

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Alamat email tidak boleh kosong");
    } else {
      setError("");
      console.log("Form submitted:", email);
      // lanjut proses register
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 font-['Nunito_Sans']">
      <div className="w-[500px] bg-white shadow-lg rounded-xl">
        {/* Logo */}
        <div className="flex justify-start">
          <img src={logo} alt="Rakamin" className="w-40" />
        </div>

        <div className="px-8 pb-8">
          {/* Header */}
          <h1 className="text-xl font-semibold text-[#1D1F20] text-start">
            Bergabung dengan Rakamin
          </h1>
          <p className="text-start text-sm text-[#1D1F20] mt-2">
            Sudah punya akun?{" "}
            <a href="/login" className="text-[#01959F] font-medium">
              Masuk
            </a>
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#404040] mb-1"
              >
                Alamat email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-[#01959F] focus:outline-none ${
                  error ? "border-red-500" : "border-gray-300"
                }`}
              />
              {error && (
                <span className="text-red-500 text-sm mt-1 block">{error}</span>
              )}
            </div>

            {/* Tombol daftar */}
            <button
              type="submit"
              className="w-full bg-[#FFD466] text-gray-800 font-semibold py-2.5 rounded-md hover:bg-[#f6c94e] transition"
            >
              Daftar dengan email
            </button>

            {/* Divider */}
            <div className="flex items-center my-3">
              <div className="flex-1 h-px bg-gray-300" />
              <span className="px-2 text-gray-500 text-sm">or</span>
              <div className="flex-1 h-px bg-gray-300" />
            </div>

            {/* Tombol Google */}
            <button
              type="button"
              className="w-full border border-gray-300 py-2.5 rounded-md flex items-center justify-center gap-2 text-[#1D1F20] font-semibold text-md hover:bg-gray-50 transition"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="h-5 w-5"
              />
              Daftar dengan Google
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
