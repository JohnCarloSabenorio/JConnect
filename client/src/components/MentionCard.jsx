import { setIsMentioning, addToMention } from "../redux/conversation";
import { useDispatch } from "react-redux";
export default function MentionCard({ member, inputRef }) {
  const dispatch = useDispatch();

  function addElement(text) {
    const el = inputRef.current;
    if (!el) return;

    // Remove the "@" trigger character if needed
    removeLastCharacter();

    const mentionSpan = document.createElement("span");
    mentionSpan.textContent = `@${text}`;
    mentionSpan.className = "mention-span";
    mentionSpan.dataset.memberId = member._id;
    mentionSpan.dataset.username = member.username;
    // Append the mention span
    el.appendChild(mentionSpan);
    const blankSpan = document.createElement("span");
    blankSpan.textContent = "\u00A0";
    el.appendChild(blankSpan);

    // Set caret position
    // Check if the current node is a mention span
    const selection = window.getSelection();

    const range = document.createRange();

    range.setStart(blankSpan, 0);
    range.setEnd(blankSpan, blankSpan.textContent.length);
    range.collapse(false);

    selection.removeAllRanges();

    selection.addRange(range);

    el.focus();
  }

  function removeLastCharacter() {
    // create a variable for the inputRef
    const el = inputRef.current;

    // check if the inputRef does not exist
    if (!el) return;

    // create a variable for the childNodes
    const elChildNodes = el.childNodes;

    // check if there are no child nodes
    if (!elChildNodes.length) return;

    // get the last node
    const lastNode = elChildNodes[elChildNodes.length - 1];

    // check if the last node is a TEXT_NODE and remove the last character
    if (
      lastNode.nodeType == Node.TEXT_NODE ||
      lastNode.nodeType == Node.ELEMENT_NODE
    ) {
      lastNode.textContent = lastNode.textContent.slice(0, -1);
    }
  }

  function handleClick() {
    addElement(member.username);
    dispatch(setIsMentioning(false));
    dispatch(addToMention(member._id));
  }

  return (
    <>
      <div
        id={`mention_${member._id}`}
        className={`flex justify-between p-1 cursor-pointer items-center gap-5 w-full hover:bg-gray-200`}
        onClick={(e) => handleClick()}
      >
        <div className="flex items-center gap-5">
          {/* Profile Image */}
          <img src={member.profilePictureUrl} className="w-13 h-13"></img>

          {/* Text */}
          <p>{member.username}</p>
        </div>
      </div>
    </>
  );
}
