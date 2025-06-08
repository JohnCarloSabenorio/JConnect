export default function NotificationCard({ data }) {
  return (
    <>
      <div className="p-3 text-left gap-5 flex justify-between hover:bg-blue-500 hover:text-white align-middle">
        <img src="img/avatar.png" className="w-10 h-10"></img>
        <div className="w-full">
          <p>{data.message}</p>
        </div>
        <div className="align-middle flex flex-col justify-center">
          {!data.seen && (
            <div className="rounded-full w-3 h-3 bg-blue-400 mb-4"></div>
          )}
        </div>
      </div>
    </>
  );
}
