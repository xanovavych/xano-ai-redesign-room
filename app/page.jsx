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

      <div className="mt-20 flex flex-col justify-between items-center ">
        <h2>LANDING PAGE</h2>
        <Link href={"/dashboard"}>
          <Button>GET STARTED</Button>
        </Link>
      </div>
    </div>
  );
}
