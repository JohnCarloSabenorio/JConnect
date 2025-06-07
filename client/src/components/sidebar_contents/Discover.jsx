import UserCard from "../UserCard";
import { useSelector, useDispatch } from "react-redux";

export default function Discover() {
  const { allUsers } = useSelector((state) => state.user);

  return (
    <>
      {allUsers.map((user, id) => {
        return (
          <UserCard
            userId={user._id}
            user={user}
            key={id}
            imageUrl="/img/icons/male-default.jpg"
          ></UserCard>
        );
      })}
    </>
  );
}

// import User from "../User";
// import { useSelector } from "react-redux";
// export default function Friends({
//   allUserFriends,
//   chatAFriend,
//   currentActiveId,
//   setCurrentActiveId,
// }) {
//   const { allFriends } = useSelector((state) => state.friends);
//   // console.log("ALL THE USER FRIENDS:", allFriends);

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
// }
