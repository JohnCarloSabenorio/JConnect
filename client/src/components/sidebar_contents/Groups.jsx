import Convo from "../Convo";
import { useSelector } from "react-redux";
export default function Groups({
  groupClickHandler,
  currentActiveId,
  setCurrentActiveId,
}) {
  const { allUserGroupConvo } = useSelector((state) => state.conversation);

  console.log("ALL USER GROUP CONVO:", allUserGroupConvo);
  return (
    <>
      {allUserGroupConvo.map((convo, id) => {
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
            eventHandler={groupClickHandler}
            isActive={currentActiveId === convo._id}
            changeCurrentActive={setCurrentActiveId}
          />
        );
      })}
    </>
  );
}
