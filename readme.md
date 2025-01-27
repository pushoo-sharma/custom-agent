# Custom Agent

This project is a Node.js-based custom agent that integrates with OpenAI's GPT API to provide a to-do list management assistant. It uses Drizzle ORM for database operations and PostgreSQL as the database. The assistant supports CRUD operations and AI-powered interactions for task management.

![Alt text](assets/images/1.png "Optional title")

## Features

- **Add, View, Update, Delete, and Search To-Do Items**  
  Manage your tasks with CRUD operations for effective task management.

- **AI-Assisted Task Management Using OpenAI's API**  
  Leverage AI for intelligent task planning and management.

- **PostgreSQL Integration with Drizzle ORM**  
  Utilize a lightweight and efficient ORM for seamless database operations.

- **Dockerized Setup for Easy Deployment**  
  Simplify deployment and configuration with Docker Compose.

![Alt text](assets/images/2.png "Optional title")
![Alt text](assets/images/3.png "Optional title")
![Alt text](assets/images/4.png "Optional title")
![Alt text](assets/images/5.png "Optional title")

---

## Prerequisites

Ensure you have the following installed:

- Node.js (v16+)
- Docker and Docker Compose
- PostgreSQL (Docker image provided)

---

## Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd <repository-directory>
```


### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
```bash
DATABASE_URL=postgresql://myuser:mypassword@localhost:5432/myexpense
OPENAI_API_KEY=your-openai-api-key
```
---

## Database Setup

### 1. Start PostgreSQL
Use Docker Compose to start the PostgreSQL database:
```bash
docker-compose up -d
```


### 2. Generate and Apply Migrations
```bash
npm run generate
npm run migrate
```

## License

[MIT](https://choosealicense.com/licenses/mit/)