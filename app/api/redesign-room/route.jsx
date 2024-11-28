import { db } from "@/config/db";
import { AiGeneratedImage } from "@/config/schema";
import { NextResponse } from "next/server";
import Replicate from "replicate";
import { storage } from "@/config/firebaseConfig";
import axios from "axios";
import { getDownloadURL, ref, uploadString } from "firebase/storage";

const replicate = new Replicate({
  auth: process.env.NEXT_PUBLIC_REPLICATE_API_TOKEN,
});

export async function POST(req) {
  // prettier-ignore
  const {imageUrl, roomType, designType, additionalReq, userEmail } = await req.json();
  // console.log(additionalReq, "additionalReq"); -RECENT REMOVAL
  try {
    const input = {
      image: imageUrl,
      prompt:
        "A " +
        roomType +
        " with a " +
        designType +
        " style interior. " +
        additionalReq,
    };

    // const output = await replicate.run(
    //   "adirik/interior-design:76604baddc85b1b4616e1c6475eca080da339c8875bd4996705440484a6eac38",
    //   { input }
    // );

    const output = "https://i.ibb.co/JBDw5pN/out-1.png";
    // console.log(output); -RECENT REMOVAL

    const base64Image = await ConvertImageToBase64(output);
    const fileName = Date.now() + "_ai.png";
    const storageRef = ref(storage, "room-redesign/" + fileName);
    await uploadString(storageRef, base64Image, "data_url").then((resp) => {
      // console.log("AI File Uploaded..."); -RECENT REMOVAL
    });
    const downloadUrl = await getDownloadURL(storageRef);
    // console.log(downloadUrl); -RECENT REMOVAL

    const dbResult = await db
      .insert(AiGeneratedImage)
      .values({
        roomType: roomType,
        designType: designType,
        orgImage: imageUrl,
        aiImage: downloadUrl,
        userEmail: userEmail,
      })
      .returning({ id: AiGeneratedImage.id });
    // console.log(dbResult); -RECENT REMOVAL
    return NextResponse.json({ result: downloadUrl });
  } catch (e) {
    return NextResponse.json({ error: e });
  }
}

async function ConvertImageToBase64(imageUrl) {
  const resp = await axios.get(imageUrl, { responseType: "arraybuffer" });
  const base64ImageRaw = Buffer.from(resp.data).toString("base64");

  return "data:image/png;base64," + base64ImageRaw;
}

// async function ConvertImageToBase64(imageUrl) {
//   const resp = await axios.get(imageUrl, { responseType: "arraybuffer" });
//   const base64ImageRaw = Buffer.from(resp.data).toString("base64");

//   return "data:image/png;base64," + base64ImageRaw;
// }

//   const output =
//     "https://replicate.delivery/pbxt/hQt4fQz7Y8VfOUEieQxQ4YverSCgwj861EFM7NXenLZrRAkeE/out.png";

//   const base64Image = await ConvertImageToBase64(imageUrl);
//   const fileName = Date.now() + "_ai.png";
//   const storageRef = ref(storage, "room-redesign/" + fileName);
//     await uploadString(storageRef, base64Image, "data_url").then((resp) => {
//       console.log(`You could ${resp.data.activity}`)
//     });
//     const downloadUrl = await getDownloadURL(storageRef);

// return NextResponse.json({ result: "HELLO" });

//Convert Image to AI
//   try {
// prettier-ignore
// const input = {
//   image: imageUrl,
//   prompt: "A" + roomType + "with a" + designType + "style interior" + additonalReq,
// };

// const output = await replicate.run(
//   "adirik/interior-design:76604baddc85b1b4616e1c6475eca080da339c8875bd4996705440484a6eac38",
//   { input }
// );
// console.log(output);
// return NextResponse.json({ result: output });

// const output =
//   "https://replicate.delivery/pbxt/hQt4fQz7Y8VfOUEieQxQ4YverSCgwj861EFM7NXenLZrRAkeE/out.png";

//Convert Output URL to BASE64 Image
// const base64Image = await ConvertImageToBase64(output);
//Save BASE64 to firebase
// const fileName = Date.now() + "_ai.png";
// const storageRef = ref(storage, "room-redesign/" + fileName);
// await uploadString(storageRef, base64Image, "data_url");
// const aidownloadUrl = await getDownloadURL(storageRef);
// return NextResponse.json({ result: aidownloadUrl });
//   return NextResponse.json({ result: "Hello" });
//Save all to databse
//   } catch (e) {
//     return NextResponse.json({ error: e });
//   }
