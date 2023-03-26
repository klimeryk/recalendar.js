let lastId = 0;

export function newId( prefix = 'id' ) {
	lastId++;
	return `${prefix}${lastId}`;
}

export function wrapWithId( value ) {
	return {
		id: newId(),
		...( typeof value === 'object' ? value : { value } ),
	};
}

export function byId( idToSearchFor ) {
	return ( { id } ) => id === idToSearchFor;
}
