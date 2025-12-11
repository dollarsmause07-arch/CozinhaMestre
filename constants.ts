import { Recipe, Difficulty, Category, Ingredient, InstructionStep } from './types';

export const CATEGORIES: Category[] = [
  { id: 'diarios', name: 'Dia a Dia', icon: '🥘', count: 0 },
  { id: 'sopas', name: 'Sopas & Entradas', icon: '🥣', count: 0 },
  { id: 'doces', name: 'Doces Caseiros', icon: '🍮', count: 0 },
  { id: 'vegan', name: 'Vegetariano', icon: '🥬', count: 0 },
  { id: 'rapidas', name: 'Rápidas', icon: '⚡', count: 0 },
];

// --- NATURAL VOCABULARY ---

const CHEFS = ['Avó Maria', 'Tia Joana', 'Chef Carlos', 'Dona Rosa', 'Sr. António', 'Chef Miguel', 'Clara de Sousa', 'Chef Rui', 'A Vossa Vizinha'];

// Títulos mais orgânicos e menos "robóticos"
const RECIPE_TITLES = {
  diarios: [
    'Arroz de Pato à Antiga', 'Bacalhau com Natas da Avó', 'Carne de Porco à Alentejana', 
    'Feijoada à Transmontana', 'Frango Assado com Limão e Tomilho', 'Bitoque com Molho de Cerveja',
    'Lulas Estufadas com Batata', 'Jardineira de Vitela Tenra', 'Massa à Lavrador',
    'Dourada Grelhada com Molho Verde', 'Arroz de Tamboril Malandrinho', 'Costeletas de Porco Panadas',
    'Rancho à Moda de Viseu', 'Empadão de Carne Caseiro', 'Bifes de Peru com Cogumelos',
    'Pataniscas de Bacalhau com Arroz de Feijão', 'Açorda Alentejana com Ovo Escalfado',
    'Massada de Peixe Rico', 'Coelho à Caçador', 'Arroz de Cabidela', 'Lombo de Porco Assado com Castanhas'
  ],
  sopas: [
    'Caldo Verde com Chouriço Caseiro', 'Sopa da Pedra Original', 'Creme Aveludado de Legumes',
    'Sopa de Cação à Alentejana', 'Canja de Galinha do Campo', 'Sopa de Feijão com Couve Lombarda',
    'Gaspacho à Alentejana', 'Creme de Abóbora Assada com Especiarias', 'Sopa de Peixe da Costa',
    'Aveludado de Agrião', 'Sopa de Grão com Espinafres'
  ],
  doces: [
    'Arroz Doce Cremoso', 'Leite Creme Queimado', 'Bolo de Bolacha Tradicional', 
    'Pudim Abade de Priscos', 'Mousse de Chocolate (A Melhor do Mundo)', 'Farófias com Creme Inglês',
    'Tarte de Amêndoa Caramelizada', 'Bolo de Laranja Húmido', 'Sericaia com Ameixa de Elvas',
    'Pastel de Nata Caseiro', 'Baba de Camelo', 'Salame de Chocolate Crocante'
  ],
  vegan: [
    'Caril de Grão e Espinafres', 'Feijoada de Cogumelos Selvagens', 'Hambúrguer de Feijão Preto e Aveia',
    'Bolognesa de Lentilhas Ricas', 'Tofu à Lagareiro', 'Strogonoff de Seitan Cremoso',
    'Arroz de Legumes da Horta', 'Moqueca de Palmito', 'Salada de Quinoa e Abacate',
    'Risoto de Cogumelos e Espargos'
  ],
  rapidas: [
    'Omelete Mista com Ervas', 'Massa Carbonara (A Original)', 'Bifes de Frango Grelhados',
    'Salada Caesar com Frango Crocante', 'Tostas de Abacate e Ovo', 'Wrap de Atum e Milho',
    'Salmão Grelhado com Legumes Salteados', 'Ovos Mexidos com Farinheira', 'Pimentos Padrón Salteados'
  ]
};

// Gerador de descrições que parecem escritas por humanos (food bloggers/avós)
const INTROS = [
  "Esta receita está na minha família há gerações.",
  "O segredo deste prato está no tempo que se dedica ao refogado.",
  "Perfeito para aqueles dias em que precisamos de comida de conforto.",
  "Uma versão simplificada de um clássico, sem perder o sabor autêntico.",
  "O cheirinho que deixa na cozinha vai chamar toda a gente para a mesa.",
  "Aprendi este truque com um chef no Alentejo.",
  "Ideal para o almoço de domingo com a família reunida."
];

const FLAVORS = [
  "O molho fica espesso e rico, ideal para molhar o pão.",
  "A carne desfaz-se na boca de tão tenra.",
  "O contraste entre o crocante e o cremoso é divinal.",
  "Tem aquele sabor caseiro que nos transporta para a infância.",
  "Fica ainda melhor no dia seguinte, quando os sabores apuram.",
  "Leve, fresco e cheio de sabor."
];

// --- HELPERS ---

function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateDescription(title: string): string {
  return `${getRandomElement(INTROS)} ${title} é uma aposta ganha. ${getRandomElement(FLAVORS)}`;
}

// Generate image prompts focused on texture and realism
function getRecipeImage(title: string, id: string): string {
  // Removing "AI" keywords, adding photography keywords
  const prompt = encodeURIComponent(`${title}, food photography, natural light, rustic wooden table, authentic styling, steam rising, imperfect plating, 4k, canon 50mm lens`);
  return `https://image.pollinations.ai/prompt/${prompt}?width=800&height=600&nologo=true&seed=${id}&model=flux`;
}

function generateIngredients(title: string): Ingredient[] {
  const list: Ingredient[] = [
    { item: 'Azeite Virgem Extra', quantity: 'um fio generoso' },
    { item: 'Cebola', quantity: '1 grande', note: 'picada finamente' },
    { item: 'Alho', quantity: '3 dentes', note: 'esmagados' },
    { item: 'Sal Marinho', quantity: 'a gosto' },
    { item: 'Pimenta Preta', quantity: 'moída na hora' },
    { item: 'Folha de Louro', quantity: '1 unidade' }
  ];

  const lower = title.toLowerCase();

  // Proteínas e Bases
  if (lower.includes('bacalhau')) list.push({ item: 'Bacalhau Graúdo', quantity: '3 postas', note: 'bem demolhado' });
  if (lower.includes('pato')) list.push({ item: 'Pato', quantity: 'metade', note: 'limpo de gorduras' });
  if (lower.includes('frango') || lower.includes('galinha')) list.push({ item: 'Frango do Campo', quantity: '1 kg', note: 'cortado em pedaços' });
  if (lower.includes('porco') || lower.includes('bifana')) list.push({ item: 'Carne de Porco', quantity: '800g', note: 'cortada em cubos' });
  if (lower.includes('vitela')) list.push({ item: 'Carne de Vitela para Estufar', quantity: '800g' });
  if (lower.includes('lulas')) list.push({ item: 'Lulas Frescas', quantity: '1 kg', note: 'limpas' });
  
  // Acompanhamentos e Temperos Específicos
  if (lower.includes('arroz')) list.push({ item: 'Arroz Carolino', quantity: '1 caneca' });
  if (lower.includes('natas')) list.push({ item: 'Natas Frescas', quantity: '2 pacotes' });
  if (lower.includes('tomate') || lower.includes('bolonhesa')) list.push({ item: 'Tomate Maduro', quantity: '4 unidades', note: 'sem pele' });
  if (lower.includes('feijão')) list.push({ item: 'Feijão', quantity: '1 lata grande', note: 'com o caldo' });
  if (lower.includes('vinho')) list.push({ item: 'Vinho Branco', quantity: '1 copo' });
  if (lower.includes('doce') || lower.includes('bolo') || lower.includes('pudim')) {
    return [
      { item: 'Açúcar', quantity: '250g' },
      { item: 'Ovos Caseiros', quantity: '6 unidades' },
      { item: 'Farinha com Fermento', quantity: '200g' },
      { item: 'Manteiga', quantity: '100g', note: 'à temperatura ambiente' },
      { item: 'Canela em Pó', quantity: 'a gosto' },
      { item: 'Raspa de Limão', quantity: '1 unidade' }
    ];
  }

  // Toques Finais
  list.push({ item: 'Salsa ou Coentros', quantity: '1 ramo', note: 'frescos' });

  return list;
}

function generateSteps(title: string): InstructionStep[] {
  const steps: InstructionStep[] = [];
  const lower = title.toLowerCase();

  // Logical Step Generation based on Cooking Method

  // STEP 1: PREP
  if (lower.includes('doce') || lower.includes('bolo')) {
    steps.push({ stepNumber: 1, instruction: 'Comece por pré-aquecer o forno a 180ºC e untar a forma com manteiga e farinha.', estimatedTime: '10 min' });
  } else {
    steps.push({ stepNumber: 1, instruction: 'Faça o "Mise en place": pique a cebola e os alhos, corte os legumes e tempere a proteína com sal, pimenta e alho.', estimatedTime: '15 min' });
  }

  // STEP 2: COOKING BASE
  if (lower.includes('estufado') || lower.includes('arroz') || lower.includes('feijoada') || lower.includes('jardineira')) {
    steps.push({ stepNumber: 2, instruction: 'Num tacho largo, faça um refogado generoso com o azeite, cebola e folha de louro. Deixe a cebola "suar" até ficar translúcida, sem queimar.', estimatedTime: '10 min', tip: 'O segredo de um bom estufado é a paciência no refogado.' });
    steps.push({ stepNumber: 3, instruction: 'Junte a carne ou ingrediente principal e deixe selar de todos os lados para prender os sucos. Refresque com um pouco de vinho branco.', estimatedTime: '10 min' });
    steps.push({ stepNumber: 4, instruction: 'Adicione o líquido (água quente ou caldo), tape e deixe cozinhar em lume brando até a carne estar tenra e o molho apurado.', estimatedTime: '45 min' });
  } else if (lower.includes('assado') || lower.includes('forno')) {
    steps.push({ stepNumber: 2, instruction: 'Disponha tudo num tabuleiro de barro ou pirex. Regue com azeite, vinho branco e espalhe uns cubos de margarina por cima para dar cor.', estimatedTime: '5 min' });
    steps.push({ stepNumber: 3, instruction: 'Leve ao forno. A meio do tempo, regue a carne com o próprio molho do tabuleiro para não secar.', estimatedTime: '50 min' });
  } else if (lower.includes('grelhado')) {
    steps.push({ stepNumber: 2, instruction: 'Aqueça bem a grelha. Coloque o peixe ou carne apenas quando estiver muito quente para marcar e não agarrar.', estimatedTime: '15 min' });
  } else if (lower.includes('doce')) {
    steps.push({ stepNumber: 2, instruction: 'Bata o açúcar com os ovos até obter um creme esbranquiçado e volumoso.', estimatedTime: '8 min' });
    steps.push({ stepNumber: 3, instruction: 'Envolva os restantes ingredientes delicadamente, sem bater demasiado para manter o ar na massa.', estimatedTime: '5 min' });
  } else {
    // Generic Stove
    steps.push({ stepNumber: 2, instruction: 'Na frigideira, salteie os ingredientes em azeite quente até ganharem cor.', estimatedTime: '15 min' });
  }

  // STEP 3: FINISHING
  if (lower.includes('doce')) {
    steps.push({ stepNumber: 4, instruction: 'Leve a cozer, fazendo o teste do palito antes de retirar. Deixe arrefecer antes de desenformar.', estimatedTime: '40 min' });
  } else {
    steps.push({ stepNumber: 5, instruction: 'Retifique os temperos (sal e pimenta). Desligue o lume e polvilhe com as ervas frescas picadas na hora.', estimatedTime: '2 min', tip: 'As ervas devem entrar só no fim para não perderem o aroma.' });
  }

  return steps;
}

// --- MAIN GENERATOR ---

const TOTAL_RECIPES = 600; 

const generateRecipes = (count: number): Recipe[] => {
  const recipes: Recipe[] = [];

  for (let i = 0; i < count; i++) {
    let categoryKey = '';
    let categoryName = '';
    
    // Distribution
    const rand = Math.random();
    if (rand < 0.15) { categoryKey = 'sopas'; categoryName = 'Sopas & Entradas'; }
    else if (rand < 0.30) { categoryKey = 'doces'; categoryName = 'Doces Caseiros'; }
    else if (rand < 0.45) { categoryKey = 'vegan'; categoryName = 'Vegetariano'; }
    else if (rand < 0.55) { categoryKey = 'rapidas'; categoryName = 'Rápidas'; }
    else { categoryKey = 'diarios'; categoryName = 'Dia a Dia'; } // Most common

    const baseTitles = RECIPE_TITLES[categoryKey as keyof typeof RECIPE_TITLES];
    const baseTitle = getRandomElement(baseTitles);
    
    // Make titles unique by appending subtle variations if needed in logic, 
    // but here we rely on the large count and random selection. 
    // To ensure 600 unique items, we add a variation string.
    const variation = i > 100 ? ` (Variação ${i})` : ''; // Just to ensure unique ID/slug, displayed title can be clean or varied slightly.
    
    // Let's make the displayed title clean, but slug unique.
    // However, to fill 600 spots with ~50 base titles, we need to generate variations.
    const adjectives = ['Especial', 'da Casa', 'Rústico', 'Simples', 'com Toque do Chef', 'Tradicional'];
    const displayTitle = i < 60 ? baseTitle : `${baseTitle} ${getRandomElement(adjectives)}`;

    const id = i.toString();
    const isQuick = categoryKey === 'rapidas';
    
    // Time logic
    let prepTime = 20;
    let cookTime = 30;
    if (displayTitle.includes('Assado') || displayTitle.includes('Forno')) { cookTime = 55; }
    if (displayTitle.includes('Estufado') || displayTitle.includes('Feijoada')) { cookTime = 70; }
    if (displayTitle.includes('Doce') || displayTitle.includes('Bolo')) { cookTime = 45; }
    if (isQuick) { cookTime = 10; prepTime = 10; }

    const totalTime = prepTime + cookTime;

    recipes.push({
      id: id,
      slug: `${categoryName.toLowerCase().split(' ')[0]}-${id}-${displayTitle.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      title: displayTitle,
      subtitle: `${categoryName} • ${getRandomInt(2, 6)} Pessoas`,
      description: generateDescription(displayTitle),
      author: getRandomElement(CHEFS),
      prepTime,
      cookTime,
      totalTime,
      servings: getRandomInt(2, 6),
      difficulty: totalTime > 60 ? Difficulty.Medium : Difficulty.Easy,
      rating: parseFloat((Math.random() * (5 - 4.2) + 4.2).toFixed(1)), // High ratings for comfort food
      votes: getRandomInt(10, 300),
      calories: getRandomInt(250, 800),
      tags: [categoryName, 'Conforto', 'Tradicional', 'Caseiro'],
      category: categoryName,
      imageUrl: getRecipeImage(baseTitle, id), // Use base title for clearer image prompts
      ingredients: generateIngredients(baseTitle),
      equipment: ['Tacho de Barro', 'Colher de Pau', 'Faca de Chef'],
      steps: generateSteps(baseTitle),
      chefTips: [
        'A qualidade do azeite faz toda a diferença neste prato.',
        'Se sobrar, guarde no frigorífico; fica ainda melhor no dia seguinte.',
        'Acompanhe com um bom vinho tinto ou pão fresco.'
      ]
    });
  }

  return recipes;
};

export const MOCK_RECIPES = generateRecipes(TOTAL_RECIPES);

// Update counts dynamically
CATEGORIES.forEach(cat => {
  if (cat.name === 'Rápidas') {
    cat.count = MOCK_RECIPES.filter(r => r.totalTime <= 30).length;
  } else {
    cat.count = MOCK_RECIPES.filter(r => r.category === cat.name).length;
  }
});