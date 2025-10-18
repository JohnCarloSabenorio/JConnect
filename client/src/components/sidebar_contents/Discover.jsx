import UserCard from "../UserCard";
import { useSelector, useDispatch } from "react-redux";
import { useContext, useMemo } from "react";
import { UserContext } from "../../App";
export default function Discover() {
  const { allUsers } = useSelector((state) => state.user);

  const { user } = useContext(UserContext);

  const filteredUsers = allUsers.filter((u) => u._id != user._id);

  return (
    <>
      {filteredUsers.map((user, id) => {
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
