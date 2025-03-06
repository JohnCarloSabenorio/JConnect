import { useSelector } from "react-redux";
import Convo from "../Convo";
export default function ArchivedChat({
  archivedClickHandler,
  currentActiveId,
  setCurrentActiveId,
}) {
  const { allUserArchivedConvo } = useSelector((state) => state.conversation);

  console.log("ARCHIVEC CONVERSATIONS TO DISPLAY:", allUserArchivedConvo);
  return (
    <>
      {allUserArchivedConvo.map((convo, id) => {
        console.log("THE CONVORATION:", convo);
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
            eventHandler={archivedClickHandler}
            isActive={currentActiveId === convo._id}
            changeCurrentActive={setCurrentActiveId}
            isArchived={true}
            convoData={convo}
          />
        );
      })}
    </>
  );
}
