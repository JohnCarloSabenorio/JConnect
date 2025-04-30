import ConversationCard from "../ConversationCard";
import { useSelector } from "react-redux";
export default function Groups({ getMessages }) {
  const { allUserGroupConvo } = useSelector((state) => state.conversation);

  return (
    <>
      {allUserGroupConvo.map((data, id) => {
        // console.log("THE CONVORATION:", convo);

        console.log(" THE GROUP CONVO:", data);
        
        return (
          <ConversationCard
            key={id}
            ref={data._id}
            getMessages={getMessages}
            isGroup={true}
            userConversation={data}
            directArrayId={id}
          />
        );
      })}
    </>
  );
}

/* 
  return (
    <>
      {allDirectConvo.map((data, id) => {
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
            isGroup={false}
            chatmateId={chatmate._id}
            userConversation={data}
            directArrayId={id}
          />
        );
      })}
    </>
  );
*/
