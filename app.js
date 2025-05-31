/// app.js

const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

let itens = []; 
let proxId = 1; 

const tiposPermitidos = ['charizard', 'mewtwo', 'pikachu'];

// C (Create) - Criar um novo item
app.post('/itens', (req, res) => {
    const { tipo, treinador } = req.body; 
    
    if ( !tipo || !treinador) {
        return res.status(400).json({ message: 'Todos os campos são obrgatórios.' });
    }

    const tipoNormalizado = tipo.toLowerCase();
    if (!tiposPermitidos.includes(tipoNormalizado)){
        return res.status(400).json({ message: 'Necessário ser um tipo válido!'});
    }
    
    const newItem = { id: proxId++, 
        tipo,
        treinador,
        nivel: 1
    };
    
    itens.push(newItem);
    res.status(200).json(newItem); 
});

// R (Read) - Ler todos os itens da lista
app.get('/itens', (req, res) => {
    res.status(200).json(itens);
});

// U (Update) - Alterar item da lista
app.put('/itens/:id', (req, res) => {
    const id = parseInt(req.params.id); // Pega o ID da URL e converte para número
    const { treinador } = req.body;

    let indiceItem = itens.findIndex(item => item.id === id);

    if (indiceItem === -1){
        return res.status(404).json({message: "Item não encontrado."});
    }

    if(!treinador){
        return res.status(400).json({message: 'Obrigatório especificar "treinador".'});
    }

    itens[indiceItem].treinador = treinador; // Atualiza o treinador
    res.status(204).send(); // Sem mensagem
});

// D (Delete) - Apagar um item
app.delete('/itens/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const tamanhoInicial = itens.length;

    // Remove o ID indicado na Requisição
    itens = itens.filter(item => item.id !== id);

    if (itens.length === tamanhoInicial){
        //  Se o tamanho não for alterado, significa que o item
        // especificado não foi encontrado
        return res.status(404).json({ message: "O item especificado não foi encontrado."});
    }

    res.status(204).send();
})

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
