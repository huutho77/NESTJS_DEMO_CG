import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { CreateProductDTO } from '../dto/product-create.dto';
import { UpdateProductDTO } from '../dto/product-update.dto';
import { Product } from '../entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(@InjectRepository(Product) private productRepository: Repository<Product>) { }

  async findAllProducts(): Promise<Product[]> {
    return await this.productRepository.find();
  }

  async findProductById(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({ id });
    if (!product) { throw new NotFoundException('Product not already exist.'); }
    return product;
  }

  async createNewProduct(newProduct: CreateProductDTO): Promise<Product> {
    // Check product exists
    if (this.productRepository.findOne({ name: newProduct.name })) {
      throw new ConflictException('Product is already exists.');
    }

    let product = this.productRepository.create(newProduct);

    product.id = uuidv4();
    product.create_At = new Date(Date.now());
    product.update_At = new Date(Date.now());

    return await this.productRepository.save(product);
  }

  async updateProduct(id: string, dataChange: UpdateProductDTO): Promise<Product> {
    let updateProduct = await this.findProductById(id);

    updateProduct.name = this.checkChangeData(updateProduct.name, dataChange.name);
    updateProduct.quantity = this.checkChangeData(updateProduct.quantity, dataChange.quantity);
    updateProduct.price = this.checkChangeData(updateProduct.price, dataChange.price);
    updateProduct.description = this.checkChangeData(updateProduct.description, dataChange.description);
    updateProduct.create_At = this.checkChangeData(updateProduct.create_At, dataChange.create_At);
    updateProduct.update_At = new Date();

    return await this.productRepository.save(updateProduct);
  }

  async deleteProduct(id: string) {
    let productDelete = await this.findProductById(id);
    await this.productRepository.remove(productDelete);
    return await this.findAllProducts();
  }

  checkChangeData(oldValue: any, newValue: any): any {
    if (!newValue) { return oldValue; }
    return oldValue !== newValue ? newValue : oldValue;
  }
}
