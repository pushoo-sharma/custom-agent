// Import required dependencies
import { db } from "./db/index.js"; // Ensure proper database setup
import { todos as todosTable } from "./db/schema.js"; // Import todos table schema
import { ilike } from "drizzle-orm/expressions"; // For case-insensitive search
import OpenAI from "openai"; // OpenAI library for AI-powered interactions
import readLineSync from "readline-sync"; // Synchronous readline for user input

const client = new OpenAI(); // Initialize OpenAI client

// Fetch all todos (Read)
export async function getAllTodos() {
  return await db.select().from(todosTable);
}

// Create a new todo (Create)
export async function createTodo(todo) {
  const [td] = await db
    .insert(todosTable)
    .values({ todo })
    .returning({ id: todosTable.id });
  return td.id;
}

// Update an existing todo (Update)
export async function updateTodo(id, updatedTodo) {
  return await db
    .update(todosTable)
    .set({ todo: updatedTodo })
    .where(todosTable.id.eq(id));
}

// Delete a todo by ID (Delete)
export async function deleteTodo(id) {
  return await db.delete(todosTable).where(todosTable.id.eq(id));
}

// Search for todos by a keyword (Read with filter)
export async function searchTodo(search) {
  return await db
    .select()
    .from(todosTable)
    .where(ilike(todosTable.todo, `%${search}%`));
}

// Define tools with all operations
const tools = {
  getAllTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  searchTodo,
};

// Define the system prompt for the AI Assistant
const SYSTEM_PROMPT = `
You are an AI To-Do List Assistant. Your role is to help users manage tasks by adding, viewing, updating, or deleting them.
You must strictly follow this JSON output format:

You are an AI To-Do List Assistant that operates using the following states: START, PLAN, ACTION, OBSERVATION, and OUTPUT.

Wait for the user prompt to initiate.
First, create a PLAN using the available tools based on the user's request.
After planning, execute the ACTION with the appropriate tools and wait for the OBSERVATION (results or feedback from the action taken).
Once you receive the observations, generate the AI response in the OUTPUT state, ensuring it aligns with the initial START prompt and the observations.

TODO Database Schema:
- id: Integer, primary key.
- todo: String, description of the task.
- created_at: DateTime, timestamp when the task was created.
- updated_at: DateTime, timestamp when the task was last updated.

Available Tools:
1. getAllTodos():
   - Description: Returns all tasks from the database.
   - Usage: No parameters required.

2. createTodo (todo: string):
   - Description: Adds a new task to the database.
   - Parameters:
     - todo: A string describing the task.

3. updateTodo (id: string, updatedTodo: string):
   - Description: Updates the description of a task based on its ID.
   - Parameters:
     - id: The unique identifier of the task.
     - updatedTodo: The new description for the task.

4. deleteTodoById (id: string):
   - Description: Deletes a task by its ID.
   - Parameters:
     - id: The unique identifier of the task.

5. searchTodo (query: string):
   - Description: Searches for tasks containing the given keyword or phrase.
   - Parameters:
     - query: A string to search for in task descriptions.

JSON Output Guidelines:
- Always respond in the following format:
{
  "action": "action_type",
  "data": {
    "key": "value"
  }
}

EXAMPLE 

{ "type": "user", "user": "Add a task for shopping groceries." }
{ "type": "plan", "plan": "I will try to get more context on what user needs to shop." }
{ "type": "output", "output": "Can you tell me what all items you want to shop for?" }
{ "type": "user", "user": "I want to shop for milk, kurkure, lays and choco." }
{ "type": "plan", "plan": "I will use createTodo to create a new Todo in DB." }
{ "type": "action", "function": "createTodo", "input": "Shopping for milk, kurkure, lays and choco."}
{ "type": "observation", "observation": "2" }
{ "type": "output", "output": "Your todo has been added successfully" }
`;

// Messages array to manage AI conversation history
const messages = [{ role: "system", content: SYSTEM_PROMPT }];

while (true) {
  // Get user input
  const query = readLineSync.question(">> ");
  const userMessage = { type: "user", user: query };

  // Push user input to conversation
  messages.push({ role: "user", content: JSON.stringify(userMessage) });

  while (true) {
    // Send conversation to OpenAI for processing
    const chat = await client.chat.completions.create({
      model: "gpt-4o", // Specify the model
      messages,
    });

    // Parse AI response
    const result = JSON.parse(chat.choices[0].message.content);

    // Push user input to conversation
    messages.push({ role: "assistant", content: JSON.stringify(result) });

    const action = result;

    // Handle AI output
    if (action.type === "output") {
      console.log(`🚀 Output: ${action.output}`);
      break; // Exit loop after output is generated
    } else if (action.type === "action") {
      // Perform the requested action
      const fn = tools[action.function];
      if (!fn) throw new Error("Invalid Tool Call");

      // Execute tool function and prepare observation message
      const observation = await fn(action.input);
      const observationMessage = {
        type: "observation",
        observation,
      };

      // Push observation to conversation
      messages.push({
        role: "developer",
        content: JSON.stringify(observationMessage),
      });
    }
  }
}
