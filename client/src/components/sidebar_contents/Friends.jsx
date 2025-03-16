import Friend from "../Friend";
import { useSelector } from "react-redux";
export default function Friends({
  allUserFriends,
  friendClickHandler,
  currentActiveId,
  setCurrentActiveId,
}) {
  const { allFriends } = useSelector((state) => state.friends);
  // console.log("ALL THE USER FRIENDS:", allFriends);

  return (
    <>
      {allFriends.map((friend, id) => {
        return (
          <Friend
            friendId={friend.friend._id}
            name={friend.friend.username}
            key={id}
            imageUrl="/img/icons/male-default.jpg"
            friendClickHandler={friendClickHandler}
          />
        );
      })}
    </>
  );
}
