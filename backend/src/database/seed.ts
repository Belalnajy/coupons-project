import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import { User } from '../modules/users/entities/user.entity';
import { Category } from '../modules/categories/entities/category.entity';
import { Store } from '../modules/stores/entities/store.entity';
import { Deal } from '../modules/deals/entities/deal.entity';
import { Coupon } from '../modules/coupons/entities/coupon.entity';
import { Comment } from '../modules/comments/entities/comment.entity';
import { Vote } from '../modules/votes/entities/vote.entity';
import { DealImage } from '../modules/deals/entities/deal-image.entity';
import {
  UserRole,
  UserStatus,
  UserLevel,
  DealStatus,
  VoteType,
} from '../common/enums';

dotenv.config();

async function seed() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'waferlee',
    entities: [User, Category, Store, Deal, Coupon, Comment, Vote, DealImage],
    synchronize: true,
  });

  try {
    await dataSource.initialize();
    console.log('Data Source has been initialized!');

    const userRepository = dataSource.getRepository(User);
    const categoryRepository = dataSource.getRepository(Category);
    const storeRepository = dataSource.getRepository(Store);
    const dealRepository = dataSource.getRepository(Deal);
    const couponRepository = dataSource.getRepository(Coupon);
    const commentRepository = dataSource.getRepository(Comment);
    const voteRepository = dataSource.getRepository(Vote);
    const dealImageRepository = dataSource.getRepository(DealImage);

    // 1. Create Users
    const hashedPassword = await bcrypt.hash('password123', 10);
    const users = [
      {
        username: 'admin',
        email: 'admin@waferlee.com',
        passwordHash: hashedPassword,
        role: UserRole.ADMIN,
        status: UserStatus.ACTIVE,
        karma: 1500,
        level: UserLevel.PLATINUM,
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
      },
      {
        username: 'belalnajy',
        email: 'belal@example.com',
        passwordHash: hashedPassword,
        role: UserRole.USER,
        status: UserStatus.ACTIVE,
        karma: 800,
        level: UserLevel.GOLD,
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=belal',
      },
      {
        username: 'sarah_deals',
        email: 'sarah@example.com',
        passwordHash: hashedPassword,
        role: UserRole.USER,
        status: UserStatus.ACTIVE,
        karma: 300,
        level: UserLevel.SILVER,
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
      },
    ];

    for (const u of users) {
      const exists = await userRepository.findOne({
        where: { username: u.username },
      });
      if (!exists) {
        await userRepository.save(userRepository.create(u));
        console.log(`User ${u.username} created`);
      }
    }

    const adminUser = await userRepository.findOne({
      where: { username: 'admin' },
    });
    const belalUser = await userRepository.findOne({
      where: { username: 'belalnajy' },
    });

    // 2. Create Categories
    const categories = [
      { name: 'Electronics', slug: 'electronics', icon: 'elec', sortOrder: 1 },
      { name: 'Fashion', slug: 'fashion', icon: 'fashion', sortOrder: 2 },
      { name: 'Home', slug: 'home', icon: 'home', sortOrder: 3 },
      { name: 'Beauty', slug: 'beauty', icon: 'beauty', sortOrder: 4 },
      { name: 'Travel', slug: 'travel', icon: 'travel', sortOrder: 5 },
    ];

    for (const c of categories) {
      const exists = await categoryRepository.findOne({
        where: { slug: c.slug },
      });
      if (!exists) {
        await categoryRepository.save(categoryRepository.create(c));
        console.log(`Category ${c.name} created`);
      }
    }

    // 3. Create Stores
    const stores = [
      {
        name: 'Amazon',
        slug: 'amazon',
        logoUrl: 'https://logo.clearbit.com/amazon.com',
        websiteUrl: 'https://amazon.com',
      },
      {
        name: 'Noon',
        slug: 'noon',
        logoUrl: 'https://logo.clearbit.com/noon.com',
        websiteUrl: 'https://noon.com',
      },
      {
        name: 'H&M',
        slug: 'hm',
        logoUrl: 'https://logo.clearbit.com/hm.com',
        websiteUrl: 'https://hm.com',
      },
    ];

    for (const s of stores) {
      const exists = await storeRepository.findOne({ where: { slug: s.slug } });
      if (!exists) {
        await storeRepository.save(storeRepository.create(s));
        console.log(`Store ${s.name} created`);
      }
    }

    const elecCat = await categoryRepository.findOne({
      where: { slug: 'electronics' },
    });
    const amazonStore = await storeRepository.findOne({
      where: { slug: 'amazon' },
    });

    // 4. Create Deals
    if (adminUser && elecCat && amazonStore) {
      const deals = [
        {
          title: 'iPhone 15 Pro Max - 256GB',
          description: 'Best price for iPhone 15 Pro Max on Amazon.',
          dealUrl: 'https://amazon.com/iphone15',
          originalPrice: 1199,
          dealPrice: 1049,
          userId: adminUser.id,
          categoryId: elecCat.id,
          storeId: amazonStore.id,
          status: DealStatus.APPROVED,
          temperature: 150,
        },
        {
          title: 'Sony WH-1000XM5',
          description: 'Top-tier noise cancelling headphones.',
          dealUrl: 'https://amazon.com/sony-xm5',
          originalPrice: 399,
          dealPrice: 299,
          userId: belalUser?.id || adminUser.id,
          categoryId: elecCat.id,
          storeId: amazonStore.id,
          status: DealStatus.APPROVED,
          temperature: 80,
        },
      ];

      for (const d of deals) {
        const exists = await dealRepository.findOne({
          where: { title: d.title },
        });
        if (!exists) {
          const deal = await dealRepository.save(dealRepository.create(d));
          console.log(`Deal ${d.title} created`);

          // Add image
          await dealImageRepository.save(
            dealImageRepository.create({
              dealId: deal.id,
              url: 'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?auto=format&fit=crop&q=80&w=800',
              isPrimary: true,
            }),
          );

          // Add a comment
          if (belalUser) {
            await commentRepository.save(
              commentRepository.create({
                dealId: deal.id,
                userId: belalUser.id,
                content: 'Great deal, just bought one!',
              }),
            );
          }

          // Add a vote
          if (belalUser) {
            await voteRepository.save(
              voteRepository.create({
                dealId: deal.id,
                userId: belalUser.id,
                type: VoteType.HOT,
              }),
            );
          }
        }
      }
    }

    // 5. Create Coupons
    if (adminUser && amazonStore) {
      const coupons = [
        {
          title: '20% Off All Electronics',
          code: 'ELEC20',
          description: 'Save big on your next electronics purchase.',
          storeId: amazonStore.id,
          userId: adminUser.id,
          discountValue: '20%',
          isVerified: true,
        },
        {
          title: '$50 Off Orders Over $500',
          code: 'SAVE50',
          description: 'Minimum spend of $500 required.',
          storeId: amazonStore.id,
          userId: adminUser.id,
          discountValue: '$50',
          isVerified: true,
        },
      ];

      for (const cp of coupons) {
        const exists = await couponRepository.findOne({
          where: { code: cp.code },
        });
        if (!exists) {
          await couponRepository.save(couponRepository.create(cp));
          console.log(`Coupon ${cp.code} created`);
        }
      }
    }

    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    await dataSource.destroy();
  }
}

seed();
