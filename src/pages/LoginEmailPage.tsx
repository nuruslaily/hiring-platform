import React, { useState } from "react";
import logo from "../assets/logo-rakamin.svg";
import usersData from "../data/mockUser.json";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { KeyIcon } from "@heroicons/react/24/outline";

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Format email tidak valid")
    .required("Alamat email tidak boleh kosong"),
});

const LoginEmailPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorEmail("");

    try {
      await loginSchema.validate({ email }, { abortEarly: false });

      const user = usersData.users.find((u: any) => u.email === email);

      if (!user) {
        setErrorEmail("Email tidak terdaftar");
        return;
      }

      setIsSubmitting(true);

      setTimeout(() => {
        localStorage.setItem(
          "user",
          JSON.stringify({
            isAuthenticatedTesting: true,
            name: user.name,
            role: user.role,
            email: user.email,
            method: "email-only",
          })
        );

        navigate("/notification");
      }, 800);
    } catch (err: any) {
      if (err.inner) {
        err.inner.forEach((validationErr: any) => {
          if (validationErr.path === "email")
            setErrorEmail(validationErr.message);
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-white font-['Nunito_Sans'] px-4">
      <div className="flex flex-col w-full max-w-md sm:max-w-lg md:max-w-xl">
        {/* Logo */}
        <div className="mb-6">
          <img src={logo} alt="Rakamin" className="w-32 sm:w-40 md:w-48" />
        </div>

        {/* Card */}
        <div className="bg-white border shadow rounded-xl p-6 sm:p-8">
          <h1 className="text-xl md:text-2xl font-semibold text-[#1D1F20] text-start">
            Masuk ke Rakamin
          </h1>
          <p className="text-start text-sm text-[#1D1F20] mt-2">
            Belum punya akun?{" "}
            <a
              href="/register"
              className="text-[#01959F] font-medium hover:font-bold"
            >
              Daftar menggunakan email
            </a>
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {/* Email Input */}
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
                className={`w-full border rounded-md px-3 py-2 text-[#404040] focus:bg-white focus:ring-2 focus:outline-none ${
                  errorEmail
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-[#01959F]"
                }`}
              />
              {errorEmail && (
                <span className="text-red-500 text-sm mt-1 block">
                  {errorEmail}
                </span>
              )}
            </div>

            {/* Button kirim link */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-[#FFD466] text-gray-800 font-semibold py-2.5 rounded-md transition-all ${
                isSubmitting
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:bg-[#f6c94e] active:scale-[0.98]"
              }`}
            >
              {isSubmitting ? "Mengirim link..." : "Kirim link"}
            </button>

            {/* Divider */}
            <div className="flex items-center my-3">
              <div className="flex-1 h-px bg-gray-300" />
              <span className="px-2 text-gray-500 text-sm">or</span>
              <div className="flex-1 h-px bg-gray-300" />
            </div>

            {/* Opsi login lain */}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="w-full border border-gray-300 py-2.5 rounded-md flex items-center justify-center gap-2 text-[#1D1F20] font-bold text-sm hover:bg-gray-50 transition"
            >
              <KeyIcon className="h-4 w-4" />
              Masuk dengan kata sandi
            </button>

            <button
              type="button"
              className="w-full border border-gray-300 py-2.5 rounded-md flex items-center justify-center gap-2 text-[#1D1F20] font-bold text-sm hover:bg-gray-50 transition"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="h-5 w-5"
              />
              Masuk dengan Google
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginEmailPage;
