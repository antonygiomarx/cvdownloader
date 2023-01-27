import { Test, TestingModule } from '@nestjs/testing';
import { StorageService } from './storage.service';
import { StorageController } from '@/modules/storage/storage.controller';

describe('FilesController', () => {
  let controller: StorageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StorageController],
      providers: [StorageService],
    }).compile();

    controller = module.get<StorageController>(StorageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
