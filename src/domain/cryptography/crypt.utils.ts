import bcrypt from 'bcrypt';

export class CryptUtils {

	public static hashPassword(password: string): string {
		
		const salt = bcrypt.genSaltSync(10);

		return bcrypt.hashSync(password, salt);
	}

	public static comparePassword(password: string, hash: string): boolean {
		
		return bcrypt.compareSync(password, hash);
	}
}