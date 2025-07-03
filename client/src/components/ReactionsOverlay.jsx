import { Emoji } from "emoji-picker-react";
import { getAllMessageReactions } from "../api/message";
import { useState, useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";

import {
  setAllMessageReactions,
  setDisplayReactionsOverlay,
} from "../redux/message";
export default function ReactionsOverlay() {
  const { displayReactionsOverlay, allMessageReactions } = useSelector(
    (state) => state.message
  );

  const dispatch = useDispatch();

  console.log("ALL THE PUTANG INANG REACTIONS:", allMessageReactions);
  console.log(
    "ALL THE PUTANG INANG REACTIONS:",
    Object.keys(allMessageReactions).length > 0
  );

  return (
    <div
      className={`${
        displayReactionsOverlay ? "block" : "hidden"
      } absolute w-full h-full z-20 bg-black/70 justify-center items-center flex-col flex
        }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 -960 960 960"
        fill="#e3e3e3"
        className="absolute top-5 right-5 w-10 h-10 cursor-pointer"
        onClick={(e) => {
          dispatch(setDisplayReactionsOverlay(false));
          dispatch(setAllMessageReactions({}));
        }}
      >
        <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
      </svg>

      <div
        className={`bg-white p-4 rounded-md w-3xl flex flex-col items-center`}
      >
        <h1 className="text-4xl text-center mt-5 font-semibold">
          Message Reactions
        </h1>

        <hr className="w-full mt-5 text-gray-700" />

        {/* List of reactions */}
        <div className="flex gap-3 overflow-x-scroll w-full">
          {/* Reaction button */}

          <div className="flex items-center gap-1 p-5 hover:bg-gray-300 rounded-xl cursor-pointer">
            <p>All</p>
            <p>1</p>
          </div>

          {Object.keys(allMessageReactions).length > 0 &&
            Object.entries(allMessageReactions).map(([emojiUnified, users]) => {
              return (
                <div
                  key={emojiUnified}
                  className="flex items-center gap-1 p-5 hover:bg-gray-300 rounded-xl cursor-pointer"
                >
                  <Emoji unified={emojiUnified} />
                  <p>{users.length}</p>
                </div>
              );
            })}
        </div>

        {/* List of members for each reaction */}
        <div className="flex flex-col w-full py-2 pt-5 px-2">
          {/* Member */}
          <div className="grid grid-cols-2 w-full items-center text-xl">
            <div className="flex items-center gap-4">
              <img src="img/avatar.png" className="w-15 h-15" />
              <p>John Carlo Sabenorio</p>
            </div>
            <div className="flex justify-end">
              <Emoji className="justify-self-end" unified="1f601" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
