export interface TLoginRequest {
    email: string;
    password: string;
}

 export interface TLoginResponse {
    code: number;
    msg?: string;
    data?: {
        token?: string;
        user?: {
            id?: string;
            email?: string;
            fullName?: string;
        };
    };
}


