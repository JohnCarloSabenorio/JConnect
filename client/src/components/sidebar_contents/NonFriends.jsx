import User from "../User";
import { useSelector } from "react-redux";
export default function NonFriends({
  allUserFriends,
  chatAFriend,
  currentActiveId,
  setCurrentActiveId,
}) {
  //   const { nonFriends } = useSelector((state) => state.friends);
  // console.log("ALL THE USER FRIENDS:", allFriends);
  //   return (
  //     <>
  //       {allFriends.map((friend, id) => {
  //         return (
  //           <User
  //             userId={friend.friend._id}
  //             name={friend.friend.username}
  //             key={id}
  //             imageUrl="/img/icons/male-default.jpg"
  //             chatAFriend={chatAFriend}
  //           />
  //         );
  //       })}
  //     </>
  //   );
}
