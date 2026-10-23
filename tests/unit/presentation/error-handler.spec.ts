import { Request, Response } from 'express';
import { ConflictError, NotFoundError, ValidationError } from '../../../src/domain/errors';
import { errorHandler } from '../../../src/presentation/http/middlewares/error-handler';

function makeResponse() {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

function handle(error: Error) {
  const res = makeResponse();
  errorHandler(error, {} as Request, res, jest.fn());
  return res;
}

describe('errorHandler', () => {
  it('maps ValidationError to 400 with details', () => {
    const res = handle(new ValidationError('Invalid body', ['plate is required']));

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid body', details: ['plate is required'] });
  });

  it('maps NotFoundError to 404', () => {
    const res = handle(new NotFoundError('Car', '123'));

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Car with id "123" was not found' });
  });

  it('maps ConflictError to 409', () => {
    const res = handle(new ConflictError('Car is already in use'));

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({ error: 'Car is already in use' });
  });

  it('maps unknown errors to 500 without leaking the message', () => {
    jest.spyOn(console, 'error').mockImplementation(() => undefined);

    const res = handle(new Error('database exploded'));

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
  });
});
