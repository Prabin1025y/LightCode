import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
} from "@clerk/nextjs";
import Image from "next/image";
import Header from "./_components/Header";
import EditorSection from "./_components/EditorSection";
import OutputSection from "./_components/OutputSection";

export default function Home() {
  return (
    <div>
      <Header />
      <div className="flex gap-4 mt-5 h-[calc(100vh-150px)]">
        <EditorSection />
        <OutputSection />
      </div>
    </div>
  );
}
