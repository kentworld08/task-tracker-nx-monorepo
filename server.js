// server.js
const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('server.json');
const middlewares = jsonServer.defaults();

const cors = require('cors');
server.use(cors()); // ✅ Enable CORS
server.use(middlewares);
server.use(router);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`);
});
