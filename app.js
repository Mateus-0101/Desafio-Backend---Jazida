// app.js

const express = require('express');
const { Client } = require('pg'); // Importando o cliente PostgreSQL
const app = express();
const PORT = 3000;

app.use(express.json());

const tiposPermitidos = ['charizard', 'mewtwo', 'pikachu'];

// Configuração do cliente PostgreSQL
const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgres://user_pokemon:password_pokemon@localhost:5432/pokemon_db',
});

// Conecta ao banco de dados ao iniciar a aplicação
client.connect()
    .then(() => console.log('Conectado ao PostgreSQL com sucesso!'))
    .catch(err => {
        console.error('Erro de conexão ao PostgreSQL:', err);
        process.exit(1); // Encerra a aplicação se não conseguir conectar ao DB
    });

// C (Create) - Criar um novo item -> Agora assíncrona
app.post('/itens', async (req, res) => {
    const { tipo, treinador } = req.body; 
    
    if ( !tipo || !treinador) {
        return res.status(400).json({ message: 'Todos os campos são obrgatórios.' });
    }

    const tipoNormalizado = tipo.toLowerCase();
    if (!tiposPermitidos.includes(tipoNormalizado)){
        return res.status(400).json({ message: 'Necessário ser um tipo válido!'});
    }
    
    try {
        const query = 'INSERT INTO pokemons(tipo, treinador, nivel) VALUES($1, $2, $3) RETURNING *';
        const values = [tipoNormalizado, treinador, 1]; // Nível inicial 1

        const result = await client.query(query, values);
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Erro ao criar item:', err);
        res.status(500).json({ message: 'Erro interno do servidor ao criar item.' });
    }
});

// R (Read) - Ler todos os itens da lista
app.get('/itens', async (req, res) => {
    try {
        const resultado = await client.query('SELECT * FROM pokemons ORDER BY id ASC');
        res.status(200).json(resultado.rows);
    } catch (err) {
        console.error('Erro ao encontrar pokemon:', err);
        res.status(500).json({ message: 'Erro interno do servidor ao buscar itens.'});
    }
});

// CARREGAR pelo ID
app.get('/itens/:id', async (req, res) => {
    const id = parseInt(req.params.id); // Pega o ID da URL e converte para número
    
    if (!id) {
        return res.status(404).json({ message: 'pokemon não encontrado.' });
    }

    try {
        const busca = 'SELECT * FROM pokemons WHERE id = $1';
        const resultado = await client.query(busca, [id]);

        if (resultado.rows.length === 0){
            return res.status(404).json({ message: 'Item não encontrado na lista.'});
        }
        res.status(200).json(resultado.rows[0]);
    } catch (err) {
        console.error('Erro ao buscar ID:', err);
        res.status(500).json({ message: 'Erro interno do servidor.'});
    }
});

// U (Update) - Alterar item da lista
app.put('/itens/:id', async (req, res) => {
    const id = parseInt(req.params.id);

    if (!id){
        return res.status(404).json({message: "Item não encontrado."});
    }

    const { treinador } = req.body;

    if(!treinador){
        return res.status(400).json({message: 'Obrigatório especificar "treinador".'});
    }

    try {
        // Verifica se o item existe primeiro
        const verificarBusca = 'SELECT id FROM pokemons WHERE id = $1';
        const verificarResultado = await client.query(verificarBusca, [id]);

        if (verificarResultado.rows.length === 0) {
            return res.status(404).json({ message: "Item não encontrado na lista." });
        }

        const atualizar = 'UPDATE pokemons SET treinador = $1 WHERE id = $2';
        await client.query(atualizar, [treinador, id]); 

        res.status(204).send(); // Sem mensagem
    } catch (err) {
        console.error('Erro ao atualizar item:', err);
        res.status(500).json({ message: 'Erro interno do servidor ao atualizar item.' });
    }
});

// D (Delete) - Apagar um item
app.delete('/itens/:id', async (req, res) => {
    const id = parseInt(req.params.id);

    if (!id) {
        return res.status(400).json({ message: 'ID inválido.' });
    }

    try {
        const busca = 'DELETE FROM pokemons WHERE id = $1 RETURNING id'; // RETURNING id para verificar se algo foi deletado
        const resultado = await client.query(busca, [id]);

        if (resultado.rows.length === 0) { // Se 0 linhas foram retornadas, nada foi deletado
            return res.status(404).json({ message: "O item especificado não foi encontrado." });
        }
        res.status(204).send();
    } catch (err) {
        console.error('Erro ao deletar item:', err);
        res.status(500).json({ message: 'Erro interno do servidor ao deletar item.' });
    }
})

// Batalha
app.post('/batalhar', async (req, res) => {
    // Ler pokemons
    const { pokemonAId, pokemonBId} = req.body;

    if(!pokemonAId || !pokemonBId) {
        return res.status(400).json({ message: 'Ambos IDs são obrigatórios'});
    }

    // Conversão de ID
    const idA = parseInt(pokemonAId);
    const idB = parseInt(pokemonBId);

    try{
        const queryPokemons = 'SELECT * FROM pokemons WHERE id = $1 OR id = $2';
        const resultPokemons = await client.query(queryPokemons, [idA, idB]);

        const pokemonA = resultPokemons.rows.find(p => p.id === idA);
        const pokemonB = resultPokemons.rows.find(p => p.id === idB);

        if (!pokemonA || !pokemonB) {
            return res.status(404).json({ message: 'Um dos pokemons não foi encontrado na tabela.' });
        }

        // Não permitir batalha contra si mesmo
        if (pokemonA.id === pokemonB.id) {
            return res.status(400).json({ message: 'Não é permitido batalhar contra si mesmo.' });
        }

        // Flags de Resultado
        let vencedor = null;
        let perdedor = null;
        let morte = false; 

        // Cálculo de chances baseado nos níveis
        const nivelA = pokemonA.nivel; 
        const nivelB = pokemonB.nivel;

        // Geração das chances de ganho
        const somaNiveis = nivelA + nivelB;
        const sorte = Math.random() * somaNiveis;

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

        // Prepara a resposta
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

        // Verifica se o perdedor morreu para a flag na resposta
        if (perdedor.nivel <= 0) {
            morte = true;
            // Garantir que o nível do perdedor na resposta seja 0 se ele "morrer"
            resposta.perdedor.nivel = 0;
        }

        // Envia a resposta ao cliente IMEDIATAMENTE
        res.status(200).json(resposta);

        await client.query('UPDATE pokemons SET nivel = $1 WHERE id = $2', [vencedor.nivel, vencedor.id]);
        await client.query('UPDATE pokemons SET nivel = $1 WHERE id = $2', [perdedor.nivel, perdedor.id]);

        if (morte) {
            await client.query('DELETE FROM pokemons WHERE id = $1', [perdedor.id]);
        }

    } catch (err){ 
        console.error('Erro na batalha de Pokémon:', err);
        res.status(500).json({ message: 'Erro interno do servidor durante a batalha.' });
    }
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
