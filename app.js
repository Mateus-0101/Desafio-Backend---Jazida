// app.js

const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

let items = []; 
let proxId = 1; 

const tiposPermitidos = ['charizard', 'mewtwo', 'pikachu'];

// C (Create) - Criar um novo item
app.post('/items', (req, res) => {
    const { nome, tipo, treinador } = req.body; 
    
    if (!nome || !tipo || !treinador) {
        return res.status(400).json({ message: 'Todos os campos são obrgatórios.' });
    }
    
    const newItem = { id: nextId++, 
        nome, 
        tipo,
        treinador
    };
    
    items.push(newItem);
    res.status(200).json(newItem); 
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
