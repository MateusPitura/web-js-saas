import { PrismaClient } from '@prisma/client';
import {
  POPULATE_CLIENT_PRIMARY_ID,
  POPULATE_CLIENT_SECONDARY_ID,
  POPULATE_ORGANIZATION_DEFAULT,
  POPULATE_ORGANIZATION_INACTIVE,
  POPULATE_USER_DEFAULT,
  POPULATE_USER_INACTIVE,
} from '../src/constants';
import { encryptPassword } from '../src/user/user.utils';
import { faker } from '@faker-js/faker';
import {
  SEED_ROLE_ADMIN_ID,
  SEED_ROLE_SALES_ID,
} from '../../shared/src/constants';

const prisma = new PrismaClient();

async function seed() {
  console.log('🌠 Started to populate database');

  await prisma.client.createMany({
    data: [
      {
        id: POPULATE_CLIENT_PRIMARY_ID,
      },
      {
        id: POPULATE_CLIENT_SECONDARY_ID,
      },
    ],
  });

  const promises: Promise<unknown>[] = [];

  promises.push(
    prisma.organization.createMany({
      data: [
        {
          ...POPULATE_ORGANIZATION_DEFAULT,
          clientId: POPULATE_CLIENT_PRIMARY_ID,
        },
        {
          ...POPULATE_ORGANIZATION_INACTIVE,
          clientId: POPULATE_CLIENT_PRIMARY_ID,
        },
      ],
    }),
  );

  promises.push(
    prisma.user.createMany({
      data: [
        {
          ...POPULATE_USER_DEFAULT,
          password: await encryptPassword({
            password: POPULATE_USER_DEFAULT.password,
          }),
          clientId: POPULATE_CLIENT_PRIMARY_ID,
          roleId: SEED_ROLE_ADMIN_ID,
        },
        {
          ...POPULATE_USER_INACTIVE,
          password: await encryptPassword({
            password: POPULATE_USER_INACTIVE.password,
          }),
          clientId: POPULATE_CLIENT_PRIMARY_ID,
          roleId: SEED_ROLE_ADMIN_ID,
        },
      ],
    }),
  );

  const usersPromise = Array.from({ length: 30 }, async (_, index) => ({
    fullName: faker.person.fullName(),
    email: faker.internet.email(),
    isActive: index > 5,
    password: await encryptPassword({ password: faker.internet.password() }),
    clientId: POPULATE_CLIENT_PRIMARY_ID,
    roleId: SEED_ROLE_SALES_ID,
  }));

  const users = await Promise.all(usersPromise);

  promises.push(
    prisma.user.createMany({
      data: users,
    }),
  );

  await Promise.all(promises);

  console.log('🌠 Successfully populated database');
}

seed()
  .catch((error) => {
    console.log('🌠 Failed to run populate', error);
    console.error(error);
  })
  .finally(() => void prisma.$disconnect());
