import Convo from "../Convo";
export default function Groups({
  allGroupConvo,
  groupClickHandler,
  currentActiveId,
  setCurrentActiveId,
  searchInput,
}) {
  return (
    <>
      {allGroupConvo.map((convo, id) => {
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
            eventHandler={groupClickHandler}
            isActive={currentActiveId === convo._id}
            changeCurrentActive={setCurrentActiveId}
            searchInput={searchInput}
          />
        );
      })}
    </>
  );
}
