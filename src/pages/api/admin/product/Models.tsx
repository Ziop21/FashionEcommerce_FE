export interface Product {
    id?: string,
    name: string,
    slug?: string,
    description: string,
    price: number,
    promotionalPrice?: number,
    view?: number,
    isSelling: boolean,
    images: string[],
    rating?: number,
    isDeleted: boolean,
    isActive: boolean,
    createdBy?: string,
    updatedBy?: string,
    createdAt?: Date;
    updatedAt?: Date;
}