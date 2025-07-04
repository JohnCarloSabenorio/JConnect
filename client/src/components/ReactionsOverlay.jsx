import { Emoji } from "emoji-picker-react";
import { getAllMessageReactions } from "../api/message";
import { useState, useEffect, useMemo } from "react";

import { useSelector, useDispatch } from "react-redux";
import { setDisplayedUser } from "../redux/profile_overlay";
import { showProfileOverlay } from "../redux/profile_overlay";
import {
  setAllMessageReactions,
  setDisplayReactionsOverlay,
  setDisplayedUserReactions,
  setDisplayedEmoji,
} from "../redux/message";
export default function ReactionsOverlay() {
  const {
    displayReactionsOverlay,
    allMessageReactions,
    displayedUserReactions,
    collectedReactions,
    displayedEmoji,
  } = useSelector((state) => state.message);

  const dispatch = useDispatch();

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
          dispatch(setDisplayedEmoji("all_emoji"));
        }}
      >
        <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
      </svg>

      <div
        className={`bg-white p-4 rounded-md w-3xl flex flex-col items-center overflow-y-scroll`}
      >
        <h1 className="text-4xl text-center mt-5 font-semibold">
          Message Reactions
        </h1>

        <hr className="w-full mt-5 text-gray-700" />

        {/* List of reactions */}
        <div className="flex gap-3 overflow-x-scroll w-full mt-5">
          {/* Reaction button */}

          <div
            className={`${
              displayedEmoji == "all_emoji" && "bg-gray-300"
            } flex items-center gap-1 p-5 hover:bg-gray-300 rounded-xl cursor-pointer`}
            onClick={(e) => {
              dispatch(setDisplayedUserReactions(collectedReactions));

              dispatch(setDisplayedEmoji("all_emoji"));
            }}
          >
            <p>All</p>
            <p>1</p>
          </div>

          {Object.keys(allMessageReactions).length > 0 &&
            Object.entries(allMessageReactions).map(([emojiUnified, users]) => {
              // PUT THIS IN A SEPARATE COMPONENT
              return (
                <div
                  key={emojiUnified}
                  className={`${
                    displayedEmoji == emojiUnified && "bg-gray-300"
                  } flex items-center gap-1 p-5 hover:bg-gray-300 rounded-xl cursor-pointer`}
                  onClick={(e) => {
                    dispatch(
                      setDisplayedUserReactions(
                        allMessageReactions[emojiUnified]
                      )
                    );

                    dispatch(setDisplayedEmoji(emojiUnified));
                  }}
                >
                  <Emoji unified={emojiUnified} />
                  <p>{users.length}</p>
                </div>
              );
            })}
        </div>

        {/* List of members for each reaction */}
        <div className="flex flex-col gap-3 w-full py-2 pt-5 px-2">
          {/* Member */}
          {displayedUserReactions &&
            displayedUserReactions.map((reaction, idx) => {
              // PUT THIS IN A SEPARATE COMPONENT
              return (
                <div
                  className="grid grid-cols-2 w-full items-center text-lg cursor-pointer hover:bg-gray-300 p-2 rounded-md"
                  onClick={(e) => {
                    dispatch(showProfileOverlay());
                    dispatch(setDisplayedUser(reaction.user));
                  }}
                >
                  <div className="flex items-center gap-4">
                    <img src="img/avatar.png" className="w-13 h-13" />
                    <p>{reaction.user.username}</p>
                  </div>
                  <div className="flex justify-end">
                    <Emoji
                      className="justify-self-end"
                      unified={reaction.unified}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
