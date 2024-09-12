const express = require('express');
https = require('https');
const multer = require('multer'); 
const cors = require('cors');
// const fs = require('fs');
const pdf2table = require('pdf2table');
const router = express.Router();
const serverless = require('serverless-http');

const app = express();
app.use(cors());

// const PORT = process.env.PORT || 5000; 

// app.use('/', (req,res) => {
//     res.status(200).send({message: 'Server running'});
// });

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/', (req,res) => {
    console.log('Server is Up ')
    res.json({message: 'Server is Up'})
})
// POST route for uploading files
router.post('/upload', upload.single('pdf'), async(req, res) => {
    const fileBuffer = req.file.buffer; // directly using buffer so that we don't need to store file in server to avoid risk

    if (!fileBuffer) {
        return res.status(400).json({ error: 'File is corrupted' });
    }
    const extractedObj = {};
    // Read the uploaded PDF file
    // fs.readFile(fileBuffer, (err, buffer) => {
    //     if (err) {
    //         return res.status(500).json({ error: 'Error reading file' });
    //     }

        // Parse PDF and extract tables
        pdf2table.parse(fileBuffer, (err, rows) => {
            if (err) {
                return res.status(500).json({ error: 'Error parsing PDF' });
            }

            // Respond with the extracted table data
            extractedObj['tables'] = rows ;
            console.log('---------------------------------------------')
            res.status(200).json({message: 'woh-hu successfully extracted data', data: extractedObj});

            // Optionally, delete the file after processing
            // fs.unlink(filePath, (err) => {
            //     if (err) console.error('Error deleting file:', err);
            // });
            return;
        });
        // res.status(400).json({message: 'Something is wrong'})
    // });
    
});

app.use('/.netlify/functions/index', router);
module.exports.handler = serverless(app);

// app.listen(PORT,() => {console.log(`Server is Up & Running on ${PORT}`)});