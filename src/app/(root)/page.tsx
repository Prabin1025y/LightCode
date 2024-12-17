import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
} from "@clerk/nextjs";
import Image from "next/image";
import Header from "./_components/Header";

export default function Home() {
  return (
    <div>
      <Header />
    </div>
  );
}
