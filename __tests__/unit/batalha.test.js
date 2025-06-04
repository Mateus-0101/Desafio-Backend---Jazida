// __tests__/batalha.test.js

const { simularBatalha } = require('../../utils/logica_batalha'); 

// Mockar Math.random para controlar o resultado da sorte
// tornar o teste determinístico 
describe('Lógica de Batalha de Pokémon', () => {

    let pokemonA;
    let pokemonB;

    beforeEach(() => {
        // Redefinir pokemons antes de cada teste para garantir isolamento
        pokemonA = { id: 1, tipo: 'charizard', treinador: 'Ash', nivel: 5 };
        pokemonB = { id: 2, tipo: 'mewtwo', treinador: 'Misty', nivel: 3 };
    });

    test('Pokémon de nível mais alto vence consistentemente (sorte favorável)', () => {
        // Mockar Math.random para garantir que pokemonA sempre vença
        // NivelA (5) / (5+3) = 5/8 = 0.625
        // Se Math.random() retornar algo < 0.625, pokemonA vence
        const mockRandom = jest.spyOn(Math, 'random').mockReturnValue(0.5); // Garante que A vença

        const result = simularBatalha(pokemonA, pokemonB);

        expect(result.vencedor.id).toBe(pokemonA.id);
        expect(result.perdedor.id).toBe(pokemonB.id);
        expect(result.vencedor.nivel).toBe(pokemonA.nivel + 1); // Nível original + 1
        expect(result.perdedor.nivel).toBe(pokemonB.nivel - 1); // Nível original - 1
        expect(result.perdedorMorreu).toBe(false);

        mockRandom.mockRestore(); // Restaurar Math.random após o teste
    });

    test('Pokémon de nível mais baixo vence consistentemente (sorte favorável)', () => {
        // Mockar Math.random para garantir que pokemonB sempre vença
        // NivelA (5) / (5+3) = 0.625
        // Se Math.random() retornar algo >= 0.625, pokemonB vence
        const mockRandom = jest.spyOn(Math, 'random').mockReturnValue(0.7); // Garante que B vença

        const result = simularBatalha(pokemonA, pokemonB);

        expect(result.vencedor.id).toBe(pokemonB.id);
        expect(result.perdedor.id).toBe(pokemonA.id);
        expect(result.vencedor.nivel).toBe(pokemonB.nivel + 1);
        expect(result.perdedor.nivel).toBe(pokemonA.nivel - 1);
        expect(result.perdedorMorreu).toBe(false);

        mockRandom.mockRestore();
    });

    test('Perdedor com nível 1 morre (nivel final 0)', () => {
        pokemonA.nivel = 1; // Perdedor potencial
        pokemonB.nivel = 5; // Vencedor potencial

        // Garante que pokemonA (nivel 1) perca
        // NivelA (1) / (1+5) = 1/6 = 0.166...
        // Se Math.random() retornar algo >= 0.166..., pokemonB (o de nivel 5) vence
        const mockRandom = jest.spyOn(Math, 'random').mockReturnValue(0.2); // Garante que A perca

        const result = simularBatalha(pokemonA, pokemonB);

        expect(result.vencedor.id).toBe(pokemonB.id);
        expect(result.perdedor.id).toBe(pokemonA.id);
        expect(result.vencedor.nivel).toBe(pokemonB.nivel + 1);
        expect(result.perdedor.nivel).toBe(0); // Nível do perdedor deve ser 0
        expect(result.perdedorMorreu).toBe(true);

        mockRandom.mockRestore();
    });

    test('Perdedor com nível menor que 1 morre (nivel final negativo, mas setado para 0)', () => {
        pokemonA.nivel = 0; // Perdedor potencial com nivel 0 (será -1 no cálculo, mas 0 no resultado)
        pokemonB.nivel = 5;

        const mockRandom = jest.spyOn(Math, 'random').mockReturnValue(0.9); // Garante que A perca

        const result = simularBatalha(pokemonA, pokemonB);

        expect(result.vencedor.id).toBe(pokemonB.id);
        expect(result.perdedor.id).toBe(pokemonA.id);
        expect(result.vencedor.nivel).toBe(pokemonB.nivel + 1);
        expect(result.perdedor.nivel).toBe(0); // Nível do perdedor deve ser 0
        expect(result.perdedorMorreu).toBe(true);

        mockRandom.mockRestore();
    });


    test('Não permite batalha contra si mesmo', () => {
        expect(() => {
            simularBatalha(pokemonA, pokemonA); // Passando o mesmo Pokémon
        }).toThrow('Não é permitido batalhar contra si mesmo.');
    });
});