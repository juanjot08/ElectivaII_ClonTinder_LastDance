// src/domain/shared/Id.ts

// --- Configuración de Bits ---
const WORKER_ID_BITS = 10;
const SEQUENCE_BITS = 12;
// Los bits de timestamp son implícitamente 64 - WORKER_ID_BITS - SEQUENCE_BITS = 42

// --- Cálculos de Desplazamiento y Máscaras ---
const MAX_WORKER_ID = (BigInt(1) << BigInt(WORKER_ID_BITS)) - BigInt(1); // 1023
const MAX_SEQUENCE = (BigInt(1) << BigInt(SEQUENCE_BITS)) - BigInt(1);  // 4095

const WORKER_ID_SHIFT = BigInt(SEQUENCE_BITS); // Desplazar 12 bits a la izquierda
const TIMESTAMP_SHIFT = BigInt(SEQUENCE_BITS + WORKER_ID_BITS); // Desplazar 22 bits a la izquierda

export class Id {
	private static lastTimestamp: bigint = BigInt(-1);
	private static sequence: bigint = BigInt(0);
	private static workerId: bigint = BigInt(0); // Worker ID asignado
	private static epoch: bigint = BigInt(1672531200000); // Época personalizada: 1 de Enero 2023 00:00:00 GMT
	private static isConfigured: boolean = false;

	private readonly value: bigint;

	private constructor(value: bigint) {
		this.value = value;
		Object.freeze(this);
	}

	public static configure({ workerId, epoch }: { workerId: number; epoch?: number }): void {
		if (workerId < 0 || BigInt(workerId) > MAX_WORKER_ID) {
			throw new Error(`Worker ID must be between 0 and ${MAX_WORKER_ID}. Received: ${workerId}`);
		}
		Id.workerId = BigInt(workerId);
		if (epoch !== undefined) {
			Id.epoch = BigInt(epoch);
		}
		Id.isConfigured = true;
		console.log(`Id generator configured with Worker ID: ${Id.workerId} and Epoch: ${new Date(Number(Id.epoch)).toISOString()}`);
	}

	public static new(): bigint {
		if (!Id.isConfigured) {
			throw new Error("Id generator is not configured. Call Id.configure({ workerId: ... }) first.");
		}

		let timestamp = BigInt(Date.now()) - Id.epoch;

		if (timestamp === Id.lastTimestamp) {

			Id.sequence = (Id.sequence + BigInt(1)) & MAX_SEQUENCE;

			if (Id.sequence === BigInt(0)) {

				while (timestamp <= Id.lastTimestamp) {
					timestamp = BigInt(Date.now()) - Id.epoch;
				}

			}
		} else {
			Id.sequence = BigInt(0);
		}

		if (timestamp < Id.lastTimestamp) {
			console.error(`Clock moved backwards! Refusing to generate ID for ${timestamp - Id.lastTimestamp}ms.`);

			throw new Error(`Clock moved backwards. Refusing to generate id for ${Id.lastTimestamp - timestamp} milliseconds`);
		}

		Id.lastTimestamp = timestamp;

		const finalIdValue =
			(timestamp << TIMESTAMP_SHIFT)    // Timestamp a la izquierda
			| (Id.workerId << WORKER_ID_SHIFT) // Worker ID en el medio
			| Id.sequence;                    // Secuencia a la derecha

		return finalIdValue;
	}

	public getValue(): bigint {
		return this.value;
	}

	public equals(other?: Id | null): boolean {
		if (other === null || other === undefined || !(other instanceof Id)) {
			return false;
		}
		return this.value === other.value;
	}

	public toString(): string {
		return this.value.toString(); // Decimal string
	}

	public static fromValue(value: bigint): Id {
		if (typeof value !== 'bigint') {
			throw new Error('Invalid value provided for Id. Expected a BigInt.');
		}
		return new Id(value);
	}

	public decompose(): { timestamp: bigint; workerId: bigint; sequence: bigint; date: Date } {
		const timestamp = (this.value >> TIMESTAMP_SHIFT);
		const workerId = (this.value >> WORKER_ID_SHIFT) & MAX_WORKER_ID;
		const sequence = this.value & MAX_SEQUENCE;
		const date = new Date(Number(timestamp + Id.epoch));
		return { timestamp, workerId, sequence, date };
	}

}