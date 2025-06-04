# API de Batalha e Gerenciamento de Pokémon
---
## 🚀 Visão Geral do Projeto

Este projeto consiste em uma **API RESTful** desenvolvida com Node.js e Express, projetada para gerenciar uma coleção de Pokémon e simular batalhas entre eles. 
A aplicação utiliza **PostgreSQL** como banco de dados e é totalmente **conteinerizada com Docker e Docker Compose**.

### ✨ Funcionalidades Principais

* **CRUD Completo de Pokémon:**
    * **C (Create):** Adicionar novos Pokémon à coleção.
    * **R (Read):** Listar todos os Pokémon ou buscar um Pokémon específico por ID.
    * **U (Update):** Alterar informações de um Pokémon (ex: treinador).
    * **D (Delete):** Remover Pokémon da coleção.
* **Sistema de Batalha:**
    * Simula uma batalha entre dois Pokémon, onde a probabilidade de vitória é baseada no nível de cada um.
    * O Pokémon vencedor ganha um nível.
    * O Pokémon perdedor perde um nível.
    * Se o nível do perdedor chegar a **0 ou menos**, ele é **removido permanentemente** do banco de dados, mas seus detalhes (com nível 0) ainda são retornados na resposta da batalha para informar sobre sua "morte".

---

## 💻 Tecnologias Utilizadas

* **Backend:**
    * **Node.js:** Ambiente de execução JavaScript.
    * **Express.js:** Framework web para Node.js.
    * **`pg`:** Driver para conexão com PostgreSQL.
* **Banco de Dados:**
    * **PostgreSQL:** Sistema de gerenciamento de banco de dados relacional.
* **Conteinerização:**
    * **Docker:** Para criar e gerenciar containers isolados.
    * **Docker Compose:** Para orquestrar múltiplos containers (aplicação e banco de dados).
* **Ferramentas de Desenvolvimento:**
    * **Nodemon:** Para reinício automático do servidor durante o desenvolvimento.
---

## 📋 Requisitos para Rodar

Para executar este projeto em sua máquina local, você precisará ter o seguinte software instalado:

* **Docker Desktop:** Essencial para a execução dos containers (Node.js e PostgreSQL).
    * [Download para Windows](https://docs.docker.com/desktop/install/windows-install/)
    * [Download para macOS](https://docs.docker.com/desktop/install/mac-install/)
    * [Download para Linux](https://docs.docker.com/desktop/install/linux-install/)
* **Node.js e npm:** Embora o Docker instale as dependências dentro do container, ter Node.js e npm localmente é útil para gerenciar o projeto
* (ex: `npm install`) e executar scripts como as migrações manualmente, se necessário.
    * [Download Node.js](https://nodejs.org/en/download/) (Recomendado: versão LTS)

---

## 🚀 Como Rodar o Projeto

Siga os passos abaixo para configurar e iniciar a aplicação:

1.  **Clone o Repositório (ou descompacte o ZIP):**

    Se estiver usando Git:
    ```bash
    git clone [https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git](https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git)
    cd SEU_REPOSITORIO # Navegue para a pasta raiz do projeto
    ```
    Se você recebeu um arquivo `.zip`, descompacte-o e navegue até a pasta raiz do projeto no seu terminal.

2.  **Instale as Dependências do Node.js:**

    Execute este comando na pasta raiz do projeto. Ele instalará as dependências listadas no `package.json` na sua máquina local.
    O Docker também as instalará dentro do container, mas esta etapa garante que ferramentas como `nodemon` e `pg` estejam disponíveis localmente se você precisar.

    ```bash
    npm install
    ```

4.  **Inicie os Containers Docker:**

    Este comando é o coração da configuração. Ele irá:
    * Construir a imagem Docker da aplicação Node.js (`app`).
    * Puxar a imagem do PostgreSQL (`db`).
    * Criar e iniciar os containers para ambos os serviços, configurando a rede interna.
    * Persistir os dados do banco de dados usando um volume (`db_data`).
    * **Executar as migrações do banco de dados** (`npm run migrate`) para criar a tabela `pokemons`.
    * Iniciar aplicação Node.js.

    Execute na pasta raiz do projeto:

    ```bash
    docker-compose up --build
    ```

    * **Observação Importante (Troubleshooting):**
       * Caso ocorra erros com a configuração do Docker, pode ser que o volume de dados do PostgreSQL estejam "sujos"
       * Use esse comandos para apagar os dados dos conteiners com uma configuração errada.
     ```bash
            docker-compose down --volumes # Isso vai parar, remover os containers e APAGAR os dados do banco
            docker-compose up --build     # E iniciar tudo do zero novamente
            ```
 **Cuidado:** `down --volumes` apaga todos os dados do banco. Use-o se estiver tendo problemas de inicialização ou se quiser um banco de dados limpo.

5.  **Verifique o Status dos Containers:**

    Você pode verificar se ambos os serviços (`app` e `db`) estão rodando corretamente com:

    ```bash
    docker-compose ps
    ```
    Ambos devem exibir `Up` na coluna `State`.

## 📍 Endpoints da API

A API estará disponível para requisições em `http://localhost:3000`.

Você pode testar os endpoints utilizando ferramentas como:
* [**REST Client** (Extensão do VS Code)](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) - Ótimo para integrar no VS Code.
* **`curl`** (diretamente no terminal) - Para testes rápidos.
* 
---

## 🛑 Parando o Projeto

Para parar os containers e liberar as portas, na pasta raiz do projeto, execute:

```bash
docker-compose down
