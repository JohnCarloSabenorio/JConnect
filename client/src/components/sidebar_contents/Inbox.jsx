import { useState, useRef } from "react";
import Convo from "../Convo";
import { useSelector } from "react-redux";
export default function Inbox({
  convoClickHandler,
  currentActiveId,
  setCurrentActiveId,
}) {
  const { allUserConvo } = useSelector((state) => state.conversation);
  return (
    <>
      {allUserConvo.map((convo, id) => {
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
