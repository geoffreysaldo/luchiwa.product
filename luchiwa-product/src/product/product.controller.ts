import { Body, Param, Controller, Get, Post, Delete } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './product.interface';
import { MessagePattern } from '@nestjs/microservices';

@Controller('product')
export class ProductController {

    constructor(private productService: ProductService){}

    @MessagePattern('getProductById')
    getProductById(@Body('id') id: string) {
        return this.productService.getProductById(id);
    }

    @MessagePattern('getProductsByType')
    getProductsByType(@Body('type') type: string) {
        return this.productService.getProductsByType(type);
    }

    @MessagePattern('getProductsByCategory')
    getProductByCategory(@Body('category') category: string){
        return this.productService.getProductsByCategory(category);
    }

    @MessagePattern('getCategoriesOfType')
    getCategoriesOfType(@Body('type') type: string){
        return this.productService.getCategoriesOfType(type);
    }

    @MessagePattern('getCategories')
    getCategories() {
        return this.productService.getCategories();
    }

    @MessagePattern('createProduct')
    createProduct(@Body() product: Product){
        return this.productService.createProduct(product);
    }

    @MessagePattern('searchByKeyword')
    search(@Body() searchProduct: string){
        return this.productService.search(searchProduct);
    };

    @MessagePattern('deleteProduct')
    deleteProduct(@Body('id') id: any){
        return this.productService.deleteProduct(id);
    }


    @MessagePattern('updateProduct')
    updateProduct(@Body() product: Product){
        return this.productService.updateProduct(product);
    }
}
