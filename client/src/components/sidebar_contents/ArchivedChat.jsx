import { useSelector } from "react-redux";
import Convo from "../Convo";
import { useContext } from "react";
import { UserContext } from "../../App";
import { archiveConversation } from "../../api/conversation";
export default function ArchivedChat({ getMessages }) {
  const { user } = useContext(UserContext);
  const { allUserArchivedConvo, active } = useSelector(
    (state) => state.conversation
  );

  // console.log("ARCHIVEC CONVERSATIONS TO DISPLAY:", allUserArchivedConvo);

  return (
    <>
      {allUserArchivedConvo.map((convo, id) => {
        let chatmate = null;

        if (convo.users.length === 2) {
          chatmate = convo.users.find(
            (u) => u._id.toString() !== user._id.toString()
          );
        }

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
            getMessages={getMessages}
            convoData={convo}
            chatmateId={chatmate?._id}
            isArchived={true}
          />
        );
      })}
    </>
  );
}
