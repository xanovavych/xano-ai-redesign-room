"use client";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import EmptyState from "./EmptyState";
import Link from "next/link";
import { db } from "@/config/db";
import { AiGeneratedImage } from "@/config/schema";
import { eq } from "drizzle-orm";
import RoomDesignCard from "./RoomDesignCard";

function Listing() {
  const { user } = useUser();
  const [userRoomList, setUserRoomList] = useState([]);

  useEffect(() => {
    user && GetUserRoomList();
  }, [user]);

  const GetUserRoomList = async () => {
    const result = await db
      .select()
      .from(AiGeneratedImage)
      .where(
        eq(AiGeneratedImage.userEmail, user?.primaryEmailAddress.emailAddress)
      );
    setUserRoomList(result);
    console.log(result);
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-3xl">Hello, {user?.fullName}</h2>
        <Link href={"/dashboard/create_new"}>
          <Button>+ Redesign Room</Button>
        </Link>
      </div>

      {userRoomList?.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="mt-10">
          {/* prettier-ignore */}
          <h2 className="font-bold text-primary text-xl mb-10">Interior Design Studio</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {userRoomList.map((room, index) => (
              <RoomDesignCard key={index} room={room} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Listing;
