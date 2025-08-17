export interface User {
    clientPrincipal: {
        userId: string;
        userRoles: string[];
        claims: [];
        identityProvider: string;
        userDetails: string;
    };
}