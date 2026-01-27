export function isValidSearch(query) {
    return query && query.trim().length >= 2;
}

export function isValidMovie(movie) {
    return movie && movie.title && movie.poster_path;
}