export default function NotificationCard({ message }) {
  return (
    <>
      <div className="p-3 text-left gap-5 flex justify-between hover:bg-blue-500 hover:text-white">
        <img src="img/avatar.png" className="w-10 h-10"></img>
        <div className="w-full">
          <p>{message}</p>
        </div>
      </div>
    </>
  );
}
