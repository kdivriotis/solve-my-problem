"use client";

const Footer = () => {
  const initialYear = 2024;
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full self-end px-4 py-4 flex justify-center items-center bg-transparent">
      <p className="text-textBackground dark:text-dark-textBackground text-xs md:text-sm">
        © Team SaaS-1, ECE NTUA {initialYear}
        {currentYear > initialYear ? ` - ${currentYear}` : ""}. All rights
        reserved
      </p>
    </footer>
  );
};

export default Footer;
