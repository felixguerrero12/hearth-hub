export interface Hunt {
    id: string;
    tactic: string;
    hypothesis: string;
    notes?: string;  // Made optional with '?'
    tags: string[];
    submitter: {
        name: string;
        link?: string;
    };
    content: string;
    why?: string[];      // Adding these fields to match huntCollector
    references?: string[]; // Adding these fields to match huntCollector
}