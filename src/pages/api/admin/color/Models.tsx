export interface Color {
    id?: string;
    name: string;
    code: string;
    createdAt?: Date;
    updatedAt?: Date;
    createdBy?: string;
    updatedBY?: string;
    isDeleted: boolean;
    isActive: boolean;
}