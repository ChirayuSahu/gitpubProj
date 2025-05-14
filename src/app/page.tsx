import Image from "next/image";
import Hero from "@/components/hero";
import Navbar from "@/components/navbar";

export default function Home() {
  return (
    <>
    <Navbar/>
    <Hero/>
    <div className="min-h-screen bg-[url('/herobg.png')] bg-center">

    </div>
    </>
  );
}
