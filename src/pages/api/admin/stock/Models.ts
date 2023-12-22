export interface Stock {
    id: string;
    productId: string;
    productName?: string;
    sizeId: string;
    sizeName?: string;
    colorId: string;
    colorName?: string;
    quantity: number;
    isActive?: boolean;
    isDeleted?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    createdBy?: string;
    updatedBy?: string;
    reviews?: Review[];
}

export interface Review {
    userId: string;
    content?: string;
    rating: number;
    images?: string[];
    createdAt?: Date;
    updatedAt?: Date;
    createdBy?: string;
    updatedBy?: string;
}