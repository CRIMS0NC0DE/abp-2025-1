// importa a biblioteca pg
const {Client} = require('pg')

// configurando o banco de dados
const client = new Client({
    user: "postgres" ,
    host: "localhost" ,
    database: "teste" ,
    password: "1234" ,
    port: 5432
});

// conectar ao banco de dados
client.connect()
    .then(()=>console.log('✅Conectado ao postgreSQL'))
    .catch(err=>console.log('Erro ao conectar:', err.stack));
    // Fechar a conexão ao finalizar
// client.end();

async function inserirCurso(id, nome) {
    try {
        const res = await client.query(
            'INSERT INTO curso (id_curso, nome_curso) VALUES ($1, $2) RETURNING *',
            [id, nome]
        );
        console.log("Curso Inserido:", res.rows[0]);
    } catch (err) {
        console.error("Erro ao inserir Curso:", err);
    }
}
inserirCurso(1, 'DSM');
inserirCurso(2,'Geoprocessamento matutino');
inserirCurso(3, 'Meio ambiente Noturno');
