export interface CategoryProduct {
    id?: string;
    categoryId: string,
    productId: string,
    createdAt?: Date;
    updatedAt?: Date;
    createdBy?: string;
    updatedBy?: string;
    isDeleted: boolean;
    isActive: boolean;
}
