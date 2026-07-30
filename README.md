<div align="center">

# Brasil em Números

<p>
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-6-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/Leaflet-1.9-199900?style=for-the-badge&logo=leaflet&logoColor=white" alt="Leaflet">
  <img src="https://img.shields.io/badge/Plotly.js-3-3F4F75?style=for-the-badge&logo=plotly&logoColor=white" alt="Plotly.js">
  <img src="https://img.shields.io/badge/ApexCharts-6-FF4560?style=for-the-badge&logo=apexcharts&logoColor=white" alt="ApexCharts">
</p>

</div>

**Brasil em Números** é um dashboard interativo para explorar indicadores socioeconômicos dos estados brasileiros. A aplicação combina um mapa do Brasil, filtros por região e estado, gráficos interativos e cartões com indicadores de população, área territorial e densidade demográfica.

O front-end é desenvolvido em React com Vite e consome uma API REST independente, disponível no repositório [brasil-em-numeros-back-end](https://github.com/Davi-santos16/brasil-em-numeros-back-end).

---

## Demonstração

<div align="center">
  <img src="src/assets/showcase.gif" alt="Demonstração do dashboard Brasil em Números" width="100%">
</div>

---

## O problema

Indicadores sobre os estados brasileiros costumam estar espalhados em diferentes fontes e formatos. Isso dificulta comparar regiões, consultar dados de um estado específico e interpretar rapidamente as diferenças entre os indicadores.

O projeto reúne essas informações em uma interface visual única, permitindo alternar entre uma visão regional e uma visão detalhada de cada estado.

## Dores e soluções

| Dor | Solução adotada |
|-----|------------------|
| Dados distribuídos em diferentes fontes | A API centraliza estados e indicadores em endpoints próprios |
| Dificuldade para comparar regiões | O mapa e os filtros permitem selecionar Norte, Nordeste, Centro-Oeste, Sudeste e Sul |
| Indicadores difíceis de interpretar | KPIs, gráficos Plotly e gráfico polar exibem os dados de forma visual |
| Consulta repetida à API externa | O back-end usa cache no PostgreSQL para dashboard e indicadores estaduais |
| Seleção de estado pouco intuitiva | O mapa permite escolher uma região e, em seguida, um estado |
| Estados sem uma referência padronizada | O seed sincroniza os 26 estados e o Distrito Federal com a API pública do IBGE |
| Carregamentos que prejudicam a experiência | A interface possui estados de loading, skeleton e tratamento de erro |

---

## Funcionalidades

| Área | Funcionalidades |
|------|-----------------|
| **Dashboard** | Visão geral do indicador selecionado por região |
| **Filtros** | Seleção de indicador, região e estado |
| **Mapa** | Mapa interativo do Brasil com seleção visual por região e estado |
| **Indicadores regionais** | Média, maior valor, menor valor e gráfico da região |
| **Indicadores estaduais** | População, área, densidade demográfica e gráfico polar |
| **Gráficos** | Visualizações interativas com Plotly.js e ApexCharts |
| **Responsividade** | Layout adaptado para telas pequenas e grandes |
| **API** | Integração com estados, dashboard e indicadores estaduais |

Os indicadores disponíveis no front-end são:

- População (`populacao`)
- Densidade demográfica (`densidade`)
- Área territorial (`area`)

---

## Arquitetura

```mermaid
graph LR
    U[Usuário] --> W[React + Vite]
    W -->|Axios / HTTP| A[API REST Express]
    A --> P[Prisma ORM]
    P --> D[(PostgreSQL)]
    A --> E[API externa de dados]
    W --> M[Leaflet + GeoJSON]
    W --> G[Plotly.js / ApexCharts]
```

O front-end mantém a lógica de consumo da API em services e o estado da tela no hook `useDashboard`:

```mermaid
graph TD
    C[Componentes React] --> H[useDashboard]
    H --> S[Services]
    S --> AX[Axios]
    AX --> R[Rotas Express]
    R --> CT[Controllers]
    CT --> SV[Services do back-end]
    SV --> DB[(Prisma / PostgreSQL)]
```

### Fluxo de dados

1. O front-end busca os estados em `GET /estados`.
2. Ao selecionar indicador e região, consulta `GET /dashboard`.
3. O back-end procura primeiro o resultado no cache do PostgreSQL.
4. Caso não encontre, consulta a API externa configurada em `API_DADOS_URL`, salva o resultado e devolve `figura` e `kpis`.
5. Ao selecionar um estado, o front-end consulta `GET /indicadores?estado=...` para exibir os dados estaduais.

---

## Estrutura do projeto

```text
brasil-em-numeros-front-end/
├── public/                    # Arquivos públicos do Vite
├── src/
│   ├── assets/                # GIF de demonstração e GeoJSON dos estados
│   ├── components/            # Dashboard, mapa, filtros, cards e UI
│   │   └── ui/                # Componentes reutilizáveis
│   ├── hooks/                 # Estado e efeitos do dashboard
│   ├── lib/                   # Cliente Axios e utilitários
│   ├── pages/                 # Páginas da aplicação
│   ├── services/              # Chamadas tipadas para a API
│   ├── App.tsx                # Composição principal
│   ├── index.css              # Estilos globais
│   └── main.tsx               # Entrada da aplicação
├── .env                      # Variáveis locais do Vite
├── package.json
└── vite.config.ts
```

O back-end relacionado possui a seguinte estrutura:

```text
brasil-em-numeros-back-end/
├── prisma/
│   ├── migrations/            # Histórico do banco
│   ├── schema.prisma          # Estado, Dashboard e IndicadoresEstado
│   └── seed.ts                # Sincronização dos estados pelo IBGE
├── src/
│   ├── controller/            # Controllers HTTP
│   ├── database/              # Cliente Prisma
│   ├── middleware/            # Tratamento global de erros
│   ├── routes/                # Rotas da API
│   ├── service/               # Regras e integrações externas
│   └── server.ts              # Servidor Express e Swagger
├── docker-compose.yml         # PostgreSQL local
└── package.json
```

---

## Como executar

### Pré-requisitos

- Node.js 20 ou superior
- npm
- Docker e Docker Compose, para executar o PostgreSQL localmente

### 1. Configurar o back-end

Em um diretório ao lado deste projeto, clone e configure a API:

```bash
git clone git@github.com:Davi-santos16/brasil-em-numeros-back-end.git
cd brasil-em-numeros-back-end
npm install
cp .env.example .env
```

Suba o banco, aplique as migrations, sincronize os estados e inicie a API:

```bash
docker compose up -d
npx prisma migrate dev
npm run seed
npm run dev
```

Por padrão, a API inicia em `http://localhost:3000`. A documentação Swagger fica disponível em `http://localhost:3000/docs`.

O `.env` do back-end deve conter:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/api-brasil-ibge?schema=public"
API_DADOS_URL="http://localhost:3000"
```

`API_DADOS_URL` deve apontar para a API externa que fornece as rotas `/grafico` e `/indicadores`. Em ambientes em que essa API estiver hospedada separadamente, substitua o valor pela URL correspondente.

### 2. Configurar o front-end

Em outro terminal, dentro deste repositório:

```bash
npm install
```

Crie ou ajuste o arquivo `.env`:

```env
VITE_API_URL=http://localhost:3000
```

Para usar a API publicada, configure a URL base do back-end:

```env
VITE_API_URL=https://brasil-em-numeros-back-end.onrender.com
```

Inicie o front-end:

```bash
npm run dev
```

A aplicação ficará disponível, por padrão, em `http://localhost:5173`.

### 3. Build de produção

```bash
npm run build
npm run preview
```

---

## Rotas da API consumidas

### `GET /estados`

Lista os estados cadastrados, ordenados pelo nome.

```http
GET http://localhost:3000/estados
```

Resposta resumida:

```json
{
  "estados": [
    {
      "id": 1,
      "sigla": "AC",
      "nome": "Acre",
      "regiao": {
        "id": 1,
        "sigla": "N",
        "nome": "Norte"
      }
    }
  ]
}
```

### `GET /dashboard`

Retorna os dados do gráfico e os KPIs de um indicador por região. O parâmetro `indicador` é obrigatório.

| Query parameter | Obrigatório | Valores usados pelo front-end |
|-----------------|-------------|--------------------------------|
| `indicador` | Sim | `populacao`, `area`, `densidade` |
| `regiao` | Não | `norte`, `nordeste`, `centro-oeste`, `sudeste`, `sul` |

Exemplo:

```http
GET /dashboard?indicador=populacao&regiao=sudeste
```

A resposta contém `dadosDaEquipe`, com `indicador`, `regiao`, `figura` no formato Plotly e `kpis` com total, média, maior e menor valor.

### `GET /indicadores`

Retorna os indicadores de um estado. O nome deve ser enviado em minúsculas e sem acentos, usando `_` nos nomes compostos.

```http
GET /indicadores?estado=sao_paulo
```

Resposta resumida:

```json
{
  "estado": "sao_paulo",
  "indicadores": {
    "area": { "nome": "São Paulo", "valor": 248219.5, "regiao": "SE" },
    "densidade": { "nome": "São Paulo", "valor": 178.9, "regiao": "SE" },
    "populacao": { "nome": "São Paulo", "valor": 44411238, "regiao": "SE" }
  }
}
```

### `GET /docs`

Abre a documentação interativa Swagger da API:

```text
http://localhost:3000/docs
```

---

## Banco de dados

O back-end usa PostgreSQL 16 e Prisma ORM. O schema possui três modelos:

```mermaid
erDiagram
    Estado {
        int id PK
        string sigla UK
        string nome
        json regiao
    }

    Dashboard {
        int id PK
        string indicador
        string regiao
        json figura
        json kpis
    }

    IndicadoresEstado {
        int id PK
        string estado UK
        json area
        json densidade
        json populacao
    }
```

`Dashboard` possui uma chave única composta por `indicador` e `regiao`. `IndicadoresEstado` possui uma chave única por estado. Essas restrições permitem que o back-end faça cache e atualize os registros com segurança.

O seed consulta a API pública do IBGE e sincroniza os 27 entes federativos na tabela `Estado`:

```text
https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome
```

---

## Scripts disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Inicia o Vite em modo de desenvolvimento |
| `npm run build` | Executa o type-check e gera o build de produção |
| `npm run lint` | Analisa o código com ESLint |
| `npm run preview` | Serve localmente o build de produção |

> **Nota:** o script `lint` está definido no `package.json`, mas atualmente requer a criação de um arquivo de configuração flat do ESLint (`eslint.config.js`, `eslint.config.mjs` ou `eslint.config.cjs`).

Scripts principais do back-end:

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Inicia o Express com `tsx watch` |
| `npm run build` | Compila a API para a pasta `build` |
| `npm start` | Executa a API compilada |
| `npm run seed` | Sincroniza os estados usando a API do IBGE |

---

## Autor

Projeto desenvolvido pelo **Squad 2 — Amontada Valley**.

Repositórios:

- [Front-end](https://github.com/Davi-santos16/brasil-em-numeros-front-end)
- [Back-end](https://github.com/Davi-santos16/brasil-em-numeros-back-end)
