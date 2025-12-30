import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { VotesService } from '../modules/votes/votes.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const votesService = app.get(VotesService);

  try {
    console.log('Calling getAnalytics...');
    const result = await votesService.getAnalytics();
    console.log('Result:', result);
  } catch (error) {
    console.error('Error in getAnalytics:', error);
  } finally {
    await app.close();
  }
}

bootstrap();
