import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ElasticsearchModule } from '@nestjs/elasticsearch';

@Module({
  imports: [
    ElasticsearchModule.register({
      node: 'http://localhost:9200',
  })
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
