import UserCard from "../UserCard";
import { useEffect } from "react";
import { getFriends } from "../../api/friends";
import { setAllFriends } from "../../redux/friend";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
export default function Friends({
  allUserFriends,
  chatAFriend,
  currentActiveId,
  setCurrentActiveId,
}) {
  const { allFriends } = useSelector((state) => state.friends);
  console.log("ALL MY FRIENDS:", allFriends);
  return (
    <>
      {allFriends.length > 0 &&
        allFriends.map((friend, id) => {
          return (
            <UserCard
              userId={friend.friend._id}
              user={friend.friend}
              key={id}
              imageUrl="/img/icons/male-default.jpg"
              chatAFriend={chatAFriend}
            />
          );
        })}
    </>
  );
}
