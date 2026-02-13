export interface Person {
  id: string;
  fullName: string;
  nickname?: string;
  sex: 'M' | 'F' | 'Outro' | 'Não informado';
  birth?: { date?: string; place?: string };
  death?: { date?: string; place?: string };
  fatherId?: string;
  motherId?: string;
  spouses?: Spouse[];
  childrenIds?: string[];
  bio?: string;
  tags?: string[];
  photos?: string[];
  sources?: string[];
}

export interface Spouse {
  personId?: string;
  name?: string;
  type?: string;
  year?: string;
}

export interface Relationship {
  type: 'parent-child' | 'marriage';
  from: string;
  to: string;
  year?: string;
  unionType?: string;
}

export interface HistoricalEvent {
  id: string;
  title: string;
  date?: string;
  description?: string;
  personIds?: string[];
  photos?: string[];
  sources?: string[];
}

export interface FamilyData {
  people: Person[];
  relationships: Relationship[];
  historicalEvents: HistoricalEvent[];
  metadata: {
    familyName: string;
    generatedAt: string;
    version: string;
  };
}
