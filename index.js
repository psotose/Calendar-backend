const express = require('express');
require('dotenv').config();
const path = require ('path');
const { dbConnection } = require('./database/config');
const cors = require('cors');

// console.log(process.env);

//Crear servidor de express
const app = express();

//Base de datos
dbConnection();

//CORS
app.use(cors());

//Directorio público
app.use( express.static(path.resolve(__dirname, 'public')));

//Lectura y parseo del body
app.use(express.json());

//Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

//Escuchar peticiones
app.listen( process.env.PORT, () => {
  console.log(`Servidor corriendo en puerto ${ process.env.PORT }`);
});