import ConversationCard from "../ConversationCard";
import { useSelector } from "react-redux";
import { useContext } from "react";
import { UserContext } from "../../App";

export default function Directs({ getMessages }) {
  const { loggedInStatus, user, isConnected } = useContext(UserContext);
  const { allDirectConversation } = useSelector((state) => state.conversation);

  return (
    <>
      {allDirectConversation.map((data, id) => {
        let chatmate = null;

        console.log("DIRECT CONVERSATION:", data);
        chatmate = data.conversation.users.find(
          (u) => u._id.toString() !== user._id.toString()
        );

        // THINGS

        return (
          <ConversationCard
            key={id}
            ref={data._id}
            getMessages={getMessages}
            isGroup={false}
            chatmateId={chatmate._id}
            userConversation={data}
            directArrayId={id}
          />
        );
      })}
    </>
  );
}
