import AuthenJwtDecoder from "@/utils/AuthenJwtDecoder"

export const getCurrentUserRoles = async (token: string) => {
    const claims = await AuthenJwtDecoder(token);
    if (claims) {
        return claims.roles;
    }
    return undefined;
}