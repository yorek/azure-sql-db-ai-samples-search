import LightSample from "../../types/LightSample";

export default interface HomeState {
    totalSamples: {
        status: 'idle' | 'loading' | 'succeeded' | 'failed';
        error: string | undefined;
        total: number;
    };  
    latestSamples: {
        status: 'idle' | 'loading' | 'succeeded' | 'failed';
        errror: string | undefined;
        records: LightSample[];
    }
};