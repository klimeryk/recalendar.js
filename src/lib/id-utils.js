import { nanoid } from 'nanoid';

export function wrapWithId( value ) {
	if ( Object.hasOwn( value, 'id' ) ) {
		return value;
	}
	return {
		id: nanoid(),
		...( typeof value === 'object' ? value : { value } ),
	};
}

export function byId( idToSearchFor ) {
	return ( { id } ) => id === idToSearchFor;
}
