import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import emailCheck from "../../assets/illustrations/email-check.webp";

const EmailSend: React.FC = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUserEmail(parsed?.email || null);
    } else {
      navigate("/loginemail");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 font-['Nunito_Sans']">
      <main className="flex flex-col justify-center items-center text-center px-4">
        <div className="flex flex-col">
          <div className="w-[500px] bg-white gap-24 border shadow rounded-xl flex flex-col justify-center items-center p-5">
            <div className="px-8 pb-4 w-full">
              <img
                src={emailCheck}
                alt="Email sent"
                className="w-60 max-w-[250px] mx-auto mb-6"
              />
              <h2 className="text-2xl font-semibold mb-2 text-[#404040]">
                Periksa Email Anda
              </h2>
              {userEmail ? (
                <p className="text-gray-600">
                  Kami telah mengirimkan link login ke{" "}
                  <span className="font-medium text-[#01959F]">
                    {userEmail}
                  </span>{" "}
                  yang berlaku selama{" "}
                  <span className="font-semibold">30 menit</span>.
                </p>
              ) : (
                <p className="text-gray-500">
                  Mengarahkan kembali ke halaman login...
                </p>
              )}

              <button
                onClick={() => navigate("/loginemail")}
                className="mt-6 bg-[#FFD466] hover:bg-[#f6c94e] text-gray-800 font-semibold py-2 px-6 rounded-md transition"
              >
                Kembali ke Login
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmailSend;
