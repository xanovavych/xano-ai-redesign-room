import React from "react";
import { Textarea } from "@/components/ui/textarea";

function AdditionalReq({ additionalReqInput }) {
  return (
    <div className="mt-2">
      <label className="text-slate-400">
        Enter Additional Requirements (Optional)
      </label>
      <Textarea
        className="mt-2"
        onChange={(e) => additionalReqInput(e.target.value)}
      />
    </div>
  );
}

export default AdditionalReq;
