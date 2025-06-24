// server.js
const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('server.json');
const middlewares = jsonServer.defaults();

const cors = require('cors');
server.use(cors()); // ✅ This correctly enables CORS
server.use(middlewares);
server.use(router);

// IMPORTANT: Use the PORT environment variable provided by Render
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`);
});
