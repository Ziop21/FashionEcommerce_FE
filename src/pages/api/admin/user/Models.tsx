export interface User {
    id?: string;
    roles: Role[];
    firstName?: string;
    lastName?: string;
    slug?: string;
    idCard?: string;
    email: string;
    phones?: string[];
    password?: string;
    hashedPassword?: string;
    isEmailActive: boolean;
    isPhoneActive?: boolean;
    addresses?: string[];
    avatar?: string;
    point?: number;
    eWallet?: string;
    userLevelId?: string;
    isDeleted: boolean;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    createdBy?: string;
    updatedBy?: string;
}
  
export interface Role {
    name: ERole
}

export enum ERole {
    GUEST = "GUEST",
    CUSTOMER = "CUSTOMER",
    ADMIN = "ADMIN",
    MANAGER = "MANAGER",
    STAFF = "STAFF"
}