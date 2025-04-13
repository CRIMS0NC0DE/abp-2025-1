module.exports = (app, db) => {
app.get('/verificar-integridade', async (req, res) => {
  try {
    const erros = [];

 
    // SQL será inserido aqui futuramente
    const horariosSemProfessor = await db.query(`
        SELECT id_professor FROM alocacao_horario WHERE id_professor IS NULL
    `);
    if (horariosSemProfessor.rowCount > 0) {
      erros.push({
        tipo: 'horario_sem_professor',
        dados: horariosSemProfessor.rows,
      });
    }

 
    const disciplinasSemTurma = await db.query(`
        SELECT id_turma FROM disciplina_turma WHERE id_turma IS NULL
    `);
    if (disciplinasSemTurma.rowCount > 0) {
      erros.push({
        tipo: 'disciplina_sem_turma',
        dados: disciplinasSemTurma.rows,
      });
    }

   
    const conflitosHorarios = await db.query(`
        SELECT 
          h1.id_alocacao AS alocacao_1,
          h2.id_alocacao AS alocacao_2,
          a1.id_professor,
          h1.dia_semana,
          h1.hora_inicio AS inicio_1,
          h1.hora_fim AS fim_1,
          h2.hora_inicio AS inicio_2,
          h2.hora_fim AS fim_2
        FROM 
          Horario h1
        JOIN 
          Alocacao_Horario a1 ON h1.id_alocacao = a1.id_alocacao
        JOIN 
          Horario h2 ON h1.id_horario < h2.id_horario
        JOIN 
          Alocacao_Horario a2 ON h2.id_alocacao = a2.id_alocacao
        WHERE 
          a1.id_professor = a2.id_professor
          AND h1.dia_semana = h2.dia_semana
          AND h1.hora_inicio < h2.hora_fim
          AND h1.hora_fim > h2.hora_inicio;
    `);
      if (conflitosHorarios.rowCount > 0) {
      erros.push({
        tipo: 'conflito_horario_professor',
          dados: conflitosHorarios.rows,
      });
    }

    // Se nenhum erro for encontrado
    if (erros.length === 0) {
      return res.json({ status: 'ok', mensagem: 'Nenhum problema encontrado ' });
    }

    // Retorna os erros encontrados
    res.json({ status: 'problemas_encontrados', erros });

  } catch (err) {
    console.error('Erro ao verificar integridade:', err);
    res.status(500).json({ erro: 'Erro ao verificar integridade dos dados' });
  }
});
}
