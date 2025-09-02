/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const ARTICLES_FILE = path.join(__dirname, '..', 'data', 'articles.json');

function fixDuplicateIds() {
  console.log('Reading articles file...');
  
  // Read the current articles
  const articlesData = fs.readFileSync(ARTICLES_FILE, 'utf8');
  const articles = JSON.parse(articlesData);
  
  console.log(`Found ${articles.length} articles`);
  
  // Find duplicates
  const seenIds = new Set();
  const duplicateIds = new Set();
  
  articles.forEach(article => {
    if (seenIds.has(article.id)) {
      duplicateIds.add(article.id);
    }
    seenIds.add(article.id);
  });
  
  console.log(`Found ${duplicateIds.size} duplicate IDs: [${Array.from(duplicateIds).join(', ')}]`);
  
  if (duplicateIds.size === 0) {
    console.log('No duplicates found!');
    return;
  }
  
  // Create backup
  const backupFile = ARTICLES_FILE + '.backup-' + Date.now();
  fs.writeFileSync(backupFile, articlesData);
  console.log(`Backup created: ${backupFile}`);
  
  // Fix duplicates
  let fixedCount = 0;
  const processedIds = new Set();
  
  const fixedArticles = articles.map(article => {
    // If this is the first time we see this ID, keep it
    if (!processedIds.has(article.id)) {
      processedIds.add(article.id);
      return article;
    }
    
    // This is a duplicate, generate new UUID
    const newId = uuidv4();
    console.log(`Replacing duplicate ID "${article.id}" with "${newId}" for article: "${article.title}"`);
    fixedCount++;
    
    return {
      ...article,
      id: newId
    };
  });
  
  // Write the fixed data
  fs.writeFileSync(ARTICLES_FILE, JSON.stringify(fixedArticles, null, 2));
  
  console.log(`\n✅ Fixed ${fixedCount} duplicate IDs`);
  console.log(`📁 Backup saved to: ${backupFile}`);
  console.log(`📝 Updated articles file: ${ARTICLES_FILE}`);
}

// Run the fix
try {
  fixDuplicateIds();
} catch (error) {
  console.error('Error fixing duplicate IDs:', error);
  process.exit(1);
}