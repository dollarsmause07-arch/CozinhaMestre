export enum Difficulty {
  Easy = 'Fácil',
  Medium = 'Médio',
  Hard = 'Difícil'
}

export interface Ingredient {
  item: string;
  quantity: string;
  note?: string; // e.g., "room temperature"
}

export interface InstructionStep {
  stepNumber: number;
  instruction: string;
  image?: string;
  tip?: string;
  estimatedTime?: string;
}

export interface Recipe {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string; // Short summary
  author: string;
  prepTime: number; // minutes
  cookTime: number; // minutes
  totalTime: number; // minutes
  servings: number;
  difficulty: Difficulty;
  rating: number; // 0-5
  votes: number;
  calories?: number;
  tags: string[];
  imageUrl: string;
  ingredients: Ingredient[];
  equipment: string[];
  steps: InstructionStep[];
  chefTips: string[];
  category: string;
  videoUrl?: string; // Optional video
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}