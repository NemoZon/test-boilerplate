export interface BaseState {
    status: 'loading' | 'succeeded' | 'failed' | 'idle',
    error: string | null;
    statusCode: number | null;
}
export interface BaseEntity {
    _id: string
}