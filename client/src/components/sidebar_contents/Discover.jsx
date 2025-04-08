import User from "../User";
import { useSelector, useDispatch } from "react-redux";

export default function Discover() {
  const { allUsers } = useSelector((state) => state.user);

  return (
    <>
      {allUsers.map((user, id) => {
        return (
          <User
            userId={user._id}
            name={user.username}
            key={id}
            imageUrl="/img/icons/male-default.jpg"
          ></User>
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
