import { useState, useRef } from "react";
import Convo from "../Convo";
export default function Inbox({
  allConvo,
  convoClickHandler,
  currentActiveId,
  setCurrentActiveId,
  searchInput,
}) {
  return (
    <>
      {allConvo.map((convo, id) => {
        // Tomorrow, the latest message also needs to be updated
        return (
          <Convo
            key={id}
            ref={convo._id}
            convoId={convo._id}
            name={convo.convoName}
            msg={convo.latestMessage}
            msgCount={"#"}
            timeSent={convo.updatedAt}
            imageUrl="/img/icons/male-default.jpg"
            eventHandler={convoClickHandler}
            isActive={currentActiveId === convo._id}
            changeCurrentActive={setCurrentActiveId}
          />
        );
      })}
    </>
  );
}
