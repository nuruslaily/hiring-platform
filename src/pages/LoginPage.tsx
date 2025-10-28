import React, { useState } from "react";
import { Eye, EyeOff, Mail } from "lucide-react";
import logo from "../assets/logo.svg";
import usersData from "../data/json/mockUser.json";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { toast } from "react-toastify";

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Format email tidak valid")
    .required("Alamat email tidak boleh kosong"),
  password: Yup.string().required("Kata sandi tidak boleh kosong"),
});

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorEmail("");
    setErrorPassword("");

    try {
      await loginSchema.validate({ email, password }, { abortEarly: false });
      setIsSubmitting(true);

      setTimeout(() => {
        const user = usersData.users.find(
          (u: any) => u.email === email && u.password === password
        );

        if (!user) {
          setErrorEmail("Email salah");
          setErrorPassword("Password salah");
          setIsSubmitting(false);
          return;
        }

        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userName", user.name);
        localStorage.setItem("userRole", user.role);
        toast.success(`Login sukses sebagai ${user.role}!`);
        navigate("/jobs");
      }, 1000);
    } catch (err: any) {
      if (err.inner) {
        err.inner.forEach((error: any) => {
          if (error.path === "email") setErrorEmail(error.message);
          if (error.path === "password") setErrorPassword(error.message);
        });
      }
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-white font-['Nunito_Sans'] px-4 sm:px-6">
      <div className="flex flex-col w-full max-w-md sm:max-w-lg md:max-w-xl">
        <div className="mb-4 text-center sm:text-left">
          <img
            src={logo}
            alt="Raka min"
            className="mx-auto sm:mx-0 w-28 sm:w-36 md:w-40"
          />
        </div>

        <div className="bg-white shadow rounded-xl flex flex-col justify-center items-center p-6 sm:p-8 w-full">
          <div className="w-full">
            <h1 className="text-lg sm:text-xl font-semibold text-[#1D1F20]">
              Masuk ke Raka min
            </h1>
            <p className="text-sm sm:text-base text-[#1D1F20] mt-2">
              Belum punya akun?{" "}
              <a
                href="/register"
                className="text-[#01959F] font-medium hover:font-bold"
              >
                Daftar menggunakan email
              </a>
            </p>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
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

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-[#404040] mb-1"
                >
                  Kata sandi
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full border rounded-md text-[#404040] px-3 py-2 pr-10 focus:ring-2 focus:outline-none ${
                      errorPassword
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-[#01959F]"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-[#404040]" />
                    ) : (
                      <Eye className="h-5 w-5 text-[#404040]" />
                    )}
                  </button>
                </div>
                {errorPassword && (
                  <span className="text-red-500 text-sm mt-1 block">
                    {errorPassword}
                  </span>
                )}
                <div className="text-right mt-1">
                  <a
                    href="#"
                    className="text-sm text-[#01959F] hover:underline font-medium"
                  >
                    Lupa kata sandi?
                  </a>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-[#FFD466] text-gray-800 font-semibold py-2.5 rounded-md transition-all ${
                  isSubmitting
                    ? "opacity-70 cursor-not-allowed"
                    : "hover:bg-[#f6c94e] active:scale-[0.98]"
                }`}
              >
                {isSubmitting ? "Memproses..." : "Masuk"}
              </button>

              <div className="flex items-center my-3">
                <div className="flex-1 h-px bg-gray-300" />
                <span className="px-2 text-gray-500 text-sm">atau</span>
                <div className="flex-1 h-px bg-gray-300" />
              </div>

              <button
                type="button"
                onClick={() => navigate("/loginemail")}
                className="w-full border border-gray-300 py-2.5 rounded-md flex items-center justify-center gap-2 text-[#1D1F20] font-bold text-sm hover:bg-gray-50 transition"
              >
                <Mail className="h-4 w-4" />
                Kirim link login melalui email
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
    </div>
  );
};

export default LoginPage;
