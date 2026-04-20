const fs = require('fs');
const path = require('path');

const dir = './';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (content.includes('favicon.svg')) {
    content = content.replace('<link rel="icon" type="image/svg+xml" href="favicon.svg">', '<link rel="icon" type="image/jpeg" href="favicon.jpg">');
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
