const SocketIO = require("socket.io");

const onlineMap = {};
module.exports = (server, app) => {
  const io = SocketIO(server, {
    path: "/socket.io",
  });

  app.set("io", io);
};
