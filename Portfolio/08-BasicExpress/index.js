const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/calculate', function(req, res) {
    const weight = parseFloat(req.body.weight);
    const height = parseFloat(req.body.height);
    
    const bmi = (weight / (height * height)) * 10000;
    
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>BMI Result</title>
            <link rel="stylesheet" href="style.css">
        </head>
        <body>
            <div class="result-container">
                <h1>Your BMI is</h1>
                <div class="bmi-value">${bmi.toFixed(2)}</div>
                <p>Weight: ${weight} kg | Height: ${height} cm</p>
                <a href="/">Calculate Again</a>
            </div>
        </body>
        </html>
    `);
});

app.listen(3000, function() {
    console.log('Server is running on port 3000');
    console.log('Visit http://localhost:3000');
});
```

## 📁 Estructura de archivos actualizada:
```
bmi-calculator/
├── server.js
├── package.json
└── public/
    ├── index.html
    └── style.css
