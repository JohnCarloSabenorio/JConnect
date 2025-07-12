import { useSelector, useDispatch } from "react-redux";
import {
  setHideAddMemberOverlay,
  setSelectedUsers,
} from "../redux/addmember_overlay";
import { addNewMembersToGroup } from "../api/conversation";
import { setAllUsers } from "../redux/user";
import { getAllUsers } from "../api/user";
import SelectedUserBadge from "./SelectedUserBadge";
import FilteredUserCard from "./FilteredUserCard";
import { useMemo, useEffect, useState } from "react";
import { setActiveConvoMembers } from "../redux/conversation";
export default function AddMemberOverlay() {
  const dispatch = useDispatch();
  const { hideAddMemberOverlay } = useSelector(
    (state) => state.addMemberOverlay
  );

  const { allUsers } = useSelector((state) => state.user);
  const { selectedUsers } = useSelector((state) => state.addMemberOverlay);
  const { activeConvo, activeConvoMembers } = useSelector(
    (state) => state.conversation
  );
  const [searchString, setSearchString] = useState("");
  useEffect(() => {
    fetchAllUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    if (allUsers.length == 0) return [];
    return allUsers.filter(
      (user) =>
        user.username
          .toLowerCase()
          .trim()
          .includes(searchString.toLowerCase().trim()) &&
        !activeConvoMembers.find((activeUser) => activeUser._id == user._id)
    );
  }, [allUsers, searchString, activeConvoMembers]);

  async function fetchAllUsers() {
    try {
      const allFetchedUsers = await getAllUsers();
      dispatch(setAllUsers(allFetchedUsers));
    } catch (err) {
      console.log("Error fetching all users:", err);
    }
  }

  async function addNewMembers(activeConvo, newMemberIds) {
    try {
      const newMembers = await addNewMembersToGroup(activeConvo, newMemberIds);
      newMemberIds.forEach((userId) => {
        socket.emit("send notification", {
          message: `you've been invited to a group chat!`,
          receiver: userId,
          notification_type: "group_invite",
        });
      });
      dispatch(setActiveConvoMembers(newMembers));
    } catch (err) {
      console.log("error adding new members.");
    }
  }

  return (
    <>
      <div
        className={`${
          hideAddMemberOverlay ? "hidden" : "block"
        } absolute w-full h-full z-20 bg-black/70 justify-center items-center flex-col flex
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 -960 960 960"
          fill="#e3e3e3"
          className={` absolute top-5 right-5 w-10 h-10 cursor-pointer`}
          onClick={() => {
            dispatch(setHideAddMemberOverlay(true));
          }}
        >
          <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
        </svg>

        <div className="bg-white p-10 rounded-xl w-170">
          <h3 className="font-bold text-4xl text-center">
            Add a user in the chat!
          </h3>

          {/* Search Bar */}
          <input
            type="text"
            className="mt-3 rounded-full p-2 px-5 w-full bg-white shadow-md"
            placeholder="Search..."
            onInput={(e) => {
              setSearchString(e.target.value);
            }}
          />

          {/* USERS SELECTED */}

          {selectedUsers.length == 0 ? (
            <p className="text-center text-gray-700 text-xl mt-10">
              No users selected
            </p>
          ) : (
            <div className="mt-10 flex gap-10 overflow-x-scroll">
              {selectedUsers.map((user, idx) => {
                return <SelectedUserBadge key={idx} user={user} />;
              })}
            </div>
          )}

          <h3 className="font-bold text-3xl mt-5">Users</h3>

          {/* Select Users Div */}

          <div className="flex flex-col mt-5 h-60 overflow-y-scroll mb-5">
            {/* Select User Cards  */}
            {filteredUsers.map((user, idx) => {
              return <FilteredUserCard key={idx} user={user} />;
            })}
          </div>

          <button
            onClick={(e) => {
              let newMemberIds = [];

              selectedUsers.forEach((user) => {
                newMemberIds.push(user._id);
              });
              addNewMembers(activeConvo, newMemberIds);
              dispatch(setHideAddMemberOverlay(true));
            }}
            className="bg-blue-500 hover:bg-blue-400 rounded-sm w-full p-3 text-xl shadow-md cursor-pointer font-semibold"
          >
            Add Users
          </button>
        </div>
      </div>
    </>
  );
}
