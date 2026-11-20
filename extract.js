const fs = require('fs');
const pdf = require('pdf-parse');

async function extractText() {
  const dataBuffer = fs.readFileSync('cambridge.pdf');
  
  pdf(dataBuffer).then(function(data) {
    // Очищаем текст от лишних переносов строк
    const cleanText = data.text.replace(/\n/g, ' ').replace(/\s+/g, ' ');
    
    // Сохраняем в файл
    fs.writeFileSync('extracted_text.txt', cleanText);
    console.log('Текст извлечен! Открой файл extracted_text.txt и скопируй оттуда тексты.');
  }).catch(err => {
    console.error("Ошибка при чтении PDF:", err);
  });
}

extractText();
