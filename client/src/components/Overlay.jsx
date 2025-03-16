import OverlayModal from "./OverlayModal";
import { useState } from "react";
import { useSelector } from "react-redux";
export default function Overlay() {
  const { isHidden } = useSelector((state) => state.overlay);
  return (
    <>
      <div
        className={`w-full z-10 h-full absolute flex justify-center items-center bg-black/50 ${
          isHidden ? "hidden" : ""
        }`}
      >
        {/* Put this in a separate component */}
        <OverlayModal />
      </div>
    </>
  );
}
