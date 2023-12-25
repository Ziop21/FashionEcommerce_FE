export interface UserLevel {
    id?: string;
    name: string;
    description: string;
    minPoint: number;
    discount: number;
    createdAt?: Date;
    updatedAt?: Date;
    createdBy?: string;
    updatedBy?: string;
    isDeleted: boolean;
    isActive: boolean;
}
