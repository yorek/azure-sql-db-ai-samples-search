export default interface HomeState {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | undefined;
    totalSamples: number;
};