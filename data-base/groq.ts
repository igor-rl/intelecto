// 1. Pega a resposta bruta da API do Groq
const response = $input.first().json;

// 2. Navega até o conteúdo de texto gerado pelo modelo
const rawContent = response.choices[0].message.content;

// 3. Converte a string de texto de volta em um objeto JSON real
const jornalFinal = JSON.parse(rawContent);

// --- CORREÇÃO DO HORÁRIO (Fuso Brasília UTC-3) ---
// Criamos uma data com o momento exato da execução
const agora = new Date();

// Forçamos a formatação para o fuso horário de São Paulo (Brasília)
const formatter = new Intl.DateTimeFormat('pt-BR', {
  timeZone: 'America/Sao_Paulo',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false
});

// Extrai as partes da data já convertidas para o fuso correto
const partes = formatter.formatToParts(agora);
const dataMap = Object.fromEntries(partes.map(p => [p.type, p.value]));

const ano = dataMap.year;
const mes = dataMap.month;
const dia = dataMap.day;
const hora = dataMap.hour;
const minuto = dataMap.minute;
// --------------------------------------------------

// 5. Monta o caminho do arquivo conforme o padrão do seu repositório com a hora real de Brasília
const file_path = `data-base/${ano}_${mes}_${dia}/${hora}_${minuto}`;

// Opcional: Se você quiser atualizar a data/hora DENTRO do JSON para o usuário também ver o correto:
jornalFinal.jornal.data = `${dia}/${mes}/${ano}`;
jornalFinal.jornal.hora_geracao = `${hora}:${minuto}`;

// 6. Retorna estruturado, convertendo o conteúdo para STRING
return [{
  json: {
    file_path,
    file_content: JSON.stringify(jornalFinal.jornal, null, 2)
  }
}];