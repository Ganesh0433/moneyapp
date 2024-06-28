import Image from "next/image";
import { Inter } from "next/font/google";
import SignUp from "./signup";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <SignUp/>
  );
}
