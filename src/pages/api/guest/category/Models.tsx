export interface Category {
    id: string,
    categoryIds: string[], 
    name: string,
    slug: string,
    images: string[],
    createdAt: Date,
    updatedAt: Date
}