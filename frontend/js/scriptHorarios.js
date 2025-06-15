document.getElementById("filtrar_btn").addEventListener("click", async () => {
  const curso = document.getElementById("curso").value;
  const periodo = document.getElementById("periodo").value;
  const semestre = document.getElementById("semestre").value;

  try {
    const response = await fetch(`http://localhost:3010/scriptHorarios/${curso}/${periodo}/${semestre}`);
    const dados = await response.json();

    limparTabela();

    if (!dados || dados.length === 0) {
        alert("O curso escolhido não possui turma nesse semestre e/ou período!");
        return;
    }

    const diaIndice = {
      Segunda: 1,
      Terça: 2,
      Quarta: 3,
      Quinta: 4,
      Sexta: 5,
    };

    const horarioIndice = {
      "18:45-19:35": 0,
      "19:35-20:25": 1,
      "20:25-21:15": 2,
      "21:25-22:15": 3,
      "22:15-23:05": 4,
    };

    const tabela = document.querySelector("#corpoTabela");

    dados.forEach((item) => {
      const linha = horarioIndice[item.horario];
      const coluna = diaIndice[item.dia_semana];

      if (linha === undefined || coluna === undefined) return;

      const linhaTabela = tabela.rows[linha];
      const celula = linhaTabela.cells[coluna];

      const conteudo = `${item.nome_disciplina}<br>`;
      celula.innerHTML = `${item.nome_disciplina}<br>`;
    });

    const professores = {};

    // Percorre todos os itens do JSON
    dados.forEach((item) => {
      const nome = item.nome_professor;
      const disciplina = item.nome_disciplina;

      // Se o professor ainda não estiver no objeto, cria uma lista nova
      if (!professores[nome]) {
        professores[nome] = new Set(); // Set evita repetições automáticas
      }

      // Adiciona a disciplina ao conjunto do professor
      professores[nome].add(disciplina);
    });

    // Exibe o resultado
    const lista = document.createElement("ul");

    for (const [professor, disciplinas] of Object.entries(professores)) {
      const li = document.createElement("li");
      li.innerHTML = `<strong>${professor}</strong>: ${[...disciplinas].join(
        ", "
      )}`;
      lista.appendChild(li);
    }

    const divDocentes = document.querySelector("#docentes__ul");
    divDocentes.innerHTML = "";
    divDocentes.appendChild(lista);


    // Aqui o resto do seu código para preencher a tabela e docentes
  } catch (erro) {
    console.error("Erro ao carregar os dados da tabela:", erro);
  }
});

// Função auxiliar
function limparTabela() {
  const tabela = document.querySelector("#corpoTabela");

  for (let i = 0; i < tabela.rows.length; i++) {
    for (let j = 1; j < tabela.rows[i].cells.length; j++) {
      tabela.rows[i].cells[j].innerHTML = "";
    }
  }
}

// Função para exportar para PDF
document.querySelector(".exportar_btn").addEventListener("click", exportToPDF);

function exportToPDF() {
    // Carrega o jsPDF (que foi instalado via terminal com npm install)
    const { jsPDF } = window.jspdf;
    
    // Cria um novo PDF
    const doc = new jsPDF({
        orientation: 'landscape', // Modo paisagem para a tabela
        unit: 'mm'
    });

    // Adiciona título
    const curso = document.getElementById("curso").options[document.getElementById("curso").selectedIndex].text;
    const periodo = document.getElementById("periodo").options[document.getElementById("periodo").selectedIndex].text;
    const semestre = document.getElementById("semestre").options[document.getElementById("semestre").selectedIndex].text;
    
    const titulo = `Horário - ${curso} - ${semestre} Semestre (${periodo})`;
    doc.setFontSize(16);
    doc.text(titulo, 105, 15, { align: 'center' });

    // Adiciona data de emissão
    const dataEmissao = new Date().toLocaleDateString('pt-BR');
    doc.setFontSize(10);
    doc.text(`Emitido em: ${dataEmissao}`, 190, 10, { align: 'right' });

    // Captura a tabela como imagem
    const tabela = document.querySelector(".tabela_horario");
    
    html2canvas(tabela, {
        scale: 2, // Melhora a qualidade
        logging: false,
        useCORS: true
    }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 280; // Largura máxima em modo paisagem
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        // Adiciona a tabela
        doc.addImage(imgData, 'PNG', 10, 20, imgWidth, imgHeight);
        
        // Adiciona a lista de docentes (se houver)
        const docentes = document.querySelector(".docentes");
        if (docentes && docentes.textContent.trim() !== "Docentes:") {
            doc.addPage();
            doc.setFontSize(14);
            doc.text("Docentes e Disciplinas:", 10, 20);
            
            // Converte o HTML para texto simples
            const docentesText = docentes.textContent.replace(/\n/g, ' ').replace(/\s+/g, ' ');
            doc.setFontSize(10);
            const splitText = doc.splitTextToSize(docentesText, 180);
            doc.text(splitText, 10, 30);
        }
        
        // Salva o PDF
        doc.save(`horario_${curso}_${semestre}_semestre_${periodo}.pdf`);
    });
}