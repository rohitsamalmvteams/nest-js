import { Test, TestingModule } from '@nestjs/testing';
import { CatsController } from './cats.controller';
import { Request, Response } from 'express';
import { INestApplication, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { CreateCatDto } from './create-cat.dto';
describe('CatsController', () => {
  let controller: CatsController;
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CatsController],
    }).compile();

    controller = module.get<CatsController>(CatsController);
    app = module.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('findAll', () => {
    const mockRequest: Request = {} as Request;
    it('should return "This action return all cats"', () => {
      // Create a mock Response object
      const mockResponse: Response = {
        send: jest.fn(), // You can add other necessary methods or properties
      } as unknown as Response;

      controller.findAll(mockRequest, mockResponse);
      expect(mockResponse.send).toHaveBeenCalledWith(
        'This action return all cats',
      );
    });
  });

  describe('create', () => {
    it('should return "This action add a new cat" and have status code 200 with cache-control header', async () => {
      const response = await request(app.getHttpServer())
        .post('/cats/create')
        .expect(HttpStatus.CREATED);
      expect(response.text).toBe('This action add a new cat');
      expect(response.header['cache-control']).toBe('none');
    });
  });

  describe('breeds', () => {
    it('should return "This action return breed of the cats"', () => {
      expect(controller.getBreeds()).toBe(
        'This action return breed of the cats',
      );
    });
  });

  describe('redirection', () => {
    it('should redirect to "https://nestjs.com" with status code 301 when version is not provided or not "5"', async () => {
      const response = await request(app.getHttpServer())
        .get('/cats/redirect')
        .expect(HttpStatus.MOVED_PERMANENTLY);

      expect(response.header['location']).toBe('https://nestjs.com');
    });

    it('should redirect to "https://docs.nestjs.com/v5/" with status code 301 when version is "5"', async () => {
      const response = await request(app.getHttpServer())
        .get('/cats/redirect?version=5')
        .expect(HttpStatus.MOVED_PERMANENTLY);
      expect(response.header['location']).toBe('https://docs.nestjs.com/v5/');
    });
  });

  describe('params', () => {
    it('should return a cat with the specific id', async () => {
      const response = await request(app.getHttpServer())
        .get('/cats/1')
        .expect(HttpStatus.OK);
      expect(response.text).toBe('This action return a # 1 cat');
    });

    it('should return 404 when the cat is not found', async () => {
      const response = await request(app.getHttpServer())
        .get('/cats/999')
        .expect(HttpStatus.NOT_FOUND);
      expect(response.text).toBe('Not Found');
    });
  });

  describe('body', () => {
    it('should return 400 for invalid cat data', async () => {
      const invalidCatDto = {};
      const response = await request(app.getHttpServer())
        .post('/cats/create-body')
        .send(invalidCatDto)
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.text).toBe('Invalid cat data');
    });

    it('should create a cat and return the same data', async () => {
      const validCatDto: CreateCatDto = {
        name: 'Whiskers',
        age: 3,
        breed: 'Tabby',
      };
      const response = await request(app.getHttpServer())
        .post('/cats/create-body')
        .send(validCatDto)
        .expect(HttpStatus.CREATED);
      expect(response.body).toEqual(validCatDto);
    });
  });
});
