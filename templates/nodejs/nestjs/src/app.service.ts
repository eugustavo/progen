import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Project created from the CLI 👉 npx @eugustavo/progen';
  }
}
