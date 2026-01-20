const fastify = require('fastify')({ logger: true });

const cors = require('@fastify/cors');
const formbody = require('@fastify/formbody');
const db = require('./db');

// Register plugins ONCE
fastify.register(cors, {
  origin: ['http://127.0.0.1:5500', 'http://localhost:5500'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
});

fastify.register(formbody);

// Health check
fastify.get('/', async () => {
  return { message: 'Task Manager API Running' };
});
// DB test
fastify.get('/db-test', async () => {
  const [rows] = await db.query('SELECT 1');
  return { message: 'MySQL connected successfully' };
});

// POST - Add task (MySQL)
fastify.post('/tasks', async (req, reply) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return reply.code(400).send({ message: 'Title and description required' });
  }

  const [result] = await db.query(
    'INSERT INTO tasks (title, description) VALUES (?, ?)',
    [title, description]
  );

  return { id: result.insertId, title, description };
});

// GET - All tasks (MySQL)
fastify.get('/tasks', async () => {
  const [rows] = await db.query(
    'SELECT * FROM tasks ORDER BY created_at DESC'
  );
  return rows;
});


// PUT - Update task (MySQL)
fastify.put('/tasks/:id', async (req, reply) => {
  const { id } = req.params;
  const { title, description } = req.body;

  await db.query(
    'UPDATE tasks SET title=?, description=? WHERE id=?',
    [title, description, id]
  );

  return { message: 'Task updated' };
});

// DELETE - Remove task (MySQL)
fastify.delete('/tasks/:id', async (req, reply) => {
  const { id } = req.params;

  await db.query('DELETE FROM tasks WHERE id=?', [id]);

  return { message: 'Task deleted' };
});

// Start server
fastify.listen({ port: 3000, host: '127.0.0.1' }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server running at ${address}`);
});
