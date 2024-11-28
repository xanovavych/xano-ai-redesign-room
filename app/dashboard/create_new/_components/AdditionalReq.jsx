import React from "react";
import { Textarea } from "@/components/ui/textarea";

function AdditionalReq({ additionalReqInput }) {
  return (
    <div className="mt-2">
      <label className="text-gray-500">
        Enter Additional Details (Optional)
      </label>
      <Textarea
        className="mt-2"
        onChange={(e) => additionalReqInput(e.target.value)}
        placeholder="A canopy bed complemented by a large macrame wall hanging. A wood dresser with potted plants above it. "
      />
    </div>
  );
}

export default AdditionalReq;
