import Convo from "../Convo";
import { useSelector } from "react-redux";
import { useContext } from "react";
import { UserContext } from "../../App";

export default function Directs({ getMessages }) {
  const { loggedInStatus, user, isConnected } = useContext(UserContext);
  const { allDirectConvo } = useSelector((state) => state.conversation);

  // console.log("THESE ARE THE DIRECT CONVERSATIONS:", allDirectConvo);
  return (
    <>
      {allDirectConvo.map((convo, id) => {
        let chatmate = null;
        chatmate = convo.users.find(
          (u) => u._id.toString() !== user._id.toString()
        );

        // THINGS

        return (
          <Convo
            key={id}
            ref={convo._id}
            getMessages={getMessages}
            isGroup={false}
            chatmateId={chatmate._id}
            convoData={convo}
            directArrayId={id}
          />
        );
      })}
    </>
  );
}
