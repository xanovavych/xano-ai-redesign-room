import React, { useState } from "react";
import ReactBeforeSliderComponent from "react-before-after-slider-component";
import "react-before-after-slider-component/dist/build.css";
import AiOutputDialog from "./AiOutputDialog";
import Image from "next/image";

function RoomDesignCard({ room }) {
  const [openDialog, setOpenDialog] = useState(false);
  const onClickHandler = () => {
    setOpenDialog(true);
    console.log("CLICKED");
  };

  return (
    <>
      <div
        className="shadow-md rounded-md cursor-pointer"
        onClick={() => onClickHandler()}
      >
        {/* <ReactBeforeSliderComponent
        firstImage={{ imageUrl: room?.aiImage }}
        secondImage={{ imageUrl: room?.orgImage }}
      /> */}
        <Image
          src={room?.aiImage}
          width={500}
          height={500}
          alt="ai-image"
          style={{ objectFit: "contain" }}
        />
        <div className="p-4">
          <h2 className="text-primary">Room Type: {room.roomType}</h2>
          <h2 className="text-primary">Design Type: {room.designType}</h2>
        </div>
      </div>
      <AiOutputDialog
        openDialog={openDialog}
        closeDialog={() => setOpenDialog(false)}
        aiImage={room.aiImage}
        orgImage={room.orgImage}
      />
    </>
  );
}

export default RoomDesignCard;
