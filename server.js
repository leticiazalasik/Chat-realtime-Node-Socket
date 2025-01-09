const express = require('express');
const path = require('path');
const cors = require('cors');  // Importando o pacote CORS

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: 'http://127.0.0.1:5500',  // Permite somente o front-end a partir de http://127.0.0.1:5500
        methods: ['GET', 'POST'],  // Permite métodos GET e POST
        allowedHeaders: ['my-custom-header'],  // Caso precise de headers personalizados
        credentials: true  // Permite o envio de cookies (se necessário)
    }
});

app.use(cors());  // O CORS também é usado para outras requisições HTTP

// Serve arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Configuração para servir o arquivo index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

let messages = [];

io.on('connection', socket => {
    console.log(`Socket conectado: ${socket.id}`);

    socket.emit('previousMessages', messages);
  
    socket.on('sendMessage', data => {
        messages.push(data);
        socket.broadcast.emit('receivedMessage', data);
    });
});

server.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
