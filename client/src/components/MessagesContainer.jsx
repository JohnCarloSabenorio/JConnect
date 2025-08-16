import { useSelector } from "react-redux";
import Message from "./Message";
export default function MessagesContainer({ uiChatRef }) {
  const { displayedMessages, messageIsLoading } = useSelector(
    (state) => state.message
  );
  return messageIsLoading ? (
    <div
      className={`w-full h-full bg-gray-50 flex justify-center items-center`}
    >
      <img src="img/loading.gif" className="w-20 h-20"></img>
    </div>
  ) : (
    displayedMessages?.map((message, i) => {
      let blobUrls = [];
      if (message.images64) {
        message.images64.forEach((base64, idx) => {
          const blob = base64ToBlob(base64);

          if (blob) {
            blobUrls.push(URL.createObjectURL(blob));
          }
        });
      }

      return (
        <Message
          key={message._id}
          imgUrl="img/icons/male-default.jpg"
          messageData={message}
          imagesSent={blobUrls}
          uiChatRef={uiChatRef}
        />
      );
    })
  );
}
