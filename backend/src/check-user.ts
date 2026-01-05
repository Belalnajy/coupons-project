import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './modules/users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './modules/users/entities/user.entity';
import { Repository } from 'typeorm';

import { getRepositoryToken } from '@nestjs/typeorm';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const userRepository = app.get<Repository<User>>(getRepositoryToken(User));

  const email = 'belalnajy9@gmail.com';

  // Try to find
  const user = await userRepository.findOne({
    where: { email },
  });

  if (user) {
    console.log('Found user:', {
      id: user.id,
      email: user.email,
      emailVerified: user.emailVerified,
    });
  } else {
    console.log('No user found with email:', email);
  }

  await app.close();
}

bootstrap();
