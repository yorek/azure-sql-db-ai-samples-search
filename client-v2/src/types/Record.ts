export class Record {
    name: string;
    url: string;
    description: string;
    notes: string;
    details: object;

    constructor(
        name: string,
        url: string,
        description: string,
        notes: string,
        details: string
        ) {
        this.name = name;
        this.url = url;
        this.description = description;
        this.notes = notes;
        this.details = JSON.parse(details)
    }

    toJson(): string {
        return JSON.stringify({
            name: this.name,
            url: this.url,
            description: this.description,
            notes: this.notes,
            details: this.details
        });
    }
};