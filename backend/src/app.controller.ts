import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('app')
@Controller()
export class AppController {
  @Get()
  @ApiOkResponse({
    schema: {
      example: {
        service: 'backend',
        status: 'ok',
        message: 'Stackforge NestJS template is running'
      }
    }
  })
  getRoot() {
    return {
      service: 'backend',
      status: 'ok',
      message: 'Stackforge NestJS template is running'
    };
  }

  @Get('ping')
  @ApiOkResponse({
    schema: { example: { pong: true } }
  })
  getPing() {
    return { pong: true };
  }
}
