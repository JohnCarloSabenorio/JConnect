import ConversationCard from "../ConversationCard";
import { useSelector, useDispatch } from "react-redux";
export default function Groups({ getMessages }) {
  const dispatch = useDispatch();
  const { allGroupConversation } = useSelector((state) => state.conversation);

  return (
    <>
      {allGroupConversation.map((data, id) => {
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
