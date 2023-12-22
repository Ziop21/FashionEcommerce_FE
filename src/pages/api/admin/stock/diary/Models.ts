export interface StockDiary {
    id: string;
    stockId: string;
    quantity: number;
    errorQuantity: number;
    note?: string;
    isActive?: boolean;
    isDeleted?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    createdBy?: string;
    updatedBy?: string;
}