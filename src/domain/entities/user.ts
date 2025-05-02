import { Id } from "../valueObjects/id";
import { Location } from "../valueObjects/location";
import { Preferences } from "../valueObjects/preferences";

export class User {

	constructor(
		identityId: bigint, 
		id?: bigint, 
		name?: string, 
		age?: number, 
		gender?: string, 
		preferences?: Preferences, 
		location?: Location, 
		profilePhoto?: string, 
		bio?: string, 
		aditionalPhotos?: string[]
	) {
		this.id = id ?? Id.new();
		this.identityId = identityId;
		this.name = name;
		this.age = age;
		this.gender = gender;
		this.preferences = preferences;
		this.location = location;
		this.profilePhoto = profilePhoto;
		this.bio = bio;
		this.additionalPhotos = aditionalPhotos;
	}

	public readonly id: bigint;

	public readonly identityId: bigint;

	public name?: String;

	public age?: Number;

	public gender?: String;

	public preferences?: Preferences;

	public bio?: String;

	public location?: Location;

	public profilePhoto?: String;

	public additionalPhotos?: String[];

	public static new(identityId: bigint): User {
		return new User(identityId);
	}

	public static existent(
		identityId: bigint,
		id: bigint,
		name?: string,
		age?: number,
		gender?: string,
		preferences?: Preferences,
		location?: Location,
		profilePhoto?: string,
		bio?: string,
		aditionalPhotos?: string[]
	): User {
		return new User(identityId, id, name, age, gender, preferences, location, profilePhoto, bio, aditionalPhotos);
	}
}