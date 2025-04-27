import { CryptUtils } from "../cryptography/crypt.utils";
import { Id } from "../valueObjects/id";

export class Identity {

	constructor(email: string, password: string, authProvider: string, id?: bigint) {
		this.id = id ?? Id.new();
		this.email = email;
		this.password = password;
		this.authProvider = authProvider;
	}

	public readonly id: bigint;
	public email: string;
	public password: string;
	public authProvider: string;
}