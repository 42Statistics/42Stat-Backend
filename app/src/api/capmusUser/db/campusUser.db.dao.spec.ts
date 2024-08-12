import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { AppRootModule } from 'src/app.module';
import { CacheUtilModule } from 'src/cache/cache.util.module';
import { CampusUserDao } from './campusUser.db.dao';
import { campus_user, CampusUserSchema } from './campusUser.db.schema';

describe(CampusUserDao.name, () => {
  let moduleRef: TestingModule;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [
        AppRootModule,
        CacheUtilModule,
        MongooseModule.forFeature([
          { name: campus_user.name, schema: CampusUserSchema },
        ]),
      ],
      providers: [CampusUserDao],
    }).compile();
  });

  afterAll(async () => await moduleRef.close());

  describe('findAllTransferOutUserId', () => {
    let dao: CampusUserDao;

    beforeAll(() => {
      dao = moduleRef.get(CampusUserDao);
    });

    it('should be defined', () => {
      expect(dao.findAllTransferOutUserId).toBeDefined();
    });

    it('user id number array 반환', async () => {
      const result = await dao.findAllTransferOutUserId();

      expect(result).toBeInstanceOf(Array);
      expect(result.every((v) => typeof v === 'number')).toBe(true);
    });
  });
});
