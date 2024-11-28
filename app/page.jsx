import { Button } from "@/components/ui/button";
import Image from "next/image";
import Header from "./dashboard/_components/Header";
import Link from "next/link";
import DashboardLayout from "./dashboard/layout";
import React from "react";

export default function Home() {
  return (
    <div>
      <div className="p-5 shadow-sm flex justify-between items-center">
        <div className="flex gap-2 items-center cursor-pointer">
          <Image src={"/logo.svg"} width={40} height={40} alt="logo" />
          <h2 className="font-bold text-lg">AI Room Designer</h2>
        </div>

        <div>
          <Link href={"/dashboard"}>
            <Button>GET STARTED</Button>
          </Link>
        </div>
      </div>

      <div
        style={{
          zIndex: -1,
          position: "fixed",
          width: "100vw",
          height: "100vh",
        }}
      >
        <Image
          src="/bg.jpg"
          alt="background"
          fill={true}
          className="object-cover"
        />
      </div>

      <div className="relative">
        <div className="mt-40 flex flex-col justify-between items-center ">
          <h2 className="px-10 mb-10 text-white text-xl drop-shadow-[0_1.5px_1.5px_rgba(0,0,0,0.8)]">
            Transform your space effortlessly with AI-powered interior design –
            personalized room concepts tailored to your style, instantly!
          </h2>
          <Link href={"/dashboard"}>
            <Button className="px-10 py-7">GET STARTED</Button>
          </Link>
        </div>
        <div className="absolute w-full"></div>
      </div>
    </div>
  );
}
