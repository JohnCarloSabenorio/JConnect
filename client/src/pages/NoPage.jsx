export default function NoPage() {
  return (
    <>
      <div className="bg-[url(/images/backgrounds/auth-bg.jpg)] bg-no-repeat bg-cover bg-right-bottom flex flex-col items-center justify-center h-screen">
        <div className="flex flex-col w-full bg-gray-50 md:w-xl lg:flex-row rounded-lg overflow-hidden justify-center items-center border-black shadow-2xl p-3">
          <h1 className="text-5xl font-bold text-red-500">Not Found</h1>
        </div>
      </div>
    </>
  );
}
