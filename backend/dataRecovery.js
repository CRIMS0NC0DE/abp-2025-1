// Rota de recuperação de dados dos horários

module.exports = (app, db) => {
  app.get("/horarios", async (req, res) => {
    const { curso, periodo, semestre } = req.query;

    try {
      const query = `
        SELECT 
          h.id_horario,
          h.dia_semana,
          h.horario,
          t.nome AS turma,
          d.nome AS disciplina,
          p.nome AS professor
        FROM horarios h
        JOIN turmas t ON h.id_turma = t.id_turma
        JOIN disciplinas d ON h.id_disciplina = d.id_disciplina
        JOIN professores p ON h.id_professor = p.id_professor
        JOIN semestres s ON t.id_semestre = s.id_semestre
        JOIN cursos c ON t.id_curso = c.id_curso
        WHERE c.nome = $1 AND s.periodo = $2 AND s.numero = $3
      `;

      const result = await db.query(query, [curso, periodo, semestre]);
      res.json(result.rows);
    } catch (err) {
      console.error("❌ Erro ao recuperar dados:", err);
      res.status(500).json({ erro: "Erro ao recuperar dados do banco" });
    }
  });
};
