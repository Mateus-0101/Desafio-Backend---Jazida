const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const client = new Client ({
    connectionString: process.env.DATABASE_URL ||  'postgres://user_pokemon:password_pokemon@localhost:5432/pokemon_db',
});

async function runMigrations() {

    try {
        await client.connect();
        console.log('Conectado ao banco de dados para migrações.');
    
        const migrationDir = path.join(__dirname);
        const migrationFiles = fs.readdirSync(migrationDir)
            .filter(file => file.endsWith('.sql') && file.match(/^\d{3}_/)) // lê apenas arquivos .sql que começam com 3 dígitos
            .sort();    // Organização em ordem numérica
        
        for (const file of migrationFiles) {
            const filePath = path.join(migrationDir, file);
            const sql = fs.readFileSync(filePath, 'utf8');
    
            console.log('Executando migração: ${file}');
            await client.query(sql);
        }
    
        console.log('Todas as migrações foram realizadas com sucesso!!');
    } catch (err) {
        console.error('Erro ao realizar migrções:', err);
        process.exit(1);
    } finally {
        await client.end();
    }
}

runMigrations();