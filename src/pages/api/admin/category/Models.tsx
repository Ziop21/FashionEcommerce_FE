export interface Category {
    id: string;
    name: string;
    categoryIds?: string[],
    slug?: string,
    images?: string[],
    createdAt?: Date;
    updatedAt?: Date;
    createdBy?: string;
    updatedBy?: string;
    isDeleted: boolean;
    isActive: boolean;
}
