import { useDispatch, useSelector } from "react-redux";
import {
  setDisplayNicknamesOverlay,
  setNamesAndNicknames,
} from "../redux/nicknamesOverlay";
import NicknameCard from "./NicknameCard";
import { useState, useEffect } from "react";
import { getNamesAndNicknames } from "../api/conversation";
export default function NicknamesOverlay() {
  const dispatch = useDispatch();
  const { displayNicknamesOverlay, namesAndNicknames } = useSelector(
    (state) => state.nicknamesOverlay
  );

  const { activeConvo } = useSelector((state) => state.conversation);

  useEffect(() => {
    async function getConvoNamesAndNicknames(convoId) {
      const namesAndNicknamesData = await getNamesAndNicknames(convoId);

      console.log("NAMES AND NICKNAMES:", namesAndNicknames);

      dispatch(setNamesAndNicknames(namesAndNicknamesData));
    }
    if (displayNicknamesOverlay) {
      getConvoNamesAndNicknames(activeConvo);
    }
  }, [displayNicknamesOverlay]);
  return (
    <div
      className={`absolute w-full h-full z-50 bg-black/70 justify-center items-center flex-col ${
        displayNicknamesOverlay ? "flex" : "hidden"
      }`}
    >
      <div className="bg-white rounded-md w-150 max-h-200 px-5 py-3">
        <div className="flex justify-between items-center">
          <h1 className="font-bold text-2xl">Nicknames</h1>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 -960 960 960"
            className="w-12 h-15 cursor-pointer hover:fill-gray-500 mt-auto"
            onClick={(e) => dispatch(setDisplayNicknamesOverlay(false))}
          >
            <path d="M200-120q-33 0-56.5-23.5T120-200v-160h80v160h560v-560H200v160h-80v-160q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm220-160-56-58 102-102H120v-80h346L364-622l56-58 200 200-200 200Z" />
          </svg>
        </div>
        <hr />

        {/* Nickname Cards */}
        {namesAndNicknames &&
          namesAndNicknames.map((data, key) => (
            <NicknameCard key={key} userData={data} />
          ))}
      </div>
    </div>
  );
}
