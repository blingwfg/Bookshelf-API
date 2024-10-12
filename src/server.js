const Hapi = require("@hapi/hapi");
const route = require("./route");
const init = async () => {
  const server = Hapi.Server({
    port: 9000,
    host: "localhost",
  });
  server.route(route);
  await server.start();
  console.log(`server berjalan di ${server.info.uri}`);
};

init();
