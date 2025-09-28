import Sample from "../../types/Sample";

export default interface SearchState {
    samples: {
        status: 'idle' | 'loading' | 'succeeded' | 'failed';
        results: Sample[];
        error: string | undefined
    },
    delete: {
        status: 'idle' | 'loading' | 'succeeded' | 'failed';
        error: string | undefined
    },
    totalSamples: {
        status: 'idle' | 'loading' | 'succeeded' | 'failed';
        error: string | undefined;
        total: number;
    },
    sampleDetails: {
        status: 'idle' | 'loading' | 'succeeded' | 'failed';
        error: string | undefined;
        sample: Sample | undefined;
    },
    createSample: {
        status: 'idle' | 'loading' | 'succeeded' | 'failed';
        error: string | undefined;
        id: number;
    },
    updateSample: {
        status: 'idle' | 'loading' | 'succeeded' | 'failed';
        error: string | undefined;
        id: number;
    }
}
