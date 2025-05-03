export class Preferences {
		constructor(
			public readonly minAge: number,
			public readonly maxAge: number,
			public readonly interestedInGender: string,
			public readonly maxDistance: number,
		) {}
	}