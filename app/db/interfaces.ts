
export interface Tweet {
    id: number;
    title: string;
    description: string;
    date: Date;
    tags: Tag[];
}

export interface Tag {
    id: number;
    name: string;
}