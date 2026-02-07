import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Product {
    id: string;
    name: string;
    createdAt: bigint;
    updatedAt: bigint;
    category: ProductCategory;
    image: ExternalBlob;
    price: bigint;
}
export interface ProductSummary {
    id: string;
    name: string;
    category: ProductCategory;
    image: ExternalBlob;
    price: bigint;
}
export interface ProductInput {
    name: string;
    category: ProductCategory;
    image: ExternalBlob;
    price: bigint;
}
export interface UserProfile {
    name: string;
}
export enum ProductCategory {
    food = "food",
    grocery = "grocery"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createProduct(token: string, input: ProductInput): Promise<ProductSummary>;
    deleteProduct(token: string, id: string): Promise<void>;
    getAllProducts(): Promise<Array<ProductSummary>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getFoodProducts(): Promise<Array<ProductSummary>>;
    getGroceryProducts(): Promise<Array<ProductSummary>>;
    getProduct(id: string): Promise<Product>;
    getProductImage(id: string): Promise<ExternalBlob>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isAdminSession(token: string): Promise<boolean>;
    isCallerAdmin(): Promise<boolean>;
    loginAdmin(username: string, password: string): Promise<string>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateProduct(token: string, id: string, input: ProductInput): Promise<ProductSummary>;
}
