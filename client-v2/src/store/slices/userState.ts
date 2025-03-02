import { Theme } from "@fluentui/react-components";

type UserState = {
    fullName: string;
    email: string;
    emailHash: string;
    token: string;
    role: string;
    isAuth: boolean;
    theme: Theme;
}

export default UserState;