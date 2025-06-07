import { useSelector } from "react-redux";
import ConversationCard from "../ConversationCard";
import { useContext } from "react";
import { UserContext } from "../../App";
import { archiveConversation } from "../../api/conversation";
export default function ArchivedDirects({ getMessages }) {
  const { user } = useContext(UserContext);
  const { allArchivedConversation, active } = useSelector(
    (state) => state.conversation
  );

  const filteredConversations = allArchivedConversation.filter(
    (uc) => uc.conversation.users.length === 2
  );

  return (
    <>
      {filteredConversations.map((userConversation, id) => {
        let chatmate = null;

        if (userConversation.conversation.users.length === 2) {
          chatmate = userConversation.conversation.users.find(
            (u) => u._id.toString() !== user._id.toString()
          );
        }

        return (
          <ConversationCard
            key={id}
            ref={userConversation.conversation._id}
            getMessages={getMessages}
            isGroup={false}
            chatmateId={chatmate?._id}
            userConversation={userConversation}
            directArrayId={id}
          />
        );
      })}
    </>
  );
}
