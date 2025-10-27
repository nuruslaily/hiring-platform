import React, { useState } from "react";
import { Eye, EyeOff, Mail } from "lucide-react";
import logo from "../assets/logo-rakamin.svg";
import usersData from "../data/mockUser.json";
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setErrorEmail("Alamat email tidak boleh kosong");
      return;
    }

    const user = usersData.users.find(
      (u: any) => u.email === email && u.password === password
    );

    if (!user) {
      setErrorEmail("Email salah");
      setErrorPassword("Password salah");
      return;
    }

    // Simpan info ke localStorage
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("userName", user.name);
    localStorage.setItem("userRole", user.role);

    alert(`Login sukses sebagai ${user.role}!`);

    // Arahkan sesuai role
    if (user.role === "admin") {
      navigate("/jobs");
    } else {
      navigate("/jobs");
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
            Masuk ke Rakamin
          </h1>
          <p className="text-start text-sm text-[#1D1F20] mt-2">
            Belum punya akun?{" "}
            <a href="/register" className="text-[#01959F] font-medium">
              Daftar menggunakan email
            </a>
          </p>

          {/* Form */}
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
                className={`w-full border rounded-md px-3 py-2 text-[#404040] focus:bg-white focus:text-[#404040] focus:ring-2 focus:ring-[#01959F] focus:outline-none ${
                  errorEmail
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300"
                }`}
              />
              {/* Error Message */}
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
                  required
                  className="w-full border border-gray-300 rounded-md text-[#404040] focus:text-[#404040] px-3 py-2 pr-10 focus:ring-2 focus:ring-[#01959F] focus:outline-none"
                />
                {/* Error Message */}
                {errorPassword && (
                  <span className="text-red-500 text-sm mt-1 block">
                    {errorPassword}
                  </span>
                )}
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
              <div className="text-right mt-1">
                <a
                  href="#"
                  className="text-sm text-[#01959F] hover:underline font-medium"
                >
                  Lupa kata sandi?
                </a>
              </div>
            </div>

            {/* Tombol masuk */}
            <button
              type="submit"
              className="w-full bg-[#FFD466] text-gray-800 font-semibold py-2.5 rounded-md hover:bg-[#f6c94e] transition"
            >
              Masuk
            </button>

            {/* Divider */}
            <div className="flex items-center my-3">
              <div className="flex-1 h-px bg-gray-300" />
              <span className="px-2 text-gray-500 text-sm">or</span>
              <div className="flex-1 h-px bg-gray-300" />
            </div>

            {/* Login opsi tambahan */}
            <button
              type="button"
              className="w-full border border-gray-300 py-2.5 rounded-md flex items-center justify-center gap-2 text-[#1D1F20] font-semibold text-md hover:bg-gray-50 transition"
            >
              <Mail className="h-4 w-4" />
              Kirim link login melalui email
            </button>

            <button
              type="button"
              className="w-full border border-gray-300 py-2.5 rounded-md flex items-center justify-center gap-2 text-[#1D1F20] font-semibold text-md hover:bg-gray-50 transition"
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

export default LoginPage;
