# RPIStudyRooms

## How to Setup

1. Clone the repository to your local machine (`git clone https://github.com/d1ngusb1l/RPIStudyRooms.git`) and navigate to the project directory (`cd rpistudyrooms`).
2. Copy `.env.sample` to `.env` (`cp .env.sample .env`) [on windows do `copy .env.sample .env`]. 
3. Run `docker compose up -d` to start the development server.

## Setting up React Components

1. `cd frontend`
2. `npm install`

## How to Update Dependencies

Every time you `npm install` in either the frontend or backend, you need to run `docker compose up --build -d` to rebuild the Docker containers.

## How to Migrate Database

Run `npm install` followed by `npx prisma migrate dev --name <migration-name>` to create a new migration. Then run `npx prisma migrate deploy` to apply the migration to the database (also do this to init the prisma files on first clone).

## General layout of the code
* Frontend stuff is found in ./frontend/src
* backend stuff is found in ./src/app.ts for general logic and ./src/db.ts for sql stuff
* postgresql stuff is found in ./prisma, prisma is a tool that makes working with sql easier

## Miscellaneous stuff
* you need to install node.js and docker
* npm is a command line function that comes with node and lets you install other packages such as react which helps with front end
* you do not need to install anything postgresql or prisma related, all installed through docker commands
* rather than modifying the html/css directly we use the React library for node.js to let us dynamically update stuff

## Useful links for getting familiar with our tech stack
* https://react.dev/learn 
* https://www.prisma.io/docs/orm/overview/introduction/what-is-prisma 
