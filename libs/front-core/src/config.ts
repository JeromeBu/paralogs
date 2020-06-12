import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

const environment = process.env.REACT_APP_ENVIRONEMENT;

type ConfigShape = { authUrl: string; logbookUrl: string };

const buildConfig = (): ConfigShape => {
  switch (environment) {
    case "production":
      return {
        logbookUrl:
          "https://s8splmzrh5.execute-api.eu-west-1.amazonaws.com/production",
        authUrl: "AUTH_PROD_URL_TO_DEPLOY",
      };
    case "staging":
      return {
        logbookUrl:
          "https://r3su0zwym6.execute-api.eu-west-1.amazonaws.com/staging",
        authUrl: "AUTH_STAGING_URL_TO_DEPLOY",
      };
    default:
      return {
        logbookUrl: "http://localhost:4000",
        authUrl: "http://localhost:4001",
      };
  }
};

export const config = buildConfig();
