export interface Division {
    id: number;
    name: string;
    level: number;
    number_collaborators: number;
    ambassador: string;
    upper_division?: {
      id: number;
      name: string;
      level: number;
      number_collaborators: number;
      ambassador: string;
    };
    subdivisions: Division[];
    subdivisionCount: number;
}

  