const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://tarefas:tarefas@127.0.0.1:5434/tarefas'
});

module.exports = pool;
