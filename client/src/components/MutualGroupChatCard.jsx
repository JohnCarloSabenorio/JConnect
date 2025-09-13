export default function MutualGroupChatCard({ groupData }) {
  return (
    <div className="flex gap-3 items-center">
      <img src="/img/avatar.png" className="w-12" alt="profile-img" />
      <p>{groupData.conversationName}</p>
    </div>
  );
}
