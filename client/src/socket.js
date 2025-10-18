const serverHost = import.meta.env.VITE_SERVER_HOST;
const localServer = import.meta.env.VITE_LOCAL_SERVER;
const viteEnv = import.meta.env.VITE_ENV;

const URL = viteEnv === "production" ? serverHost : localServer;

export const socket = io(URL, {
  autoConnect: false,
});

socket.on("connect_error", (err) => {
  // the reason of the error, for example "xhr poll error"
  console.log(err.message);

  // some additional description, for example the status code of the initial HTTP response
  console.log(err.description);

  // some additional context, for example the XMLHttpRequest object
  console.log(err.context);
});
