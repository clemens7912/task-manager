export interface Filters {
    cards_tags_id?: Filter<number[]>,
    cards_users_id?: Filter<number[]>
    endDate?: Filter<string[]>
}

interface Filter<T = any> {
    operator: string, 
    value: T
}