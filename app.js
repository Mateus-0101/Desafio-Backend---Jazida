// app.js

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

// CARREGAR
app.get('/itens/:id', (req, res) => {
    const id = parseInt(req.params.id); // Pega o ID da URL e converte para número
    const item = itens.find(item => item.id === id); // Procura o item no array

    if (!item) {
        return res.status(404).json({ message: 'Item não encontrado.' });
    }
    res.status(200).json(item);
});

// U (Update) - Alterar item da lista
app.put('/itens/:id', (req, res) => {
    const id = parseInt(req.params.id);
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

// Batalha
app.post('/batalhar', (req, res) => {
    // Ler pokemons
    const { pokemonAId, pokemonBId} = req.body;

    if(!pokemonAId || !pokemonBId) {
        return res.status(400).json({ message: 'Ambos IDs são obrigatórios'});
    }

    // Conversão de ID
    const idA = parseInt(pokemonAId);
    const idB = parseInt(pokemonBId);

    // Buscar na lista
    const pokemonA = itens.find(item => item.id === idA);
    const pokemonB = itens.find(item => item.id === idB);

    if(!pokemonA || !pokemonB) {
        return res.status(400).json({ message: 'Um dos pokemons não foi encontrado na lista'});
    }

    // Não permitir batalha contra si mesmo
    if (pokemonA.id === pokemonB.id) {
        return res.status(400).json({ message: 'Não é permitido batalhar contra si mesmo.' });
    }

    // Flags de Resultado
    let vencedor = null;
    let perdedor = null;
    let morte = null;

    // Cálculo de chances baseado nos níveis
    const nivelA = pokemonA.nivel;
    const nivelB = pokemonB.nivel;

    // Geração das chances de ganho
    const somaNiveis = nivelA + nivelB;
    const sorte = Math.random() * somaNiveis;

    // Chance = (nivel/somaNiveis)
    /*  Uma "linha" de 0 a totalNiveis:
        A parte que representa a chance do Pokémon A ganhar vai de 0 até nivel1.
        A parte que representa a chance do Pokémon B ganhar vai de nivel1 até totalNiveis.
        Se a "sorte" cair na primeira parte (< nivelA), o Pokémon A vence. Caso contrário (cair na segunda parte), o Pokémon B vence.
    */
    if (sorte < nivelA) {
        vencedor = pokemonA;
        perdedor = pokemonB;
    } else {
        vencedor = pokemonB;
        perdedor = pokemonA;
    }

    // Atualizando níveis
    vencedor.nivel++;
    perdedor.nivel--;

    const resposta = {
        vencedor: {
            id: vencedor.id,
            tipo: vencedor.tipo,
            treinador: vencedor.treinador,
            nivel: vencedor.nivel 
        },
        perdedor: {
            id: perdedor.id,
            tipo: perdedor.tipo,
            treinador: perdedor.treinador,
            nivel: perdedor.nivel
        }
    };

    res.status(200).json(resposta);

    if (perdedor.nivel <= 0) {
        // Deletar o Pokémon perdedor
        itens = itens.filter(item => item.id !== perdedor.id);
        morte = true;
    }
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
