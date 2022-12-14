export interface Persons {
    homeworld: string;
    name: string
    [key: string]: unknown
}

export interface SearchPeopleByQueryResult {
    count: number;
    next: string;
    previous: string;
    results: Persons[]
}