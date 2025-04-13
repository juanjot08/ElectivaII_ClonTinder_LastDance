export class UpdateUserDTO {
    age?: number;
    gender?: string;
    preferences?: string[];
    location?: string;
    profilePhoto?: string;

    constructor(data: Partial<UpdateUserDTO>) {
        const allowedFields: (keyof UpdateUserDTO)[] = [
            'age',
            'gender',
            'preferences',
            'location',
            'profilePhoto',
        ];

        for (const key of allowedFields) {
            switch (key) {
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
