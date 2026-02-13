import familyDataJson from '@/data/cipriano.family.json';
import { FamilyData, Person } from './types';

export function getFamilyData(): FamilyData {
  return familyDataJson as FamilyData;
}

export function getPersonById(id: string): Person | undefined {
  const data = getFamilyData();
  return data.people.find(p => p.id === id);
}

export function getAllPersonIds(): string[] {
  return getFamilyData().people.map(p => p.id);
}

export function getChildren(personId: string): Person[] {
  const data = getFamilyData();
  return data.people.filter(p => p.fatherId === personId || p.motherId === personId);
}

export function getDescendants(personId: string): Person[] {
  const data = getFamilyData();
  const result: Person[] = [];
  const visited = new Set<string>();

  function walk(id: string) {
    const children = data.people.filter(p => p.fatherId === id || p.motherId === id);
    children.forEach(c => {
      if (!visited.has(c.id)) {
        visited.add(c.id);
        result.push(c);
        walk(c.id);
      }
    });
  }

  walk(personId);
  return result;
}

/** Returns root ancestors (people with no parents in dataset) */
export function getRoots(): Person[] {
  const data = getFamilyData();
  return data.people.filter(p => !p.fatherId && !p.motherId);
}
