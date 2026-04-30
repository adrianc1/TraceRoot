export interface Strain {
	id: number;
	name: string;
	description: string;
	type:
		| 'indica'
		| 'sativa'
		| 'hybrid'
		| 'indica-Dominant'
		| 'sativa-Dominant'
		| 'cbd';
}
