"use client";
import Image from "next/image";
import React, { useState } from "react";

function ImageSelection({ selectedImage }) {
  const [file, setFile] = useState();
  const onFileSelected = (event) => {
    // console.log(event.target.files[0]); -RECENT REMOVAL
    setFile(event.target.files[0]);
    selectedImage(event.target.files[0]);
  };

  return (
    <div>
      <label className="text-gray-500">
        Upload an Image of an Interior (Required)
      </label>
      <div className="mt-3">
        <label htmlFor="upload-image">
          {/* prettier-ignore */}
          <div
            className={`p-1 border flex justify-center border-primary bg-slate-200 cursor-pointer hover:shadow-lg 
                ${file && "p-0 bg-white"}`}>
            {!file ? (
              // prettier-ignore
              <Image src={"/imageupload.png"} width={70} height={70} alt="imageupload" />
            ) : (
              // prettier-ignore
              <Image src={URL.createObjectURL(file)} width={700} height={700} alt="imageupload"/>
            )}
          </div>
        </label>
        {/* prettier-ignore */}
        <input type="file" accept="image/*" id="upload-image" style={{ display: "none" }} onChange={onFileSelected}/>
      </div>
    </div>
  );
}

export default ImageSelection;
