const setup = async () => {
  process.env.NODE_ENV = "test";
  console.log("Starting auth test: NODE_ENV", process.env.NODE_ENV);
};

export default setup;
