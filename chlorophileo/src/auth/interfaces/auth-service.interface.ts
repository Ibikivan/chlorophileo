export interface IAuthService {
    signOut(userId: string): Promise<void>;
}