import 'dotenv/config'; // Load environment variables from .env file
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  // Output directory for generated files
  out: './drizzle', // Set your output directory where Drizzle will generate migration files
  
  // Schema: You can define the path to your schema files here
  schema: './db/schema.js', // Path to your schema definition files (adjust as needed)
  
  // Dialect: Define the database dialect, in this case, PostgreSQL
  dialect: 'postgresql', // Set the database dialect to PostgreSQL

  // Database credentials: Define your database connection here
  dbCred: {
    url: process.env.DATABASE_URL
  },
});
