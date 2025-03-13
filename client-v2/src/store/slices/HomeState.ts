export default interface HomeState {
    totalSamples: {
        status: 'idle' | 'loading' | 'succeeded' | 'failed';
        error: string | undefined;
        total: number;
    };  
};