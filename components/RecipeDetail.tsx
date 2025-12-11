import React, { useState, useEffect } from 'react';
import { Recipe } from '../types';
import { Clock, Users, ChefHat, Printer, Share2, Heart, MessageCircle, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { askChefAI } from '../services/geminiService';

interface RecipeDetailProps {
  recipe: Recipe;
  onSaveAction?: (isSaved: boolean) => void;
}

const RecipeDetail: React.FC<RecipeDetailProps> = ({ recipe, onSaveAction }) => {
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [checkedIngredients, setCheckedIngredients] = useState<Record<number, boolean>>({});
  const [isSaved, setIsSaved] = useState(false);

  // Check if recipe is saved on mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('cm_saved_recipes');
      if (savedData) {
        const savedIds = JSON.parse(savedData);
        setIsSaved(savedIds.includes(recipe.id));
      }
    } catch (e) {
      console.error("Erro ao ler receitas salvas", e);
    }
  }, [recipe.id]);

  const toggleIngredient = (idx: number) => {
    setCheckedIngredients(prev => ({...prev, [idx]: !prev[idx]}));
  };

  const handleToggleSave = () => {
    try {
      const savedData = localStorage.getItem('cm_saved_recipes');
      let savedIds: string[] = savedData ? JSON.parse(savedData) : [];
      let newSavedState = false;

      if (savedIds.includes(recipe.id)) {
        savedIds = savedIds.filter(id => id !== recipe.id);
        newSavedState = false;
      } else {
        savedIds.push(recipe.id);
        newSavedState = true;
      }

      localStorage.setItem('cm_saved_recipes', JSON.stringify(savedIds));
      setIsSaved(newSavedState);

      if (onSaveAction) {
        onSaveAction(newSavedState);
      }
    } catch (e) {
      console.error("Erro ao salvar receita", e);
    }
  };

  // JSON-LD Schema Generation
  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Recipe",
    "name": recipe.title,
    "image": [recipe.imageUrl],
    "author": { "@type": "Person", "name": recipe.author },
    "description": recipe.description,
    "recipeCategory": recipe.category,
    "nutrition": { "@type": "NutritionInformation", "calories": `${recipe.calories} calories` },
    "recipeIngredient": recipe.ingredients.map(i => `${i.quantity} ${i.item}`)
  };

  const handlePrint = () => window.print();

  const handleAskChef = async () => {
    if (!aiQuestion.trim()) return;
    setLoadingAi(true);
    setAiAnswer(null);
    const answer = await askChefAI(aiQuestion, `Receita: ${recipe.title}. Ingredientes: ${recipe.ingredients.map(i => i.item).join(', ')}.`);
    setAiAnswer(answer);
    setLoadingAi(false);
  };

  return (
    <article className="min-h-screen bg-white">
      {/* SEO */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero Header */}
      <div className="relative h-[60vh] w-full">
        <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 text-white">
          <div className="max-w-7xl mx-auto">
            <span className="inline-block px-3 py-1 bg-brand-600 text-white text-xs font-bold uppercase tracking-widest rounded mb-4">
              {recipe.category}
            </span>
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4 leading-tight text-shadow-lg max-w-4xl">
              {recipe.title}
            </h1>
            <p className="text-lg md:text-xl text-stone-200 font-light max-w-2xl mb-8 leading-relaxed">
              {recipe.subtitle}
            </p>
            
            <div className="flex flex-wrap gap-8 text-sm font-medium tracking-wide uppercase">
              <div className="flex items-center gap-2">
                <Clock className="text-brand-500" size={20} />
                <span>Pronto em {recipe.totalTime} min</span>
              </div>
              <div className="flex items-center gap-2">
                <ChefHat className="text-brand-500" size={20} />
                <span>Dificuldade: {recipe.difficulty}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="text-brand-500" size={20} />
                <span>{recipe.servings} Porções</span>
              </div>
              <div className="flex items-center gap-1 text-brand-400">
                 {'★'.repeat(Math.round(recipe.rating))}
                 <span className="text-stone-400 ml-1">({recipe.votes} votos)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Sidebar (Ingredients & Controls) */}
          <div className="lg:col-span-4 space-y-8">
            {/* Sticky Container for Desktop */}
            <div className="lg:sticky lg:top-24 space-y-8">
              
              {/* Actions */}
              <div className="flex gap-3 pb-6 border-b border-stone-100 no-print">
                <button onClick={handlePrint} className="flex-1 py-3 border border-stone-200 rounded-lg hover:bg-stone-50 flex items-center justify-center gap-2 text-stone-600 font-medium transition">
                  <Printer size={18} /> Imprimir
                </button>
                <button 
                  onClick={handleToggleSave}
                  className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 font-medium transition shadow-lg ${
                    isSaved 
                    ? 'bg-rose-50 text-rose-600 border border-rose-200' 
                    : 'bg-stone-900 text-white hover:bg-stone-800'
                  }`}
                >
                  <Heart size={18} className={isSaved ? "fill-current" : ""} /> {isSaved ? 'Salvo' : 'Salvar'}
                </button>
              </div>

              {/* Ingredients List */}
              <div className="bg-stone-50 p-8 rounded-2xl border border-stone-100/50 shadow-soft">
                <h3 className="text-2xl font-serif font-bold mb-6 text-stone-900">Ingredientes</h3>
                <ul className="space-y-4">
                  {recipe.ingredients.map((ing, idx) => (
                    <li 
                      key={idx} 
                      className={`flex items-start gap-3 group cursor-pointer transition-all ${checkedIngredients[idx] ? 'opacity-40' : 'opacity-100'}`}
                      onClick={() => toggleIngredient(idx)}
                    >
                      <div className={`mt-1 w-5 h-5 rounded border flex items-center justify-center transition-colors ${checkedIngredients[idx] ? 'bg-brand-500 border-brand-500 text-white' : 'border-stone-300 bg-white group-hover:border-brand-400'}`}>
                        {checkedIngredients[idx] && <CheckCircle size={14} />}
                      </div>
                      <div className="flex-1">
                        <span className={`font-bold text-stone-800 ${checkedIngredients[idx] ? 'line-through' : ''}`}>{ing.quantity}</span>{' '}
                        <span className={`${checkedIngredients[idx] ? 'line-through' : ''} text-stone-600`}>{ing.item}</span>
                        {ing.note && <div className="text-xs text-stone-400 italic mt-0.5">{ing.note}</div>}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Nutrition & Equipment */}
              <div className="grid grid-cols-2 gap-4 text-sm text-stone-600">
                <div className="bg-white p-4 rounded-xl border border-stone-100">
                  <span className="block text-xs font-bold uppercase text-stone-400 mb-1">Calorias</span>
                  <span className="text-xl font-bold text-stone-900">{recipe.calories}</span> <span className="text-xs">kcal</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-stone-100">
                   <span className="block text-xs font-bold uppercase text-stone-400 mb-1">Equipamento</span>
                   <span className="font-medium">{recipe.equipment.length} itens</span>
                </div>
              </div>

              {/* Chef AI Widget */}
              <div className="bg-gradient-to-br from-brand-50 to-white p-6 rounded-2xl border border-brand-100 no-print shadow-soft">
                <h3 className="text-lg font-bold text-brand-900 mb-3 flex items-center gap-2">
                  <ChefHat size={20} className="text-brand-600" /> Chef IA
                </h3>
                <p className="text-sm text-brand-800/70 mb-4 leading-snug">Tem dúvidas sobre substituições ou técnicas? Pergunte-me agora.</p>
                
                <div className="relative">
                  <input 
                    type="text" 
                    value={aiQuestion}
                    onChange={(e) => setAiQuestion(e.target.value)}
                    placeholder="Ex: Posso usar farinha integral?"
                    className="w-full pl-3 pr-10 py-3 bg-white border border-brand-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm"
                  />
                  <button 
                    onClick={handleAskChef}
                    disabled={loadingAi}
                    className="absolute right-2 top-2 p-1 bg-brand-100 text-brand-600 rounded hover:bg-brand-200 transition disabled:opacity-50"
                  >
                    <ArrowLeft size={16} className={`rotate-180 ${loadingAi ? 'animate-spin' : ''}`} />
                  </button>
                </div>
                {aiAnswer && (
                  <div className="mt-4 p-4 bg-white rounded-lg text-sm text-stone-700 border border-brand-100 shadow-sm animate-in fade-in slide-in-from-bottom-2">
                    <strong className="text-brand-700 block mb-1">Chef diz:</strong> {aiAnswer}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content (Method) */}
          <div className="lg:col-span-8">
             <div className="prose prose-stone max-w-none">
               <h2 className="font-serif text-3xl font-bold text-stone-900 mb-8 border-b border-stone-100 pb-4">Modo de Preparo</h2>
               
               <div className="relative border-l-2 border-stone-200 ml-4 md:ml-6 space-y-12 pb-12">
                 {recipe.steps.map((step, idx) => (
                   <div key={step.stepNumber} className="relative pl-8 md:pl-12 group">
                     {/* Timeline Bullet */}
                     <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-4 border-stone-300 group-hover:border-brand-500 transition-colors"></div>
                     
                     <h3 className="text-xl font-bold text-stone-900 mb-3 flex items-center gap-3">
                       <span className="text-brand-600 font-serif text-2xl">0{step.stepNumber}</span>
                       <span className="text-sm font-normal text-stone-400 uppercase tracking-wider bg-stone-50 px-2 py-1 rounded">
                          {step.estimatedTime}
                       </span>
                     </h3>

                     <p className="text-lg text-stone-700 leading-relaxed mb-6 font-light">
                       {step.instruction}
                     </p>

                     {/* Step Extras */}
                     <div className="grid md:grid-cols-2 gap-6">
                       {step.image && (
                         <div className="rounded-xl overflow-hidden shadow-sm border border-stone-100 no-print group-hover:shadow-md transition-shadow">
                            <img src={step.image} alt={`Passo ${step.stepNumber}`} className="w-full h-48 object-cover hover:scale-105 transition-transform duration-700" loading="lazy" />
                         </div>
                       )}
                       
                       {step.tip && (
                         <div className="bg-yellow-50/50 border border-yellow-100 p-4 rounded-xl h-fit">
                           <div className="flex items-start gap-3">
                             <AlertCircle className="text-yellow-600 shrink-0 mt-0.5" size={18} />
                             <div>
                               <span className="block text-xs font-bold text-yellow-700 uppercase tracking-wide mb-1">Dica do Chef</span>
                               <p className="text-sm text-stone-700 italic">{step.tip}</p>
                             </div>
                           </div>
                         </div>
                       )}
                     </div>
                   </div>
                 ))}
               </div>

               {/* Chef's Notes Section */}
               <div className="bg-stone-900 text-stone-300 p-8 md:p-12 rounded-2xl shadow-xl mt-12 relative overflow-hidden no-print">
                 <div className="absolute top-0 right-0 p-32 bg-stone-800 rounded-full blur-3xl opacity-20 -mr-20 -mt-20"></div>
                 <h3 className="font-serif text-2xl font-bold text-white mb-6 relative z-10">Notas Finais & Segredos</h3>
                 <ul className="space-y-4 relative z-10">
                    {recipe.chefTips.map((tip, i) => (
                      <li key={i} className="flex gap-4 items-start">
                        <div className="w-6 h-6 rounded-full bg-brand-900/50 border border-brand-500/30 flex items-center justify-center shrink-0 mt-0.5 text-brand-500 text-xs">✓</div>
                        <span className="leading-relaxed">{tip}</span>
                      </li>
                    ))}
                 </ul>
               </div>

             </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default RecipeDetail;