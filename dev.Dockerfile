FROM node:14

WORKDIR /paralogs

COPY package.json .
COPY package-lock.json .

RUN npm ci

COPY tsconfig.json .
COPY nx.json .
COPY workspace.json .
COPY .eslintrc .
COPY jest.config.js .
COPY .env .
COPY ./apps ./apps/
COPY ./libs ./libs/

