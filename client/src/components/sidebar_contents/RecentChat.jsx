import Convo from "../Convo";
export default function RecentChat({ allConvo, convoClickHandler }) {
  return (
    <>
      {allConvo.map((convo, id) => {
        return (
          <Convo
            key={id}
            convoId={convo._id}
            name={convo.convoName}
            msg={convo.latestMessage}
            msgCount={"#"}
            timeSent={convo.updatedAt}
            imageUrl="/img/icons/male-default.jpg"
            eventHandler={convoClickHandler}
          />
        );
      })}
    </>
  );
}
