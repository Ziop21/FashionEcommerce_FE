export interface Delivery {
    id?: string;
    name: string;
    description: string;
    createdAt?: Date;
    updatedAt?: Date;
    createdBy?: string;
    updatedBy?: string;
    isDeleted: boolean;
    isActive: boolean;
}
