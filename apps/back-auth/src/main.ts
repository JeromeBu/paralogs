import { app } from "./adapters/primaries/express/server";

app.get("/api", (req, res) => {
  res.send({ message: "Welcome to back-auth!" });
});

const port = 4001;

const server = app.listen(port, () =>
  // eslint-disable-next-line no-console
  console.log(`--- Auth App is running on port: ${port} ---`),
);

server.on("error", console.error);
