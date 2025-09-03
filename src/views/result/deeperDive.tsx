import React from "react";

export default function instantConfirm() {
  return (
    <div>
      <div className="bg-[#4EA8A10F] w-[661px] h-[664px] my-25 mx-auto rounded-[32px]">
        <nav></nav>
        <div className="text-center py-[86px] px-[52px]">
          <h1 className="text-[48px] font-bold text-[#101820E5]">
            Your request has been received!
          </h1>
          <p className="text-[24px] font-medium text-[#101820BF]">
            Thanks for choosing{" "}
            <span className="text-[#4EA8A1]">Deeper Dive</span>
          </p>
          <p className="text-[24px] font-medium text-[#101820BF]">
            Our verification team will now:
          </p>
          <div>
            <p className="text-[16px] font-normal">
              1. Review your documents & details.
            </p>
            <p className="text-[16px] font-normal">
              2. Deliver your report within{" "}
              <span className="font-medium">24 - 48</span> working hours{" "}
            </p>
          </div>
          <div className="w-[441px] m-auto pt-10">
            <h1 className="text-left py-[8px] text-[#101820E5] text-[24px] font-semibold">
              Status Box
            </h1>
            <div>
              <div className="flex h-[57px] w-full rounded-[8px] border-1 border-[#4EA8A1E5] mt-5 mb-10">
                <span className="bg-[#4EA8A1E5] w-[119px] py-[12px] px-[16px] text-white rounded-[8px]">
                  Order ID:{" "}
                </span>
                <span></span>
              </div>
              <div className="flex h-[57px] w-[441px] rounded-[8px] border-1 border-[#4EA8A1E5]">
                <span className="bg-[#4EA8A1E5] w-[119px] py-[12px] px-[16px] text-white rounded-[8px]">
                  Product{" "}
                </span>
                <span></span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p className="text-center pb-15 text-[16px] font-regular text-[#101820E5]">
        Support Contact: support@investinda.com | +234 XXXX XXX XXX
      </p>
    </div>
  );
}
