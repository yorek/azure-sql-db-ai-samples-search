export default interface SearchState {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    results: any[];
    error: string | undefined;
}
