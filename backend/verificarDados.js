app.get('/verificar-integridade', async (req, res) => {
  try {
    const erros = [];

 
    // SQL será inserido aqui futuramente
    const horariosSemProfessor = await db.query(`
      -- TODO: Inserir SQL para buscar horários sem professor
      SELECT 'simulado' as id_horario -- substituir por query real
    `);
    if (horariosSemProfessor.rowCount > 0) {
      erros.push({
        tipo: 'horario_sem_professor',
        dados: horariosSemProfessor.rows,
      });
    }

 
    const disciplinasSemTurma = await db.query(`
      -- TODO: Inserir SQL para buscar disciplinas sem turma
      SELECT 'simulado' as id_disciplina -- substituir por query real
    `);
    if (disciplinasSemTurma.rowCount > 0) {
      erros.push({
        tipo: 'disciplina_sem_turma',
        dados: disciplinasSemTurma.rows,
      });
    }

   
    const conflitosHorarios = await db.query(`
      -- TODO: Inserir SQL para detectar conflitos de horários
      SELECT 'simulado1' as horario1, 'simulado2' as horario2, 'professor' as nome_professor
    `);
    if (conflitos.rowCount > 0) {
      erros.push({
        tipo: 'conflito_horario_professor',
        dados: conflitos.rows,
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
