import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import { User } from '../modules/users/entities/user.entity';
import { UserRole, UserStatus, UserLevel } from '../common/enums';

dotenv.config();

async function seedAdmins() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'waferlee',
    entities: [User],
    synchronize: false,
  });

  try {
    await dataSource.initialize();
    console.log('Data Source has been initialized!');

    const userRepository = dataSource.getRepository(User);

    // Admin password - change this after first login!
    const hashedPassword = await bcrypt.hash('Waferlee@2026!', 10);

    const admins = [
      {
        username: 'hello_waferlee',
        email: 'hello@waferlee.ae',
        passwordHash: hashedPassword,
        role: UserRole.ADMIN,
        status: UserStatus.ACTIVE,
        emailVerified: true,
        karma: 1000,
        level: UserLevel.PLATINUM,
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hello',
      },
      {
        username: 'socialmedia_waferlee',
        email: 'socialmedia@waferlee.ae',
        passwordHash: hashedPassword,
        role: UserRole.ADMIN,
        status: UserStatus.ACTIVE,
        emailVerified: true,
        karma: 1000,
        level: UserLevel.PLATINUM,
        avatarUrl:
          'https://api.dicebear.com/7.x/avataaars/svg?seed=socialmedia',
      },
    ];

    for (const admin of admins) {
      const exists = await userRepository.findOne({
        where: { email: admin.email },
      });
      if (!exists) {
        await userRepository.save(userRepository.create(admin));
        console.log(`Admin ${admin.email} created successfully!`);
      } else {
        console.log(`Admin ${admin.email} already exists, skipping.`);
      }
    }

    console.log('\\n=== Admin Seeding Completed ===');
    console.log('Email: hello@waferlee.ae');
    console.log('Email: socialmedia@waferlee.ae');
    console.log('Password: Waferlee@2026!');
    console.log('\\n⚠️  Please change these passwords after first login!');
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    await dataSource.destroy();
  }
}

seedAdmins();
