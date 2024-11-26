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
    // console.log(formData);
  };

  const GenerateAiImage = async () => {
    setLoading(true);
    const placeHolder = "https://i.ibb.co/tzWjbX6/airoom2.png"; //Supposed AI image that will undergo base64
    const rawImageUrl = await SaveRawImageToFirebase();
    const base64Image = await ConvertImageToBase64(placeHolder);
    const fileName = Date.now() + "_ai.png";
    const storageRef = ref(storage, "room-redesign/" + fileName);
    await uploadString(storageRef, base64Image, "data_url").then((resp) => {
      console.log("AI File Uploaded...");
    });
    const downloadUrl = await getDownloadURL(storageRef);
    console.log(downloadUrl);

    const result = await axios.post("/api/redesign-room", {
      imageUrl: rawImageUrl, //rawImageUrl before
      aiImageUrl: downloadUrl, //JUST ADDED - NOT IN ORIGINAL
      roomType: formData?.roomType,
      designType: formData?.designType,
      addtionalReq: formData?.addtionalReq,
      userEmail: user?.primaryEmailAddress.emailAddress,
    });
    console.log(result);
    // SHOULD BE DATA>HELLO LOG FROM ROUTE.JSX
    // setAiOutputImage(result.data.result);
    await updateUserCredits();
    setAiOutputImage(downloadUrl);
    setOpenOutputDialog(true);
    setLoading(false);
  };

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

  async function ConvertImageToBase64(imageUrl) {
    const resp = await axios.get(imageUrl, { responseType: "arraybuffer" });
    const base64ImageRaw = Buffer.from(resp.data).toString("base64");

    return "data:image/png;base64," + base64ImageRaw;
  }

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
          <p className="text-sm text-slate-400 mb-52">NOTE: 1 CREDIT will be consumed upon each Generated Room</p>
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
