import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import {
  addSelectedUser,
  removeSelectedUser,
} from "../redux/addMemberOverlay";

import { useRef } from "react";
export default function FilteredUserCard({ user }) {
  const { selectedUsers } = useSelector((state) => state.addMemberOverlay);
  const dispatch = useDispatch();
  const checkboxRef = useRef(null);
  return (
    <div className="flex justify-between pl-5 pr-5 p-5">
      <p>{user.username}</p>
      <input
        checked={!!selectedUsers.find((selected) => selected._id == user._id)}
        ref={checkboxRef}
        type="checkbox"
        onChange={(e) => {
          if (e.target.checked) {
            dispatch(addSelectedUser(user));
          } else {
            console.log("REMOVE THIS USER:", user._id);
            dispatch(removeSelectedUser(user._id));
          }
        }}
        className="w-5 h-5 rounded-full"
      />
    </div>
  );
}
