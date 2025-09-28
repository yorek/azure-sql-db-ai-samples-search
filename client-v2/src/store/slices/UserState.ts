type UserState = {
    userId: string;
    email: string;
    emailHash: string;
    provider: string;
    roles: string[];
    isAuth: boolean;
    isAdmin: boolean;
    theme: string;
}

export default UserState;
