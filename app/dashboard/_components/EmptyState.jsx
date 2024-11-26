import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";

function EmptyState() {
  return (
    <div className="flex items-center justify-center mt-10 flex-col">
      <Image
        src={"/placeholder-room.png"}
        width={200}
        height={200}
        alt="placeholder"
      />
      <h2 className="font-medium text-gray-500 text-lg">
        Create a New AI Interior Design for your Room
      </h2>
      <Link href={"/dashboard/create_new"}>
        <Button className="mt-5">+ Redesign Room</Button>
      </Link>
    </div>
  );
}

export default EmptyState;
