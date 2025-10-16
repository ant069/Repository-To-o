const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();

// Configuración
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// IMPORTANTE: Reemplaza con tu API key de OpenWeatherMap
const API_KEY = "TU_API_KEY_AQUI";

// Ruta GET - muestra el formulario
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// Ruta POST - procesa la búsqueda del clima
app.post("/", (req, res) => {
  const cityName = req.body.cityName;
  
  if (!cityName) {
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Error</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 50px auto;
            padding: 20px;
            text-align: center;
          }
          .error {
            color: #d32f2f;
            background-color: #ffcdd2;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
          }
          a {
            display: inline-block;
            padding: 10px 20px;
            background-color: #1976d2;
            color: white;
            text-decoration: none;
            border-radius: 4px;
          }
          a:hover {
            background-color: #1565c0;
          }
        </style>
      </head>
      <body>
        <div class="error">
          <h2>Error</h2>
          <p>Please enter a city name.</p>
        </div>
        <a href="/">Back to Home</a>
      </body>
      </html>
    `);
    return;
  }

  const units = "metric"; // Para Celsius
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=${units}`;

  https.get(url, (response) => {
    let data = "";

    // Manejar errores de respuesta HTTP
    if (response.statusCode !== 200) {
      res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Error</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              max-width: 600px;
              margin: 50px auto;
              padding: 20px;
              text-align: center;
            }
            .error {
              color: #d32f2f;
              background-color: #ffcdd2;
              padding: 20px;
              border-radius: 8px;
              margin-bottom: 20px;
            }
            a {
              display: inline-block;
              padding: 10px 20px;
              background-color: #1976d2;
              color: white;
              text-decoration: none;
              border-radius: 4px;
            }
            a:hover {
              background-color: #1565c0;
            }
          </style>
        </head>
        <body>
          <div class="error">
            <h2>Error ${response.statusCode}</h2>
            <p>City not found or API error. Please try again.</p>
          </div>
          <a href="/">Back to Home</a>
        </body>
        </html>
      `);
      return;
    }

    // Recibir datos
    response.on("data", (chunk) => {
      data += chunk;
    });

    // Cuando se complete la recepción de datos
    response.on("end", () => {
      try {
        const weatherData = JSON.parse(data);
        
        // Extraer información necesaria
        const temp = weatherData.main.temp;
        const description = weatherData.weather[0].description;
        const icon = weatherData.weather[0].icon;
        const city = weatherData.name;
        const country = weatherData.sys.country;
        const humidity = weatherData.main.humidity;
        const feelsLike = weatherData.main.feels_like;
        
        // URL del icono
        const iconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;

        // Enviar respuesta HTML
        res.send(`
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Weather in ${city}</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                display: flex;
                justify-content: center;
                align-items: center;
                margin: 0;
                padding: 20px;
              }
              .weather-card {
                background: white;
                border-radius: 20px;
                padding: 40px;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                text-align: center;
                max-width: 400px;
                width: 100%;
              }
              .city-name {
                font-size: 32px;
                font-weight: bold;
                color: #333;
                margin-bottom: 10px;
              }
              .weather-icon {
                width: 120px;
                height: 120px;
                margin: 20px 0;
              }
              .temperature {
                font-size: 64px;
                font-weight: bold;
                color: #667eea;
                margin: 20px 0;
              }
              .description {
                font-size: 24px;
                color: #666;
                text-transform: capitalize;
                margin-bottom: 20px;
              }
              .details {
                display: flex;
                justify-content: space-around;
                margin: 30px 0;
                padding: 20px 0;
                border-top: 1px solid #eee;
                border-bottom: 1px solid #eee;
              }
              .detail-item {
                text-align: center;
              }
              .detail-label {
                font-size: 14px;
                color: #999;
                margin-bottom: 5px;
              }
              .detail-value {
                font-size: 20px;
                font-weight: bold;
                color: #333;
              }
              .back-link {
                display: inline-block;
                padding: 12px 30px;
                background-color: #667eea;
                color: white;
                text-decoration: none;
                border-radius: 25px;
                margin-top: 20px;
                transition: background-color 0.3s;
              }
              .back-link:hover {
                background-color: #764ba2;
              }
            </style>
          </head>
          <body>
            <div class="weather-card">
              <div class="city-name">${city}, ${country}</div>
              <img src="${iconUrl}" alt="${description}" class="weather-icon">
              <div class="temperature">${temp}°C</div>
              <div class="description">${description}</div>
              <div class="details">
                <div class="detail-item">
                  <div class="detail-label">Feels Like</div>
                  <div class="detail-value">${feelsLike}°C</div>
                </div>
                <div class="detail-item">
                  <div class="detail-label">Humidity</div>
                  <div class="detail-value">${humidity}%</div>
                </div>
              </div>
              <a href="/" class="back-link">Search Another City</a>
            </div>
          </body>
          </html>
        `);
      } catch (error) {
        // Manejar errores de parsing JSON
        res.send(`
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Error</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                max-width: 600px;
                margin: 50px auto;
                padding: 20px;
                text-align: center;
              }
              .error {
                color: #d32f2f;
                background-color: #ffcdd2;
                padding: 20px;
                border-radius: 8px;
                margin-bottom: 20px;
              }
              a {
                display: inline-block;
                padding: 10px 20px;
                background-color: #1976d2;
                color: white;
                text-decoration: none;
                border-radius: 4px;
              }
              a:hover {
                background-color: #1565c0;
              }
            </style>
          </head>
          <body>
            <div class="error">
              <h2>Error Processing Data</h2>
              <p>There was an error processing the weather data. Please try again.</p>
            </div>
            <a href="/">Back to Home</a>
          </body>
          </html>
        `);
      }
    });

  }).on("error", (error) => {
    // Manejar errores de conexión
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Error</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 50px auto;
            padding: 20px;
            text-align: center;
          }
          .error {
            color: #d32f2f;
            background-color: #ffcdd2;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
          }
          a {
            display: inline-block;
            padding: 10px 20px;
            background-color: #1976d2;
            color: white;
            text-decoration: none;
            border-radius: 4px;
          }
          a:hover {
            background-color: #1565c0;
          }
        </style>
      </head>
      <body>
        <div class="error">
          <h2>Connection Error</h2>
          <p>Unable to connect to the weather service. Error: ${error.message}</p>
        </div>
        <a href="/">Back to Home</a>
      </body>
      </html>
    `);
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});