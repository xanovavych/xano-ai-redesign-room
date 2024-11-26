import Image from "next/image";
import React, { useState } from "react";

function DesignType({ selectedDesignType }) {
  const Designs = [
    { name: "Modern", image: "/modern.jpg" },
    { name: "Industrial", image: "/industrial.jpg" },
    { name: "Bohemian", image: "/bohemian.jpg" },
    { name: "Traditional", image: "/traditional.jpg" },
    { name: "Rustic", image: "/rustic.jpg" },
    { name: "Minimalist", image: "/minimalist.jpg" },
  ];

  const [selectOption, setSelectedOption] = useState();

  return (
    <div className="mt-5">
      <label className="text-slate-400">Select Interior design type</label>
      <div className="grid grid-cols-2 mt-3 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {Designs.map((design, index) =>
          // prettier-ignore
          <div key={index} onClick={() => {
              setSelectedOption(design.name);
              selectedDesignType(design.name);
            }}>
            {/* prettier-ignore */}
            <Image src={design.image} width={200} height={200}
              className={`h-[70px] rounded-md hover:scale-110 transition-all cursor-pointer ${
                design.name === selectOption && "border-2 border-primary rounded-md p-0.5"}`} 
                alt="room"/>
            <h2>{design.name}</h2>
          </div>
        )}
      </div>
    </div>
  );
}

export default DesignType;
