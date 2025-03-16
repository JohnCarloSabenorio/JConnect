import Convo from "../Convo";
import { useSelector } from "react-redux";
export default function Groups({ getMessages }) {
  const { allUserGroupConvo } = useSelector((state) => state.conversation);

  return (
    <>
      {allUserGroupConvo.map((convo, id) => {
        // console.log("THE CONVORATION:", convo);
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
            isGroup={convo.users.length > 2}
            convoData={convo}
          />
        );
      })}
    </>
  );
}
