export default interface Article {
    body: string;
    id: number;
    reactions: number;
    title: string;
    userId: number;
    tags: string[];
}