/**
 * Simula uma batalha entre dois Pokémon e calcula o resultado.
 *
 * @param {object} pokemonA - Objeto Pokémon A (com id, tipo, nivel).
 * @param {object} pokemonB - Objeto Pokémon B (com id, tipo, nivel).
 * @returns {object} Um objeto com vencedor, perdedor e uma flag se o perdedor morre.
 */
function simularBatalha(pokemonA, pokemonB) {
    // Não permitir batalha contra si mesmo
    if (pokemonA.id === pokemonB.id) {
        throw new Error('Não é permitido batalhar contra si mesmo.');
    }

    let vencedor = null;
    let perdedor = null;

    const nivelA = pokemonA.nivel;
    const nivelB = pokemonB.nivel;

    const somaNiveis = nivelA + nivelB;
    const sorte = Math.random() * somaNiveis;

    if (sorte < nivelA) {
        vencedor = { ...pokemonA }; // Cria cópias 
        perdedor = { ...pokemonB };
    } else {
        vencedor = { ...pokemonB };
        perdedor = { ...pokemonA };
    }

    // Atualiza níveis (em cópias)
    vencedor.nivel++;
    perdedor.nivel--;

    let perdedorMorreu = false;
    if (perdedor.nivel <= 0) {
        perdedorMorreu = true;
        perdedor.nivel = 0; // Garante que o nível não fique negativo na resposta
    }

    return {
        vencedor: {
            id: vencedor.id,
            tipo: vencedor.tipo,
            treinador: vencedor.treinador,
            nivel: vencedor.nivel,
        },
        perdedor: {
            id: perdedor.id,
            tipo: perdedor.tipo,
            treinador: perdedor.treinador,
            nivel: perdedor.nivel,
        },
        perdedorMorreu: perdedorMorreu
    };
}

module.exports = { simularBatalha };