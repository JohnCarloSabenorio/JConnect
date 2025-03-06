import Convo from "../Convo";
import { useSelector } from "react-redux";
import { useContext } from "react";
import { UserContext } from "../../App";

export default function Inbox({
  convoClickHandler,
  currentActiveId,
  setCurrentActiveId,
}) {
  const { loggedInStatus, user, isConnected } = useContext(UserContext);
  const { allUserConvo } = useSelector((state) => state.conversation);
  return (
    <>
      {allUserConvo.map((convo, id) => {
        let friend = null;
        friend = convo.users.find(
          (u) => u._id.toString() !== user._id.toString()
        );

        // if (convo.users.length < 3) {
        //   console.log("THE DIRECT CONVO:", convo);
        //   friend = convo.users.find(
        //     (u) => u._id.toString() !== user._id.toString()
        //   );

        //   console.log("THE FRIEND:", friend);
        // }
        // Tomorrow, the latest message also needs to be updated

        console.log("CONVERSATION:", convo);
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
            eventHandler={convoClickHandler}
            isActive={currentActiveId === convo._id}
            changeCurrentActive={setCurrentActiveId}
            isGroup={convo.users.length > 2}
            friendId={friend._id}
          />
        );
      })}
    </>
  );
}
