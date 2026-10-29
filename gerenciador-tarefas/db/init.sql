CREATE TABLE IF NOT EXISTS tarefas (
  id            SERIAL PRIMARY KEY,
  responsavel   TEXT NOT NULL,
  assunto       TEXT NOT NULL,
  data_inicio   TIMESTAMP NOT NULL,
  data_termino  TIMESTAMP NOT NULL,
  descricao     TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'pendente'
                CHECK (status IN ('pendente', 'andamento', 'finalizado'))
);
