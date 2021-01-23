export interface ProductInput {
    name: string;
    type: string;
    category: string;
    totalTaxInclusive: number;
    taxRate: number;
    keywords: string[];
    imageUrl: string;
    description: string;
}


export interface Product {
    id: string;
    name: string;
    type: string;
    categoryName: string,
    categoryUrl: string
    total: number;
    totalTaxInclusive: number;
    taxRate: number;
    keywords: string[];
    imageUrl: string;
    description: string;
}

