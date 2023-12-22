export interface OrderItem {
    quantity: number;
    stockId: string;
    name?: string;
    createdAt?: Date;
    updatedAt?: Date;
    isDeleted?: boolean;
    isActive?: boolean;
}

export enum EOrderStatus {
    CANCELING = 'CANCELING',
    WAITING = 'WAITING',
    SHIPPING = 'SHIPPING',
    COMPLETED = 'COMPLETED',
}

export interface Order {
    id?: string;
    userId: string;
    username: string;
    address: string;
    phone: string;
    orderItems: OrderItem[];
    deliveryId: string;
    shippingFee: number;
    status: EOrderStatus;
    isPaidBefore: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    isDeleted: boolean;
    isActive: boolean;
}