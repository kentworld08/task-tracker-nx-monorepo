// In your project's root: server.js

const express = require('express');
const cors = require('cors'); // Required for frontend-backend communication if they are on different domains
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000; // Use Render's PORT env var, or 3000 for local testing

// --- MIDDLEWARE ---
// Enable CORS for all origins. This is crucial for your frontend to talk to your backend.
// For production, you might want to restrict 'origin' to your frontend's URL.
app.use(cors());

// Parse JSON request bodies (for POST, PUT requests)
app.use(express.json());

// --- API ROUTES ---
const dbPath = path.join(__dirname, 'db.json'); // Path to your data file

// Route to get all data (e.g., from your db.json)
app.get('/api/data', (req, res) => {
  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading db.json:', err);
      return res.status(500).send('Error reading data');
    }
    res.json(JSON.parse(data));
  });
});

// Example: Route to get a specific collection (e.g., /api/todos)
app.get('/api/todos', (req, res) => {
  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading db.json:', err);
      return res.status(500).send('Error reading todos');
    }
    const db = JSON.parse(data);
    res.json(db.todos || []); // Return the 'todos' array, or empty if not found
  });
});

// Example: Route to add a new todo (POST request)
app.post('/api/todos', (req, res) => {
  const newTodo = req.body;
  // Basic validation: Check if newTodo has a title
  if (!newTodo || !newTodo.title) {
    return res.status(400).send('Todo must have a title.');
  }

  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading db.json for POST:', err);
      return res.status(500).send('Error processing request.');
    }
    const db = JSON.parse(data);
    db.todos = db.todos || []; // Ensure todos array exists

    // Simple ID generation (in a real app, use a DB for this)
    newTodo.id =
      db.todos.length > 0 ? Math.max(...db.todos.map((t) => t.id || 0)) + 1 : 1;
    db.todos.push(newTodo); // Add new todo to the array

    fs.writeFile(dbPath, JSON.stringify(db, null, 2), 'utf8', (err) => {
      if (err) {
        console.error('Error writing to db.json for POST:', err);
        return res.status(500).send('Error saving data.');
      }
      res.status(201).json(newTodo); // Respond with the newly created todo
    });
  });
});

// --- START THE SERVER ---
app.listen(port, () => {
  console.log(`Express server running on port ${port}`);
  console.log(
    `Access your API (e.g., for todos) at http://localhost:${port}/api/todos`
  );
});
