export class UserModel {
    private users: { email: string; password: string }[] = [];

    public createUser(email: string, password: string): void {
        const newUser = { email, password };
        this.users.push(newUser);
    }

    public findUserByEmail(email: string): { email: string; password: string } | undefined {
        return this.users.find(user => user.email === email);
    }
}