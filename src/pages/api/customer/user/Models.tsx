export interface ChangePasswordRequest {
    oldPassword: string,
    newPassword: string,
    confirmPassword: string,
}

export interface UserResponse {
    confirmPassword: string;
    firstName: string;
    lastName: string;
    idCard: string;
    email?: string;
    phones: string[];
    addresses: string[];
    avatar: string;
    point?: number;
    eWallet: string;
}

export interface UserRequest {
    confirmPassword: string;
    firstName: string;
    lastName: string;
    idCard: string;
    phones: string[];
    addresses: string[];
    avatar: string;
    eWallet: string;
}
