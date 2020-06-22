FROM node:12

WORKDIR /paralogs

COPY package.json .
COPY package-lock.json .

RUN npm ci

COPY tsconfig.json .
COPY nx.json .
COPY workspace.json .
COPY .eslintrc .
COPY jest.config.js .
COPY ./.git ./.git/
COPY ./apps ./apps/
COPY ./libs ./libs/

CMD ["npm", "run", "serve:auth"]
