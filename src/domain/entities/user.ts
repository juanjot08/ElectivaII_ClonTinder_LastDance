import { Location } from "../valueObjects/location";

export class User {
    constructor(
        public readonly id: Number,
        public readonly name: String,
        public readonly age: Number,
        public readonly gender: String,
        public readonly preferences: any,
        public readonly location: Location,
        public readonly profilePhoto: String
    )
    {}
}