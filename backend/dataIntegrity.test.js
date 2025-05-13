const { Client } = require("pg");
require("dotenv").config({ path: "../.env" });

const db = new Client({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

beforeAll(() => db.connect());
afterAll(() => db.end());

// TESTE 1: Todos os horários devem estar vinculados a um professor
test("Todos os horários devem estar vinculados a um professor", async () => {
  const res = await db.query(`
    SELECT id_horario
    FROM horarios
    WHERE id_professor IS NULL
  `);
  expect(res.rowCount).toBe(0);
});

// TESTE 2: Disciplinas devem estar vinculadas a pelo menos uma turma
test("Todas as disciplinas devem estar associadas a alguma turma", async () => {
  const res = await db.query(`
    SELECT d.id_disciplina
    FROM disciplinas d
    LEFT JOIN turma_disciplina td ON d.id_disciplina = td.id_disciplina
    WHERE td.id_turma IS NULL
  `);
  expect(res.rowCount).toBe(0);
});

// TESTE 3: Campo 'horario' deve estar no formato válido (ex: '08:00-09:50')
test("Horário deve estar no formato válido HH:MM-HH:MM", async () => {
  const res = await db.query(`
    SELECT id_horario, horario
    FROM horarios
    WHERE horario !~ '^[0-9]{2}:[0-9]{2}-[0-9]{2}:[0-9]{2}$'
  `);
  expect(res.rowCount).toBe(0);
});

// TESTE 4: Professores não devem ter conflitos de horário no mesmo dia
test("Professores não devem ter conflitos de horário no mesmo dia", async () => {
  const res = await db.query(`
    SELECT h1.id_horario, h2.id_horario, h1.id_professor
    FROM horarios h1
    JOIN horarios h2 ON h1.id_professor = h2.id_professor AND h1.id_horario < h2.id_horario
    WHERE h1.dia_semana = h2.dia_semana
      AND h1.horario IS NOT NULL AND h2.horario IS NOT NULL
      AND substring(h1.horario FROM 1 FOR 5) < substring(h2.horario FROM 9 FOR 5)
      AND substring(h1.horario FROM 9 FOR 5) > substring(h2.horario FROM 1 FOR 5)
  `);
  expect(res.rowCount).toBe(0);
});
