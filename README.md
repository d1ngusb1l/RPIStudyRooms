# RPIStudyRooms

## How to Setup

1. Clone the repository to your local machine (`git clone https://github.com/d1ngusb1l/RPIStudyRooms.git`) and navigate to the project directory (`cd rpistudyrooms`).
2. Copy `.env.sample` to `.env` (`cp .env.sample .env`).
3. Run `docker compose up -d` to start the development server.

## How to Update Dependencies

Every time you `npm install` in either the frontend or backend, you need to run `docker compose up --build -d` to rebuild the Docker containers.

## How to Migrate Database

Run `npm install` followed by `npx prisma migrate dev --name <migration-name>` to create a new migration. Then run `npx prisma migrate deploy` to apply the migration to the database.
