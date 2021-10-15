import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Category } from '../entities/category.entity';
import { Product } from '../entities/product.entity';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CategoriesService } from '../categories/categories.service';

describe('ProductsService', () => {
  // Mock data
  const mockCategory: Category = {
    id: '92cf3f15-eeee-462a-b8da-41485c2d6f78',
    name: 'Laptop',
    description: '',
    create_At: new Date(),
    updatee_At: new Date(),
  };

  const mockProducts = [
    {
      id: '25f6b175-f942-4755-8dd5-d4faaa4be3a7',
      name: 'Nguyen Huu Tho test 1',
      quantity: 200,
      price: 100,
      amount_view: 0,
      description: '',
      percent_discount: 0,
      create_At: new Date(),
      update_At: new Date(),
      category: mockCategory,
    },
    {
      id: '15177eb7-e174-48ae-a810-7b5a2a7b48df',
      name: 'Nguyen Huu Tho test 2',
      quantity: 200,
      price: 100,
      amount_view: 0,
      description: '',
      percent_discount: 0,
      create_At: new Date(),
      update_At: new Date(),
      category: mockCategory,
    },
    {
      id: '98c8c1f5-09ab-4105-92ab-212fa7b3d5f4',
      name: 'Nguyen Huu Tho test 3',
      quantity: 200,
      price: 100,
      amount_view: 0,
      description: '',
      percent_discount: 0,
      create_At: new Date(),
      update_At: new Date(),
      category: mockCategory,
    },
  ];

  // Mock function and service
  let mockService: ProductsService;
  let mockProductRepository: Repository<Product>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useClass: Repository
        },
        CategoriesService,
        {
          provide: getRepositoryToken(Category),
          useClass: Repository
        }
      ],
    }).compile();

    mockService = module.get<ProductsService>(ProductsService);
    mockProductRepository = module.get<Repository<Product>>(getRepositoryToken(Product));
  });

  it('should be defined', () => {
    expect(mockService).toBeDefined();
  });

  describe('findAllProducts function', () => {
    it('should be defined', async () => {
      expect(mockService.findAllProducts).toBeDefined();
    });

    it('should be display error', async () => {
      expect.assertions(1);
      await expect(mockService.findAllProducts()).rejects.toEqual(TypeError('Cannot read property \'find\' of undefined'));
    });

    it('shoule return products array', async () => {
      jest.spyOn(mockProductRepository, 'find').mockResolvedValue(mockProducts);
      expect(await mockService.findAllProducts()).toEqual(mockProducts);
    });
  });

  describe('findProductById function', () => {
    it('should be defined', () => {
      expect(mockService.findProductById).toBeDefined();
    });

    it('should be called', async () => {
      const id = '25f6b175-f942-4755-8dd5-d4faaa4be3a7';
      jest.spyOn(mockService, 'findProductById').mockImplementation(async () => mockProducts[0]);
      mockService.findProductById(id);
      expect(mockService.findProductById).toHaveBeenCalled();
      expect(mockService.findProductById).toHaveBeenCalledWith(id);
    });

    it('should be handle when rejection', async () => {
      let id = '0357b339-1926-4663-bc0d-36f17057e21d';
      return await mockService.findProductById(id).catch(err => {
        expect(err).toEqual(TypeError('Cannot read property \'findOne\' of undefined'));
      });
    });

    it('should return exception and message when product not already exists', async () => {
      const id = 'e59709cd-7914-4d7c-9e22-f08f2fc72160';
      jest.spyOn(mockProductRepository, 'findOne').mockReturnValue(undefined);
      expect(mockService.findProductById(id)).rejects.toThrow(NotFoundException);
      expect(mockService.findProductById(id)).rejects.toThrow('Product not already exist.');
    });

    it('should return a product', async () => {
      const id = '25f6b175-f942-4755-8dd5-d4faaa4be3a7';
      jest.spyOn(mockProductRepository, 'findOne').mockResolvedValueOnce(mockProducts[0]);
      expect((await mockService.findProductById(id)).id).toEqual(mockProducts[0].id);
    });
  });

  describe('deleteProduct', () => {
    it('shoule be defined', () => {
      expect(mockService.deleteProduct).toBeDefined();
    });

    it('shoule be called', () => {
      const id = '25f6b175-f942-4755-8dd5-d4faaa4be3a7';
      jest.spyOn(mockProductRepository, 'findOne').mockResolvedValue(mockProducts[0]);
      jest.spyOn(mockProductRepository, 'delete').mockResolvedValue({ "raw": [], "affected": 1 });
      jest.spyOn(mockService, 'deleteProduct');

      mockService.deleteProduct(id);

      expect(mockService.deleteProduct).toHaveBeenCalled();
      expect(mockService.deleteProduct).toHaveBeenCalledWith(id);
    });

    it('should be handle exception when catch of findOne function', async () => {
      const id = '25f6b175-f942-4755-8dd5-d4faaa4be3a7';
      return await mockService.deleteProduct(id).catch(err => {
        expect(err).toEqual(TypeError('Cannot read property \'findOne\' of undefined'));
      });
    });

    it('should be handle exception when catch of delete function', async () => {
      const product = {
        id: '25f6b175-f942-4755-8dd5-d4faaa4be3a7',
        name: 'Nguyen Huu Tho test 1',
        quantity: 200,
        price: 100,
        amount_view: 0,
        description: '',
        percent_discount: 0,
        create_At: new Date(),
        update_At: new Date(),
        category: mockCategory,
      };

      jest.spyOn(mockProductRepository, 'findOne').mockResolvedValueOnce(product);

      return await mockService.deleteProduct(product.id).catch(err => {
        expect(err).toEqual(TypeError('Cannot read property \'delete\' of undefined'));
      });
    });

    it('should return promise reject', async () => {
      let id = '6f587f3f-9592-4085-beab-4861fb26d6db';

      jest.spyOn(mockProductRepository, 'findOne').mockResolvedValueOnce(undefined);
      await expect(mockService.deleteProduct(id)).rejects.toThrow(NotFoundException);
    });
  });
});
