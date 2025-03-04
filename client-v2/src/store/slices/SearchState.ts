export default interface SearchState {
    query: string;
    results: any[];
    loading: boolean;
    error: string | null;
}
