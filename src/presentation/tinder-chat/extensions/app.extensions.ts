import { Id } from "../../../domain/valueObjects/id";

export class AppExtensions {

		public static registerInitialConfigurations() {
			const assignedWorkerId = parseInt(process.env.WORKER_ID || '0', 10);
			Id.configure({ workerId: assignedWorkerId });
		}
}