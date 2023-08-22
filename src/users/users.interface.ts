export interface IUser {
    _id: string;
    userName: string;
    email: string;
    phoneNumber: string;
    role: string;
    permissions?: {
        _id: string;
        name: string;
        apiPath: string;
        module: string;
    }[];
    }