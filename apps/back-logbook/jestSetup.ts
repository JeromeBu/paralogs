const setup = () => {
  process.env.NODE_ENV = "test";
  console.log("Starting test: NODE_ENV", process.env.NODE_ENV);
};

export default setup;
