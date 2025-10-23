<h2  align="center">AI Scribe notes API</h2>

<div  align="center">

Node.js/TypeScript REST API backend for the AI Scribe technical interview project. Manages clinical notes associated with patients, accepting text or audio input. Features AWS S3 audio storage, AI transcription (via Hugging Face), optional AI summarization (via Hugging Face BART), and PostgreSQL persistence using Prisma.

</div>

</div>

## 📋 <a  name="table">Content Table</a>

- l.⁠ ⁠[Technologies](#tech-stack)
- ll.⁠ ⁠[Start the app in local environment](#quick-start)
- lll. [Start the app with Docker](#font-extern)
- lV. [API Documentation](#api-documentation)

## <a  name="tech-stack">⚙ Technologies</a>

[![My Skills](https://skillicons.dev/icons?i=nodejs,typescript,express,postgres,prisma,docker,aws)](https://skillicons.dev)<br/>

## <a  name="quick-start">🤸 Start the app in local environment</a>

Follow these detailed steps to set up and run the backend application on your local machine for development.

1. **Prerequisites.**

Ensure you have the following software installed:

- Git: For cloning the repository. (https://github.com/FelipeCalderon17/LimeAI-Server.git)

- Node.js: I recommend version 18 or later. This includes npm.

- Docker Desktop: Required to run the PostgreSQL database container.

- AWS Account: Needed for S3 storage. You'll need:

  - An S3 Bucket.

  - An IAM User with programmatic access keys (Access Key ID & Secret Access Key) and permissions to PutObject in your bucket.

- Hugging Face Account: Needed for the free AI services. You'll need:

  - An Access Token with read permissions.

2. **Clone the Repository.**

```bash
	git clone  https://github.com/FelipeCalderon17/LimeAI-Server.git
```

3. **Install Dependencies.**

```bash
	npm install
```

4. **Configure Environment Variables.**

This is a very important step to connect the application to the database, AWS, and Hugging Face.

- Create `.env` file in the root directory (LimeAI-Server/), duplicate the example file

- Edit `.env` open the newly created `.env` file with a text editor and fill in all the required values.

5. **Start the Database Container.**

Make sure Docker Desktop is running. Then, in your terminal (at the project root), start the PostgreSQL database and Adminer (database viewer) using Docker Compose:

```bash
	docker-compose up -d
```

You can access the database viewer (Adminer) at http://localhost:8080 to inspect the database. Use the credentials from your DATABASE_URL (server: postgres-db, user: myuser, pass: mypassword, db: aiscribe_db).

6. **Start the Database and seed.**

With the database container running, apply the database schema and add initial data:

- **Run migrations:**

```bash
	npx prisma generate
```

```bash
	npx prisma migrate dev
```

When you run the commands above it will create the database and seed it, if by any reason the database is not seeded you can run the command below.

- **Seed data:**

```bash
	npx prisma db seed
```

7. **Run the Application.**

Finally, start the backend server in development mode:

```bash
	npm run dev
```

The API server will start, typically on http://localhost:3500 (or the PORT specified in your `.env`). You'll see logs in the console, and it will automatically restart if you make changes to the TypeScript files.

## <a  name="font-extern">🐳 Start the app with Docker</a>

This is the recommended way to run the application. This method uses Docker Compose to build and run the API, the PostgreSQL database, and a database viewer (Adminer) in isolated containers.

This approach does not require you to install Node.js, npm, or PostgreSQL on your local machine.

1. Prerequisites

Ensure you have the following software installed and running:

- Git: To clone the repository.

- Docker Desktop: This is essential. Make sure it is installed and running before you proceed.

2. **Clone the Repository.**

```bash
	git clone  https://github.com/FelipeCalderon17/LimeAI-Server.git
```

3. **Configure Environment Variables.**

This is a crucial step. The Docker setup uses a separate environment file (`.env.docker`) to avoid conflicts with any local `.env` file you might have.

- Create a new file named `.env.docker` in the project's root directory (You can see the structure of the file and the variables needed in the `.env.example` file).

4. **Build and Run the Containers.**

With Docker Desktop running, open your terminal in the project root and run this single command:

```bash
	docker compose up -d --build
```

--build: This tells Docker Compose to build your api image from the Dockerfile. You only need to use this the first time or after you make changes to the application code (e.g., in app/src/).

If you did not made any changes after you build you can start the containers without --build.

```bash
	docker compose up -d
```

5. **Build and Run the Containers.**

You're all set! The entire system is now online.

- API Server: The API is available and listening at http://localhost:3500
- Database Viewer (Adminer): You can inspect your database by visiting http://localhost:8080

To log into Adminer, use the database credentials (defined in `docker-compose.yml`):

- **System**: PostgreSQL

- **Server**: postgres-db (Note: not localhost)

- **Username**: myuser

- **Password**: mypassword

- **Database**: aiscribe_db

If you want to stop the containers from running you can just use the command:

```bash
	docker compose down
```

## <a  name="api-documentation">📄 API Documentation</a>

After you have your server running locally or in Docker you can go to the URL `http://localhost:3500/api-docs` in your web browser to see the API Documentation.

##

<img  src="https://img.shields.io/badge/-Node.js-black?style=for-the-badge&logoColor=white&logo=node.js&color=339933"  alt="node.js"  />
<img  src="https://img.shields.io/badge/-Express-black?style=for-the-badge&logoColor=white&logo=express&color=000000"  alt="express"  />
<img  src="https://img.shields.io/badge/-Prisma-black?style=for-the-badge&logoColor=white&logo=prisma&color=2D3748"  alt="express"  />
<img src="https://img.shields.io/badge/-TypeScript-black?style=for-the-badge&logoColor=white&logo=typescript&color=3178C6" alt="typescript" />
<img src="https://img.shields.io/badge/-PostgreSQL-black?style=for-the-badge&logoColor=white&logo=postgresql&color=4169E1" alt="postgresql" />
<img src="https://img.shields.io/badge/-Docker-black?style=for-the-badge&logoColor=white&logo=docker&color=2496ED" alt="docker" />
<img src="https://img.shields.io/badge/-Hugging%20Face-black?style=for-the-badge&logoColor=white&logo=huggingface&color=FFD21E" alt="Hugging Face" />
