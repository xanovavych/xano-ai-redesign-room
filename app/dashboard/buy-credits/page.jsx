"use client";
import { UserDetailContext } from "@/app/_context/UserDetailContext";
import { Button } from "@/components/ui/button";
import { db } from "@/config/db";
import { Users } from "@/config/schema";
import { useUser } from "@clerk/nextjs";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { eq } from "drizzle-orm";
import { useRouter } from "next/navigation";
import React, { useContext, useState } from "react";

function BuyCredits() {
  const creditsOption = [
    {
      credits: 5,
      amount: 0.99,
    },
    {
      credits: 10,
      amount: 1.99,
    },
    {
      credits: 25,
      amount: 3.99,
    },
    {
      credits: 50,
      amount: 6.99,
    },
    {
      credits: 100,
      amount: 9.99,
    },
  ];
  const { user } = useUser();
  const [selectedOption, setSelectedOption] = useState([]);
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const router = useRouter();
  const onPaymentSuccess = async () => {
    // console.log("Payment sucess"); -RECENT REMOVAL
    const result = await db
      .update(Users)
      .set({
        credits: userDetail?.credits + selectedOption?.credits,
      })
      .where(eq(Users.email, user?.primaryEmailAddress.emailAddress))
      .returning({ id: Users.id });
    if (result) {
      setUserDetail((prev) => ({
        ...prev,
        credits: userDetail?.credits + selectedOption?.credits,
      }));
      router.push("/dashboard");
    }
  };

  return (
    <div>
      <h2 className="font-bold text-2xl">Buy More Credits</h2>
      <p>
        Unlock endless possibilites! Buy more credits and transform your room
        with Ai Magic!
      </p>
      <div className="gap-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {creditsOption.map((item, index) => (
          <div
            key={index}
            className={`p-4 mt-10 mx-2 flex flex-col gap-2 justify-center items-center border shadow-md rounded-md ${
              selectedOption?.credits == item.credits && "border-primary"
            }`}
          >
            <h2 className="font-bold text-3xl">{item.credits}</h2>
            <h2 className="font-medium text-xl">Credits</h2>
            <Button className="w-full" onClick={() => setSelectedOption(item)}>
              Select
            </Button>
            <h2 className="font-medium text-primary">${item.amount}</h2>
          </div>
        ))}
      </div>
      <div className="mt-20">
        {selectedOption?.amount && (
          <PayPalButtons
            style={{ layout: "horizontal" }}
            onApprove={() => onPaymentSuccess()}
            onCancel={() => console.log("Payment Cancelled")}
            createOrder={(data, actions) => {
              return actions?.order.create({
                purchase_units: [
                  {
                    amount: {
                      value: selectedOption?.amount?.toFixed(2),
                      currency_code: "USD",
                    },
                  },
                ],
              });
            }}
          />
        )}
      </div>
    </div>
  );
}

export default BuyCredits;
