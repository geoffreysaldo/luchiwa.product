import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Product} from './product.interface';

@Injectable()
export class ProductService {

    constructor(
        private readonly elasticsearchService: ElasticsearchService
    ){}

    async getProductById(id: string) {
        const product = await this.elasticsearchService.search({
            index: 'product',
            body: {
                query: {
                    match: { _id: id }
                }
            }
        })
        return product.body.hits.hits
    }

    async getProductsByType(type: string) {
        const products = await this.elasticsearchService.search({
            index: 'product',
            body: {
                query: {
                    match: { type: type }
                }
            }
        })
        console.log(products.body.hits.hits);
        return products.body.hits.hits
    }

    async getProductsByCategory(category: string) {
        const products = await this.elasticsearchService.search({
            index: 'product',
            body: {
                query: {
                    match: { category: category }
                }
            }
        })
        return products.body.hits.hits
    }

    async getCategoriesOfType(type: string) {
        let categoriesArray = [];
        const categories = await this.elasticsearchService.search({
            index: 'product',
            body: {
                query: {
                    match: { type: type }
                },
                "aggs" : {
                    "categories" : {
                        "terms" : { 
                            "field" : "categoryName.keyword",  
                        },
                            "aggs": {
                                "url": {
                                    "terms": {
                                        "field": "categoryUrl.keyword"
                                    },
                                }
                            },
                        }
                    }
            }})
        categories.body.aggregations.categories.buckets.map((category) => {
            console.log(category.url.buckets);
            categoriesArray.push({"categoryName":category.key, categoryUrl:category.url.buckets[0].key})
        })
        return categoriesArray;
    }

    async getCategories() {
        const categories = await this.elasticsearchService.search({
            index:'product',
            body: {
                "aggs" : {
                    "categories" : {
                        "terms" : { "field" : "categoryName.keyword",
                                    "size" : 500 }
                    }
                }}
        })
        return categories.body.aggregations.categories.buckets;
    }

    async createProduct(productInput: any) {
        console.log(productInput)
        const product = productInput;
        product.categoryName = productInput.category;
        product.categoryUrl = productInput.category.split(' ')[0].toLowerCase();
        product.total = Number((productInput.totalTaxInclusive / (1 + (productInput.taxRate / 100))).toFixed(2));
        console.log(product)
        return this.elasticsearchService.index<Product, any>({
            index: "product",
            body: product
        })
    }

    async search(searchProduct: string) {
        const products = await this.elasticsearchService.search({
            index: 'product',
            body: {
                query: {
                        terms: {
                          keywords: [searchProduct]
                        }
                }
            }
        })
        return products;
    }

    async deleteProduct(id: any) {
        return await this.elasticsearchService.delete({
            index: 'product',
            id: id
            });
    }

    async updateProduct(product:Product) {
        const categoryUrl = product.categoryName.split(' ')[0].toLowerCase()
        return await this.elasticsearchService.update({
            index: 'product',
            id: product.id,
            body: {
                doc: {
                    name: product.name,
                    category: {
                        name: product.categoryName,
                        url: categoryUrl},
                    total: product.total,
                    totalTaxInclusive: product.totalTaxInclusive,
                    taxRate: product.taxRate,
                    keywords: product.keywords,
                    imageUrl: product.imageUrl,
                }
            }
        })
    }
}
