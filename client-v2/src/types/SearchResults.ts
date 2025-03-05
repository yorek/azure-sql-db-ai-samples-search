import Article from "./Article";

export default interface SearchResults {
    limit: number;
    posts: Article[];
    skip: number;
    total: number;
};