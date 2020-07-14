import { configureServer } from "./express/server";

const port = 4001;

configureServer().then((app) => {
  const server = app.listen(port, () =>
    // eslint-disable-next-line no-console
    console.log(`--- Auth App is running on port: ${port} ---`),
  );

  server.on("error", console.error);
});
