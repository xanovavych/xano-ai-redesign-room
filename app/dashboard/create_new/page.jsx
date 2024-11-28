"use client";
import React, { useContext, useState } from "react";
import ImageSelection from "./_components/ImageSelection";
import RoomType from "./_components/RoomType";
import DesignType from "./_components/DesignType";
import AdditionalReq from "./_components/AdditionalReq";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { storage } from "@/config/firebaseConfig";
import {
  getDownloadURL,
  ref,
  uploadString,
  uploadBytes,
} from "firebase/storage";
import { useUser } from "@clerk/nextjs";
import CustomLoading from "./_components/CustomLoading";
import AiOutputDialog from "../_components/AiOutputDialog";
import { UserDetailContext } from "@/app/_context/UserDetailContext";
import { db } from "@/config/db";
import { Users } from "@/config/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
// import Replicate from "replicate";

// const replicate = new Replicate({
//   auth: process.env.NEXT_PUBLIC_REPLICATE_API_TOKEN,
// });

function CreateNew() {
  const { user } = useUser();
  const [formData, setFormData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aiOutputImage, setAiOutputImage] = useState();
  const [openOutputDialog, setOpenOutputDialog] = useState(false);
  const [origImage, setOrigImage] = useState();
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  // const [outputResult, setOutputResult] = useState();
  const onHandleInputChange = (value, fieldname) => {
    setFormData((prev) => ({
      ...prev,
      [fieldname]: value,
    }));
    console.log(formData, "formData");
  };

  const GenerateAiImage = async () => {
    setLoading(true);

    //Supposed AI image that will undergo base64
    // const placeHolder = "https://i.ibb.co/tzWjbX6/airoom2.png";
    const rawImageUrl = await SaveRawImageToFirebase();
    console.log(formData?.roomType, "FIRST formData?.roomType");
    console.log(formData?.addtionalReq, "FIRST formData?.additionalReq");
    // const output = await ReplicateRun(rawImageUrl);
    // const base64Image = await ConvertImageToBase64(output);
    // const fileName = Date.now() + "_ai.png";
    // const storageRef = ref(storage, "room-redesign/" + fileName);
    // await uploadString(storageRef, base64Image, "data_url").then((resp) => {
    //   console.log("AI File Uploaded...");
    // });
    // const downloadUrl = await getDownloadURL(storageRef);
    // console.log(downloadUrl);

    const result = await axios.post("/api/redesign-room", {
      imageUrl: rawImageUrl, //rawImageUrl before
      //JUST ADDED - NOT IN ORIGINAL
      // aiImageUrl: downloadUrl,
      roomType: formData?.roomType,
      designType: formData?.designType,
      additionalReq: formData?.additionalReq,
      userEmail: user?.primaryEmailAddress.emailAddress,
    });
    console.log(result);
    console.log(formData?.addtionalReq, "formData?.additionalReq");
    // SHOULD BE DATA>HELLO LOG FROM ROUTE.JSX
    // setAiOutputImage(result.data.result);
    await updateUserCredits();
    setAiOutputImage(result.data.result);
    setOpenOutputDialog(true);
    setLoading(false);
  };

  // const ReplicateRun = async (rawImageUrl) => {
  //   const input = {
  //     image: rawImageUrl,
  //     prompt:
  //       "A" +
  //       formData?.roomType +
  //       "with a" +
  //       formData?.designType +
  //       "style interior" +
  //       formData?.addtionalReq,
  //   };

  //   const output = await replicate.run(
  //     "adirik/interior-design:76604baddc85b1b4616e1c6475eca080da339c8875bd4996705440484a6eac38",
  //     { input }
  //   );
  //   console.log(output);
  //   return output;
  // };

  const SaveRawImageToFirebase = async () => {
    const fileName = Date.now() + "_raw.png";
    const imageRef = ref(storage, "room-redesign/" + fileName);
    console.log(imageRef, "imageRef");

    await uploadBytes(imageRef, formData.image).then((resp) => {
      console.log("File Uploaded...");
    });

    const downloadUrl = await getDownloadURL(imageRef);
    console.log(downloadUrl);
    setOrigImage(downloadUrl);
    return downloadUrl;
  };

  const updateUserCredits = async () => {
    const result = await db
      .update(Users)
      .set({
        credits: userDetail?.credits - 1,
      })
      .where(eq(Users.email, user?.primaryEmailAddress.emailAddress))
      .returning({ id: Users.id });

    if (result) {
      setUserDetail((prev) => ({
        ...prev,
        credits: userDetail?.credits - 1,
      }));
      return result[0].id;
    }
  };

  // const SaveRawImageToFirebase2 = async () => {
  //   const output =
  //     "https://replicate.delivery/pbxt/hQt4fQz7Y8VfOUEieQxQ4YverSCgwj861EFM7NXenLZrRAkeE/out.png";
  //   const base64Image = await ConvertImageToBase64(output);
  //   const fileName = Date.now() + "_ai.png";
  //   const storageRef = ref(storage, "room-redesign/" + fileName);

  //   await uploadString(storageRef, base64Image, "data_url").then((resp) => {
  //     console.log("AI File Uploaded...");
  //   });
  //   const downloadUrl = await getDownloadURL(storageRef);
  //   console.log(downloadUrl);
  //   return downloadUrl;
  // };

  // async function ConvertImageToBase64(imageUrl) {
  //   const resp = await axios.get(imageUrl, { responseType: "arraybuffer" });
  //   const base64ImageRaw = Buffer.from(resp.data).toString("base64");

  //   return "data:image/png;base64," + base64ImageRaw;
  // }

  return (
    <div>
      <h2 className="font-bold text-4xl text-primary text-center">
        Experience the magic of AI remodeling
      </h2>
      <p className="text-center text-gray-500">
        Transform any room with a click. Select a space, choose a style, and
        watch as AI instantly reimagines your environment
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 mt-10 gap-10">
        {/* prettier-ignore*/}
        <ImageSelection selectedImage={(value) => onHandleInputChange(value, "image")}/>
        {/* form input section */}
        <div>
          {/* prettier-ignore*/}
          <RoomType selectRoomType={(value) => onHandleInputChange(value, "roomType")}/>
          {/* prettier-ignore*/}
          <DesignType selectedDesignType={(value) => onHandleInputChange(value, "designType")}/>
          {/* prettier-ignore*/}
          <AdditionalReq additionalReqInput={(value) => onHandleInputChange(value, "additionalReq")}/>
          <Button className="w-full mt-5" onClick={GenerateAiImage}>
            Generate
          </Button>
          {/* prettier-ignore*/}
          <p className="text-sm text-slate-400 mb-2 mt-2">NOTE: 1 CREDIT will be consumed upon each Generated Room</p>
          <Link href={"/dashboard"}>
            <Button className="w-full mt-5">Go back to Dashboard</Button>
          </Link>
        </div>
      </div>
      <CustomLoading loading={loading} />
      <AiOutputDialog
        openDialog={openOutputDialog}
        closeDialog={() => setOpenOutputDialog(false)}
        orgImage={origImage}
        aiImage={aiOutputImage}
      />
    </div>
  );
}

export default CreateNew;
