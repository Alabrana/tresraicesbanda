export function showsMapToArray(shows) {
  if (!shows || typeof shows !== 'object' || Array.isArray(shows)) {
    throw new TypeError('La colección interna de presentaciones debe ser un objeto por ID.');
  }

  return Object.values(shows);
}

export function showsArrayToMap(shows) {
  if (!Array.isArray(shows)) {
    throw new TypeError('En Vivo debe editarse como un arreglo de presentaciones.');
  }

  const entries = shows.map((show, index) => {
    if (!show || typeof show !== 'object' || Array.isArray(show)) {
      throw new TypeError(`La presentación en la posición ${index + 1} debe ser un objeto.`);
    }
    if (typeof show.id !== 'string' || show.id.length === 0) {
      throw new TypeError(`La presentación en la posición ${index + 1} necesita un id.`);
    }

    return [show.id, show];
  });
  const ids = entries.map(([id]) => id);

  if (new Set(ids).size !== ids.length) {
    throw new TypeError('Cada presentación debe tener un id único.');
  }

  return Object.fromEntries(entries);
}
