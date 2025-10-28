import successApply from "../../assets/illustrations/success-apply.webp";

const SuccessApplyState = () => {
  return (
    <div className="font-sans min-h-screen bg-gray-50 mt-30">
      <main className="flex-1 flex flex-col justify-center items-center text-center px-2">
        <div className="flex flex-col justify-center items-center text-center">
          <img
            src={successApply}
            alt="Success Apply!"
            className="w-60 max-w-[250px] mx-auto mb-6"
          />
          <h2 className="text-2xl font-semibold mb-2 text-[#404040]">
            🎉 Your application was sent!
          </h2>
          <p className="text-sm mb-6 text-[#404040]">
            Congratulations! You've taken the first step towards a rewarding
            career at Rakamin. We look forward to learning more about you during
            the application process.
          </p>
        </div>
      </main>
    </div>
  );
};

export default SuccessApplyState;
