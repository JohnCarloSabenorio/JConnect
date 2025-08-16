import ConversationCard from "../ConversationCard";
import { useSelector } from "react-redux";
import { useContext } from "react";
import { UserContext } from "../../App";

export default function Inbox({ inputRef, getMessages }) {
  const { loggedInStatus, user, isConnected } = useContext(UserContext);
  const { allDirectConversation, allGroupConversation } = useSelector(
    (state) => state.conversation
  );
  const { convoViewMode } = useSelector((state) => state.sidebar);

  let filteredConversations;

  if (!allDirectConversation) return <></>;
  if (convoViewMode === 0) {
    filteredConversations = allDirectConversation.filter(
      (uc) => uc.conversation.users.length === 2
    );
  } else {
    filteredConversations = allGroupConversation.filter((uc) => uc.isGroup);
  }

  return (
    <>
      {filteredConversations.map((data, id) => {
        let chatmate = null;

        chatmate = data.conversation.users.find(
          (u) => u._id.toString() !== user._id.toString()
        );

        // THINGS

        return (
          <ConversationCard
            key={id}
            ref={data._id}
            getMessages={getMessages}
            isGroup={data.isGroup}
            chatmateId={chatmate?._id}
            userConversation={data}
            directArrayId={id}
            inputRef={inputRef}
          />
        );
      })}
    </>
  );
}
