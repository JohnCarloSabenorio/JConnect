import Friend from "../Friend";
export default function Friends({
  allUserFriends,
  friendClickHandler,
  currentActiveId,
  setCurrentActiveId,
}) {
  return (
    <>
      {allUserFriends.map((friend, id) => {
        return (
          <Friend
            friendId={friend.friend._id}
            name={friend.friend.username}
            key={id}
            imageUrl="/img/icons/male-default.jpg"
            friendClickHandler={friendClickHandler}
            currentActiveId={currentActiveId}
            setCurrentActiveId={setCurrentActiveId}
          />
        );
      })}
    </>
  );
}
