import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Log the current directory and check if dist folder exists
console.log('Current directory:', __dirname);
console.log('Dist folder exists:', fs.existsSync(path.join(__dirname, 'dist')));
console.log('Dist folder contents:', fs.readdirSync(__dirname));

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Add a test route to check if server is working
app.get('/test', (req, res) => {
  res.json({ 
    message: 'Server is working!',
    timestamp: new Date().toISOString(),
    distExists: fs.existsSync(path.join(__dirname, 'dist')),
    distContents: fs.readdirSync(__dirname)
  });
});

// Handle all routes by serving index.html
app.get('/', (req, res) => {
  const indexPath = path.join(__dirname, 'dist', 'index.html');
  console.log('Serving index.html from:', indexPath);
  console.log('File exists:', fs.existsSync(indexPath));
  
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('index.html not found. Available files: ' + fs.readdirSync(__dirname));
  }
});

app.get('/auth', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.get('/link/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Catch-all route for short links and any other routes
app.get('/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Server started at ${new Date().toISOString()}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
}); 