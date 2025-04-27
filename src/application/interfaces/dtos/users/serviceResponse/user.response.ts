import { User } from "../../../../../domain/entities/user";
import { Location } from "../../../../../domain/valueObjects/location";
import { Preferences } from "../../../../../domain/valueObjects/preferences";

export class IUserResponseDTO {
		name?: String;
	
		age?: Number;
	
		gender?: String;
	
		preferences?: Preferences;
	
		location?: Location;
	
		profilePhoto?: String;

		constructor(user: User) {
			this.name = user.name;
			this.age = user.age;
			this.gender = user.gender;
			this.preferences = user.preferences;
			this.location = user.location;
			this.profilePhoto = user.profilePhoto;
		}
}