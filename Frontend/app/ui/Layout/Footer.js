"use client";

const Footer = () => {
  const initialYear = 2024;
  const currentYear = new Date().getFullYear();

  return (
    <footer className="flex self-end w-full justify-center px-4 py-2 items-center bg-transparent">
      <p className="text-textSurface dark:text-dark-textSurface text-xs md:text-sm text-center">
        © Team SaaS-1 {initialYear}
        {currentYear > initialYear ? ` - ${currentYear}` : ""}
        <br />
        All rights reserved
      </p>
    </footer>
  );
};

export default Footer;
