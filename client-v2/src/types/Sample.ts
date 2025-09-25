export default interface Sample {
    id: number;
    name: string;
    description: string;
    sample_summary: string,
    thoughts: string,
    notes: string;
    details: {
        [key: string]: any;
      };    
    url: string;
    created_on: string;
    updated_on: string;
}

