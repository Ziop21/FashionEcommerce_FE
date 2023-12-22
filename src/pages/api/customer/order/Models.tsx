export interface OrderItem {
    quantity: number;
    stockId: string;
    productId: string;
    productName: string;
    price: number;
    sizeId: string;
    sizeName: string;
    colorId: string;
    colorName: string;
}

export enum EOrderStatus {
    CANCELING = 'CANCELING',
    WAITING = 'WAITING',
    SHIPPING = 'SHIPPING',
    COMPLETED = 'COMPLETED',
}

export interface Order {
    id?: string;
    username: string;
    address: string;
    phone: string;
    orderItems: OrderItem[];
    deliveryId: string;
    deliveryName: string;
    shippingFee: number;
    status: EOrderStatus;
    isPaidBefore: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}