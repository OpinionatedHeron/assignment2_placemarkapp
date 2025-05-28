export interface Session {
  name: string;
  _id: string;
  token: string;
}

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  _id?: string;
}

export interface Folder {
    _id: string;
    name: string;
    title?: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Location {
    _id?: string;
    title: string;
    category: string;
    description: string;
    folderid: string
    latitude?: number;
    longitude?: number;

    folder?: {
        _id: string;
        title: string;
        name: string;
    };
    user?: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
    };
} 

export interface Dataset{
    labels: string[];
    dataset: [{ values: number[] }];
}