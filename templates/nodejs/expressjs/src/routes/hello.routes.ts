import { Router } from 'express';

const helloRouter = Router();

helloRouter.get('/', async (request, response) => {
  response.send('Project created from the CLI 👉 npx @eugustavo/progen');
});

export { helloRouter };