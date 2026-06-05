CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  dni VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  signature VARCHAR(100) NOT NULL,
  role VARCHAR(30) NOT NULL
);

CREATE TABLE IF NOT EXISTS proposals (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'En revisión',
  votes INTEGER NOT NULL DEFAULT 0,
  author_dni VARCHAR(20) NOT NULL,
  attachments JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS comments (
  id SERIAL PRIMARY KEY,
  proposal_id INTEGER NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
  author_dni VARCHAR(20) NOT NULL,
  message TEXT NOT NULL,
  private BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS supports (
  id SERIAL PRIMARY KEY,
  proposal_id INTEGER NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
  supporter_dni VARCHAR(20) NOT NULL,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
  UNIQUE (proposal_id, supporter_dni)
);

INSERT INTO users (dni, name, signature, role)
VALUES
  ('12345678', 'Ciudadano Demo', 'firma123', 'ciudadano'),
  ('87654321', 'Colectivo Civil', 'firma456', 'colectivo');

INSERT INTO proposals (title, summary, status, votes, author_dni, attachments)
VALUES
  ('Parques públicos para todos', 'Crear más espacios verdes y mejorar la iluminación en los parques de la ciudad.', 'En revisión', 128, '12345678', '[]'::jsonb),
  ('Transporte sostenible', 'Aumentar la frecuencia de transporte público eléctrico y bicicletas compartidas.', 'Aprobada', 98, '87654321', '[]'::jsonb);

INSERT INTO comments (proposal_id, author_dni, message, private)
VALUES
  (1, '12345678', 'Me gusta esta idea para el barrio.', true),
  (2, '87654321', 'Sería bueno incorporar más rutas nocturnas.', true);

INSERT INTO supports (proposal_id, supporter_dni)
VALUES
  (1, '12345678'),
  (2, '12345678');
