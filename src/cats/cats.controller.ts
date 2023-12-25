import {
  Controller,
  Get,
  Req,
  Res,
  Post,
  HttpCode,
  Header,
  Redirect,
  Query,
  Param,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CreateCatDto } from './create-cat.dto';
@Controller('cats')
export class CatsController {
  @Post('create')
  @HttpCode(201)
  @Header('Cache-Control', 'none')
  create(@Res({ passthrough: true }) response: Response): void {
    response.send('This action add a new cat');
  }

  @Get()
  findAll(@Req() request: Request, @Res() response: Response): void {
    response.send('This action return all cats');
  }

  @Get('breed')
  getBreeds(): string {
    return 'This action return breed of the cats';
  }

  @Get('redirect')
  @Redirect('https://nestjs.com', 301)
  redirect(@Query('version') version): { url: string } {
    if (version && version == '5') {
      return { url: 'https://docs.nestjs.com/v5/' };
    }
  }

  @Get(':id')
  findOne(
    @Req() request: Request,
    @Res() response: Response,
    @Param() params: any,
  ): void {
    if (params?.id == 1) {
      response.send(`This action return a # ${params.id} cat`);
    } else {
      response.sendStatus(404);
    }
  }

  @Post('create-body')
  async createWithBody(
    @Req() request: Request,
    @Res() response: Response,
    @Body() createCatDto: CreateCatDto,
  ) {
    try {
      if (
        !createCatDto ||
        !createCatDto.name ||
        !createCatDto.age ||
        !createCatDto.breed
      )
        throw new HttpException('Invalid cat data', HttpStatus.BAD_REQUEST);

      response.send(createCatDto);
    } catch (error) {
      const status =
        error instanceof HttpException
          ? error.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;
      response.status(status).send(error.message);
    }
  }
}
