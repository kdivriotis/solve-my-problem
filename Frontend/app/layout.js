import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Solve My Problem",
  description: "All the tools you need for problem solving",
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} min-h-screen bg-background dark:bg-dark-background`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
};

export default RootLayout;
