import UserCard from "../UserCard";
import { useSelector } from "react-redux";
export default function Friends({
  allUserFriends,
  chatAFriend,
  currentActiveId,
  setCurrentActiveId,
}) {
  const { allFriends } = useSelector((state) => state.friends);
  // console.log("ALL THE USER FRIENDS:", allFriends);

  return (
    <>
      {allFriends.map((friend, id) => {
        return (
          <UserCard
            userId={friend.friend._id}
            name={friend.friend.username}
            key={id}
            imageUrl="/img/icons/male-default.jpg"
            chatAFriend={chatAFriend}
          />
        );
      })}
    </>
  );
}
