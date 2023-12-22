export interface Stock {
    id: string,
    sizeId: string,
    colorId: string,
    quantity: number,
    reviews: Review[]
}
 
interface Review {
    sizeName: string,
    colorName: string,
    orderId: string,
    userId: string,
    username: string,
    content: string,
    rating: number,
    images: string[],
    createdAt: Date,
    updatedAt: Date
}