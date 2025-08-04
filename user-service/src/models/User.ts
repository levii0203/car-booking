export enum Role {
    'User',
    'Rider'
}

export default interface User {
    id?: BigInteger,
    email: string,
    password_hash: string,
    role: Role,
    name: string,
    phone: string,
    created_at?: Date,
    updated_at?: Date 

}