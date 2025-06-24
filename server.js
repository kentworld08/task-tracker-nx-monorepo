// server.js - Your Express Backend Application

// --- Module Imports ---
const express = require('express');
const cors = require('cors'); // Handles Cross-Origin Resource Sharing
const path = require('path'); // For working with file and directory paths
const fs = require('fs'); // Node.js File System module for reading/writing db.json

// --- Express App Initialization ---
const app = express();
// Use Render's provided PORT environment variable, or default to 3000 for local development
const port = process.env.PORT || 3000;

// --- Middleware Setup ---
// Enable CORS for all origins. This is essential for your frontend (React app)
// to make requests to this backend, especially when they are on different domains.
// In a production environment, you would typically restrict `origin` to your
// frontend's specific deployed URL for better security.
app.use(cors());

// Enable Express to parse JSON formatted request bodies.
// This is crucial for POST, PUT, and PATCH requests where the client
// sends JSON data (e.g., when adding a new task or updating reminder status).
app.use(express.json());

// --- Database Path Configuration ---
// Defines the path to your db.json file.
// __dirname refers to the directory where the current script (server.js) is located.
// This assumes db.json is in the same directory as server.js.
const dbPath = path.join(__dirname, 'db.json');

// --- API Routes Definition ---

// 1. GET /api/data
// Fetches all data from the db.json file. This endpoint returns the entire
// JSON object, including all top-level arrays like 'tasks' and 'users'.
app.get('/api/data', (req, res) => {
  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading db.json for /api/data:', err);
      // Respond with a 500 Internal Server Error if file reading fails
      return res
        .status(500)
        .json({ error: 'Failed to read data from database' });
    }
    try {
      // Parse the JSON string into a JavaScript object
      res.json(JSON.parse(data));
    } catch (parseError) {
      console.error('Error parsing db.json for /api/data:', parseError);
      // Respond with a 500 if JSON parsing fails (e.g., malformed JSON)
      return res
        .status(500)
        .json({ error: 'Database file is corrupted or malformed' });
    }
  });
});

// 2. GET /api/todos
// Fetches only the 'todos' array from the db.json file.
// This route assumes your db.json *might* contain a 'todos' array,
// separate from 'tasks'.
app.get('/api/todos', (req, res) => {
  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading db.json for /api/todos:', err);
      return res.status(500).json({ error: 'Failed to read todos data' });
    }
    try {
      const db = JSON.parse(data);
      // Return the 'todos' array, or an empty array if 'todos' key doesn't exist
      res.json(db.todos || []);
    } catch (parseError) {
      console.error('Error parsing db.json for /api/todos:', parseError);
      return res
        .status(500)
        .json({ error: 'Database file is corrupted or malformed' });
    }
  });
});

// 3. POST /api/todos
// Adds a new 'todo' item to the 'todos' array in db.json.
// This route is separate from tasks and expects a 'title' in the request body.
app.post('/api/todos', (req, res) => {
  const newTodo = req.body;
  // Basic validation for the new todo item
  if (!newTodo || !newTodo.title) {
    return res.status(400).json({ message: 'Todo must have a title.' });
  }

  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading db.json for POST /api/todos:', err);
      return res
        .status(500)
        .json({ error: 'Error processing todo creation request.' });
    }
    try {
      const db = JSON.parse(data);
      db.todos = db.todos || []; // Ensure 'todos' array exists

      // Simple ID generation (for real apps, use a database's ID generation)
      newTodo.id =
        db.todos.length > 0
          ? Math.max(...db.todos.map((t) => t.id || 0)) + 1
          : 1;
      db.todos.push(newTodo); // Add the new todo to the array

      fs.writeFile(dbPath, JSON.stringify(db, null, 2), 'utf8', (err) => {
        if (err) {
          console.error('Error writing to db.json for POST /api/todos:', err);
          return res.status(500).json({ error: 'Failed to save new todo.' });
        }
        // Respond with the newly created todo item and a 201 Created status
        res.status(201).json(newTodo);
      });
    } catch (parseError) {
      console.error('Error parsing db.json for POST /api/todos:', parseError);
      return res
        .status(500)
        .json({ error: 'Database file is corrupted or malformed' });
    }
  });
});

// 4. DELETE /api/tasks/:id
// Deletes a specific task from the 'tasks' array in db.json based on its ID.
app.delete('/api/tasks/:id', (req, res) => {
  const taskId = req.params.id; // Task ID (expected to be a string)

  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading db.json for DELETE /api/tasks:', err);
      return res
        .status(500)
        .json({ error: 'Failed to read data for deletion' });
    }
    let db;
    try {
      db = JSON.parse(data);
    } catch (parseError) {
      console.error('Error parsing db.json for DELETE /api/tasks:', parseError);
      return res
        .status(500)
        .json({ error: 'Database file is corrupted or malformed' });
    }

    // Ensure 'tasks' array exists and get its initial length
    const initialLength = db.tasks ? db.tasks.length : 0;
    // Filter out the task with the matching ID
    db.tasks = (db.tasks || []).filter((task) => task.id !== taskId);

    if (db.tasks.length === initialLength) {
      // If the array length didn't change, the task was not found
      return res
        .status(404)
        .json({ message: `Task with id ${taskId} not found` });
    }

    // Write the updated data (with the task removed) back to db.json
    fs.writeFile(dbPath, JSON.stringify(db, null, 2), 'utf8', (err) => {
      if (err) {
        console.error('Error writing to db.json after DELETE /api/tasks:', err);
        return res
          .status(500)
          .json({ error: 'Failed to save changes after deletion' });
      }
      // Respond with a success message
      res.json({ message: `Task with id ${taskId} deleted successfully` });
    });
  });
});

// 5. PATCH /api/tasks/:id
// Updates specific fields of a task in the 'tasks' array (e.g., toggling 'reminder').
app.patch('/api/tasks/:id', (req, res) => {
  const taskId = req.params.id;
  const updatedFields = req.body; // Expects an object like { reminder: true/false }

  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading db.json for PATCH /api/tasks:', err);
      return res.status(500).json({ error: 'Failed to read data for update' });
    }
    let db;
    try {
      db = JSON.parse(data);
    } catch (parseError) {
      console.error('Error parsing db.json for PATCH /api/tasks:', parseError);
      return res
        .status(500)
        .json({ error: 'Database file is corrupted or malformed' });
    }

    // Find the index of the task to be updated
    const taskIndex = (db.tasks || []).findIndex((task) => task.id === taskId);

    if (taskIndex === -1) {
      // If task not found, respond with 404 Not Found
      return res
        .status(404)
        .json({ message: `Task with id ${taskId} not found` });
    }

    // Update the task object with the new fields (using spread operator for merging)
    db.tasks[taskIndex] = { ...db.tasks[taskIndex], ...updatedFields };

    // Write the updated data back to db.json
    fs.writeFile(dbPath, JSON.stringify(db, null, 2), 'utf8', (err) => {
      if (err) {
        console.error('Error writing to db.json after PATCH /api/tasks:', err);
        return res
          .status(500)
          .json({ error: 'Failed to save changes after update' });
      }
      // Respond with the updated task object
      res.json(db.tasks[taskIndex]);
    });
  });
});

// --- Server Start ---
// Starts the Express server and listens for incoming requests on the specified port.
app.listen(port, () => {
  console.log(`Express server running on port ${port}`);
  console.log(`Access your API:`);
  console.log(`  - All data: http://localhost:${port}/api/data`);
  console.log(`  - Todos: http://localhost:${port}/api/todos`);
  console.log(
    `  - Tasks (for toggle/delete): http://localhost:${port}/api/tasks/:id`
  );
  // Note: These URLs are for local development. On Render, use your service's public URL.
});
