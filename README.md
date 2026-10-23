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

## Endpoints

### Automóveis

| Método   | Rota        | Descrição                                       | Sucesso |
| -------- | ----------- | ----------------------------------------------- | ------- |
| `POST`   | `/cars`     | Cadastra um automóvel                           | 201     |
| `GET`    | `/cars`     | Lista automóveis (filtros `color` e `brand`)    | 200     |
| `GET`    | `/cars/:id` | Recupera um automóvel pelo id                   | 200     |
| `PUT`    | `/cars/:id` | Atualiza um automóvel (todos os campos)         | 200     |
| `DELETE` | `/cars/:id` | Exclui um automóvel                             | 204     |

```bash
curl -X POST http://localhost:3000/cars \
  -H "Content-Type: application/json" \
  -d '{"plate": "ABC1D23", "color": "Preto", "brand": "Fiat"}'

curl "http://localhost:3000/cars?color=preto&brand=fiat"
```

### Motoristas

| Método   | Rota           | Descrição                                     | Sucesso |
| -------- | -------------- | --------------------------------------------- | ------- |
| `POST`   | `/drivers`     | Cadastra um motorista                         | 201     |
| `GET`    | `/drivers`     | Lista motoristas (filtro `name`, busca parcial) | 200     |
| `GET`    | `/drivers/:id` | Recupera um motorista pelo id                 | 200     |
| `PUT`    | `/drivers/:id` | Atualiza um motorista                         | 200     |
| `DELETE` | `/drivers/:id` | Exclui um motorista                           | 204     |

```bash
curl -X POST http://localhost:3000/drivers \
  -H "Content-Type: application/json" \
  -d '{"name": "João da Silva"}'

curl "http://localhost:3000/drivers?name=joao"
```

### Utilização de automóveis

| Método  | Rota                      | Descrição                                               | Sucesso |
| ------- | ------------------------- | ------------------------------------------------------- | ------- |
| `POST`  | `/car-usages`             | Inicia a utilização de um automóvel por um motorista    | 201     |
| `PATCH` | `/car-usages/:id/finish`  | Finaliza a utilização                                   | 200     |
| `GET`   | `/car-usages`             | Lista as utilizações com motorista e automóvel          | 200     |

`startDate` e `endDate` são opcionais (formato ISO 8601). Quando não são enviados, é usada a data atual.

```bash
curl -X POST http://localhost:3000/car-usages \
  -H "Content-Type: application/json" \
  -d '{"carId": "<id do automóvel>", "driverId": "<id do motorista>", "reason": "Visita ao cliente"}'

curl -X PATCH http://localhost:3000/car-usages/<id da utilização>/finish

curl http://localhost:3000/car-usages
```

Exemplo de resposta:

```json
{
  "id": "6f1c...",
  "reason": "Visita ao cliente",
  "startDate": "2026-10-20T08:00:00.000Z",
  "endDate": null,
  "driver": { "id": "a3b2...", "name": "João da Silva" },
  "car": { "id": "9d4e...", "plate": "ABC1D23", "color": "Preto", "brand": "Fiat" }
}
```

Regras:

- Um automóvel só pode ser utilizado por um motorista por vez, e um motorista só pode utilizar um automóvel por vez (`409`).
- A data de término não pode ser anterior à data de início (`400`), e uma utilização finalizada não pode ser finalizada de novo (`409`).
- Automóveis e motoristas que possuem registros de utilização não podem ser excluídos (`409`).
