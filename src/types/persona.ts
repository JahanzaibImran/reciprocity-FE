export interface Trait {
  id: string;
  category: string;
  name: string;
  description: string;
}

export interface Persona {
  traits: Trait[];
  summary: string;
  embedding: number[];
}

export interface PersonaSelection {
  selectedTraitIds: string[];
  selfPersona?: Persona;
  desiredMatch?: Persona;
}