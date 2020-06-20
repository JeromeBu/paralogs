import { app } from "./adapters/primaries/express/server";

const port = 4000;

const server = app.listen(port, () =>
  // eslint-disable-next-line no-console
  console.log(`--- Logbook App is running on port: ${port} ---`),
);

server.on("error", console.error);
