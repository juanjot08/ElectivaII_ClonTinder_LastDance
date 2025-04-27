import { Location } from "../../../../../domain/valueObjects/location";
import { Preferences } from "../../../../../domain/valueObjects/preferences";

export class UpdateUserDTO {
	name?: string | null;
	age?: number | null;
	gender?: string | null;
	preferences?: Preferences | null;
	location?: Location | null;
	profilePhoto?: string | null;

	constructor(data: Partial<UpdateUserDTO>) {
		const allowedFields: (keyof UpdateUserDTO)[] = [
			'name',
			'age',
			'gender',
			'preferences',
			'location',
			'profilePhoto',
		];

		for (const key of allowedFields) {
			switch (key) {
				case "name":
					if (data.name !== undefined) this.name = data.name;
					break;
				case "age":
					if (data.age !== undefined) this.age = data.age;
					break;
				case "gender":
					if (data.gender != undefined) this.gender = data.gender
					break;
				case "preferences":
					if (data.preferences != undefined) this.preferences = data.preferences
					break;
				case "location":
					if (data.location != undefined) this.location = data.location
					break;
				case "profilePhoto":
					if (data.profilePhoto != undefined) this.profilePhoto = data.profilePhoto
					break;
			}
		}
	}
}
