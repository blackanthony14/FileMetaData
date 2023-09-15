const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
require('dotenv').config();

const app = express();

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

// Set up Multer for file uploads
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/fileanalyse', upload.single('upfile'),(req, res) => {
  if (!req.file) {
    return res.json({ error: 'No file selected for upload.' });
  }
  const file = req.file;
  const filePath = `${__dirname}/files/${file.originalname}`;
  // Use fs.writeFile to save the file
  fs.writeFile(filePath, file.buffer, (err) => {
    if (err) {
      return res.json({ error: 'Error saving the file.' });
    } 
    res.json({
      name: req.file.originalname,
      type: req.file.mimetype,
      size: req.file.size,
    });
  });
});


const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port);
});
