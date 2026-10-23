# backend-web-test

WebAPI para controlar a utilização dos automóveis de uma empresa: cadastro de automóveis, cadastro de motoristas e registro de utilização de um automóvel por um motorista.

## Stack

- Node.js 20+ e TypeScript
- Express
- Jest + ts-jest + Supertest
- Persistência em memória

## Como executar

```bash
npm install
npm run dev
```

A API sobe em `http://localhost:3000` (a porta pode ser alterada pela variável `PORT`).

```bash
curl http://localhost:3000/health
```

### Build de produção

```bash
npm run build
npm start
```

## Como testar

```bash
npm test
npm run test:coverage
```

## Arquitetura

O projeto segue Clean Architecture. As dependências apontam sempre para dentro: camadas externas conhecem as internas, nunca o contrário.

```
src/
  domain/           Entidades, erros de negócio e contratos dos repositórios
  application/      Casos de uso (regras da aplicação)
  infra/            Implementações concretas (repositórios em memória)
  presentation/     Camada HTTP: controllers, rotas e middlewares
  main/             Composição: monta o app e injeta as dependências
tests/
  unit/             Testes dos casos de uso e componentes isolados
  integration/      Testes das rotas HTTP com Supertest
```

- **domain** não depende de nada (nem de Express).
- **application** depende só do domain e recebe os repositórios por injeção no construtor.
- **infra** implementa as interfaces de repositório definidas no domain.
- **presentation** traduz HTTP para casos de uso e erros de domínio para status codes.
- **main** é o único lugar que conhece todas as camadas.

### Mapeamento de erros

| Erro de domínio   | Status HTTP |
| ----------------- | ----------- |
| `ValidationError` | 400         |
| `NotFoundError`   | 404         |
| `ConflictError`   | 409         |
| Outros            | 500         |

## Roadmap

- [x] **Sprint 0**: setup do projeto, estrutura Clean Architecture, tratamento de erros, health check
- [ ] **Sprint 1**: cadastro de automóveis (CRUD e filtro por cor e marca)
- [ ] **Sprint 2**: cadastro de motoristas (CRUD e filtro por nome)
- [ ] **Sprint 3**: utilização de automóvel (iniciar, finalizar, listar e regras de exclusividade)
- [ ] **Sprint 4**: documentação da API, decisões de projeto e acabamento
