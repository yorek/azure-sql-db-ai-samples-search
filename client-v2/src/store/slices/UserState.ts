type UserState = {
    userId: string;
    email: string;
    emailHash: string;
    provider: string;
    roles: string[];
    isAuth: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canCreate: boolean;
    theme: string;
}

export default UserState;
