# DOMMA Backend

This is a Node.js backend project using **TypeScript**, **Hapi.js**, and **Prisma ORM**. Follow the steps below to get started.

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/domma-app/backend.git
cd backend
```

### 2. Create a `.env` File

Create a `.env` file in the root directory. You can use `.env.example` as a reference if provided.

```bash
cp .env.example .env
```

Update the environment variables as needed (e.g., database URL, API keys, etc).

### 3. Install Dependencies

```bash
npm install
```

### 4. Set Up the Database

Make sure your database is running and configured in the `.env` file.

#### Run Prisma Migrations

```bash
npm run prisma:migrate
```

#### (Optional) Seed the Database

```bash
npm run prisma:seed
```

#### Generate Prisma Client

```bash
npm run prisma:generate
```

### 5. Start the Development Server

```bash
npm run dev
```

The server should now be running on your configured port (e.g., `http://localhost:5000`).

---

## 📦 Tech Stack

- **Node.js**
- **TypeScript**
- **Hapi.js**
- **Prisma ORM**
- **PostgreSQL**
