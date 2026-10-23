const idParameter = {
  name: 'id',
  in: 'path',
  required: true,
  schema: { type: 'string' },
};

const jsonBody = (schema: string) => ({
  required: true,
  content: { 'application/json': { schema: { $ref: `#/components/schemas/${schema}` } } },
});

const jsonResponse = (description: string, schema: object) => ({
  description,
  content: { 'application/json': { schema } },
});

const ref = (name: string) => ({ $ref: `#/components/schemas/${name}` });
const listOf = (name: string) => ({ type: 'array', items: ref(name) });
const response = (name: string) => ({ $ref: `#/components/responses/${name}` });

export const openApiDocument = {
  openapi: '3.0.3',
  info: {
    title: 'backend-web-test',
    version: '1.0.0',
    description: 'WebAPI para controle de utilização dos automóveis de uma empresa.',
  },
  tags: [{ name: 'Automóveis' }, { name: 'Motoristas' }, { name: 'Utilizações' }],
  paths: {
    '/cars': {
      get: {
        tags: ['Automóveis'],
        summary: 'Lista os automóveis',
        parameters: [
          {
            name: 'color',
            in: 'query',
            schema: { type: 'string' },
            description: 'Cor (sem diferenciar maiúsculas e acentos)',
          },
          {
            name: 'brand',
            in: 'query',
            schema: { type: 'string' },
            description: 'Marca (sem diferenciar maiúsculas e acentos)',
          },
        ],
        responses: { 200: jsonResponse('Lista de automóveis', listOf('Car')), 400: response('BadRequest') },
      },
      post: {
        tags: ['Automóveis'],
        summary: 'Cadastra um automóvel',
        requestBody: jsonBody('CarInput'),
        responses: {
          201: jsonResponse('Automóvel cadastrado', ref('Car')),
          400: response('BadRequest'),
          409: response('Conflict'),
        },
      },
    },
    '/cars/{id}': {
      parameters: [idParameter],
      get: {
        tags: ['Automóveis'],
        summary: 'Recupera um automóvel',
        responses: { 200: jsonResponse('Automóvel', ref('Car')), 404: response('NotFound') },
      },
      put: {
        tags: ['Automóveis'],
        summary: 'Atualiza um automóvel',
        requestBody: jsonBody('CarInput'),
        responses: {
          200: jsonResponse('Automóvel atualizado', ref('Car')),
          400: response('BadRequest'),
          404: response('NotFound'),
          409: response('Conflict'),
        },
      },
      delete: {
        tags: ['Automóveis'],
        summary: 'Exclui um automóvel',
        responses: { 204: { description: 'Automóvel excluído' }, 404: response('NotFound'), 409: response('Conflict') },
      },
    },
    '/drivers': {
      get: {
        tags: ['Motoristas'],
        summary: 'Lista os motoristas',
        parameters: [
          {
            name: 'name',
            in: 'query',
            schema: { type: 'string' },
            description: 'Parte do nome (sem diferenciar maiúsculas e acentos)',
          },
        ],
        responses: { 200: jsonResponse('Lista de motoristas', listOf('Driver')), 400: response('BadRequest') },
      },
      post: {
        tags: ['Motoristas'],
        summary: 'Cadastra um motorista',
        requestBody: jsonBody('DriverInput'),
        responses: { 201: jsonResponse('Motorista cadastrado', ref('Driver')), 400: response('BadRequest') },
      },
    },
    '/drivers/{id}': {
      parameters: [idParameter],
      get: {
        tags: ['Motoristas'],
        summary: 'Recupera um motorista',
        responses: { 200: jsonResponse('Motorista', ref('Driver')), 404: response('NotFound') },
      },
      put: {
        tags: ['Motoristas'],
        summary: 'Atualiza um motorista',
        requestBody: jsonBody('DriverInput'),
        responses: {
          200: jsonResponse('Motorista atualizado', ref('Driver')),
          400: response('BadRequest'),
          404: response('NotFound'),
        },
      },
      delete: {
        tags: ['Motoristas'],
        summary: 'Exclui um motorista',
        responses: { 204: { description: 'Motorista excluído' }, 404: response('NotFound'), 409: response('Conflict') },
      },
    },
    '/car-usages': {
      get: {
        tags: ['Utilizações'],
        summary: 'Lista as utilizações com motorista e automóvel',
        responses: { 200: jsonResponse('Lista de utilizações', listOf('CarUsage')) },
      },
      post: {
        tags: ['Utilizações'],
        summary: 'Inicia a utilização de um automóvel por um motorista',
        requestBody: jsonBody('StartCarUsageInput'),
        responses: {
          201: jsonResponse('Utilização iniciada', ref('CarUsage')),
          400: response('BadRequest'),
          404: response('NotFound'),
          409: response('Conflict'),
        },
      },
    },
    '/car-usages/{id}/finish': {
      parameters: [idParameter],
      patch: {
        tags: ['Utilizações'],
        summary: 'Finaliza uma utilização',
        requestBody: { ...jsonBody('FinishCarUsageInput'), required: false },
        responses: {
          200: jsonResponse('Utilização finalizada', ref('CarUsage')),
          400: response('BadRequest'),
          404: response('NotFound'),
          409: response('Conflict'),
        },
      },
    },
  },
  components: {
    schemas: {
      CarInput: {
        type: 'object',
        required: ['plate', 'color', 'brand'],
        properties: {
          plate: { type: 'string', example: 'ABC1D23', description: 'Padrão antigo (ABC1234, ABC-1234) ou Mercosul' },
          color: { type: 'string', example: 'Preto' },
          brand: { type: 'string', example: 'Fiat' },
        },
      },
      Car: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          plate: { type: 'string', example: 'ABC1D23' },
          color: { type: 'string', example: 'Preto' },
          brand: { type: 'string', example: 'Fiat' },
        },
      },
      DriverInput: {
        type: 'object',
        required: ['name'],
        properties: { name: { type: 'string', example: 'João da Silva' } },
      },
      Driver: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string', example: 'João da Silva' },
        },
      },
      StartCarUsageInput: {
        type: 'object',
        required: ['carId', 'driverId', 'reason'],
        properties: {
          carId: { type: 'string', format: 'uuid' },
          driverId: { type: 'string', format: 'uuid' },
          reason: { type: 'string', example: 'Visita ao cliente' },
          startDate: { type: 'string', format: 'date-time', description: 'Padrão: data atual' },
        },
      },
      FinishCarUsageInput: {
        type: 'object',
        properties: {
          endDate: { type: 'string', format: 'date-time', description: 'Padrão: data atual' },
        },
      },
      CarUsage: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          reason: { type: 'string', example: 'Visita ao cliente' },
          startDate: { type: 'string', format: 'date-time' },
          endDate: { type: 'string', format: 'date-time', nullable: true },
          driver: ref('Driver'),
          car: ref('Car'),
        },
      },
      Error: {
        type: 'object',
        properties: { error: { type: 'string' } },
      },
      ValidationError: {
        type: 'object',
        properties: {
          error: { type: 'string', example: 'Invalid car data' },
          details: { type: 'array', items: { type: 'string' }, example: ['plate is required'] },
        },
      },
    },
    responses: {
      BadRequest: jsonResponse('Dados inválidos', ref('ValidationError')),
      NotFound: jsonResponse('Recurso não encontrado', ref('Error')),
      Conflict: jsonResponse('Conflito com uma regra de negócio', ref('Error')),
    },
  },
};
