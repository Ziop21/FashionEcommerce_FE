export interface Size {
    id?: string;
    name: string;
    createdAt?: Date;
    updatedAt?: Date;
    createdBy?: string;
    updatedBy?: string;
    isDeleted: boolean;
    isActive: boolean;
}
