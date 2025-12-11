import React, { useState, useEffect } from 'react';
import { Recipe } from '../types';
import { CATEGORIES } from '../constants';
import { Clock, Filter, Search, ChevronDown, ChevronUp } from 'lucide-react';

interface RecipeListProps {
  recipes: Recipe[];
  onSelectRecipe: (slug: string) => void;
  initialSearchTerm?: string;
  initialCategory?: string;
}

const RecipeList: React.FC<RecipeListProps> = ({ recipes, onSelectRecipe, initialSearchTerm = '', initialCategory = '' }) => {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  // State to track which categories are fully expanded
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  // Sync local search term if the prop changes
  useEffect(() => {
    if (initialSearchTerm) {
      setSearchTerm(initialSearchTerm);
    }
  }, [initialSearchTerm]);

  // Handle Initial Category navigation (scroll and expand)
  useEffect(() => {
    if (initialCategory) {
      setExpandedCategories(prev => {
        if (!prev.includes(initialCategory)) {
          return [...prev, initialCategory];
        }
        return prev;
      });

      setTimeout(() => {
        const element = document.getElementById(initialCategory);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [initialCategory]);

  // Smart Search Effect: Auto-expand categories if they match the search term
  useEffect(() => {
    if (searchTerm.trim().length > 0) {
      const term = searchTerm.toLowerCase();
      const newExpanded: string[] = [];

      CATEGORIES.forEach(cat => {
        // 1. Check if search term matches Category Name (Concept Search)
        // e.g. "doce" matches "Doces Caseiros", "sopa" matches "Sopas"
        const isCategoryMatch = 
           cat.name.toLowerCase().includes(term) ||
           (cat.id === 'doces' && (term.includes('sobremesa') || term.includes('bolo'))) ||
           (cat.id === 'sopas' && term.includes('entrada'));

        if (isCategoryMatch) {
           newExpanded.push(cat.id);
        } else {
           // 2. Check if this category contains recipes matching the term
           const hasRecipeMatch = recipes.some(r => 
             r.category === cat.name && r.title.toLowerCase().includes(term)
           );
           if (hasRecipeMatch) {
             newExpanded.push(cat.id);
           }
        }
      });

      // Avoid duplicates
      setExpandedCategories(prev => [...new Set([...prev, ...newExpanded])]);
    }
  }, [searchTerm, recipes]);

  // Helper to filter recipes by specific logic
  const getRecipesForCategory = (categoryName: string, categoryId: string) => {
    const term = searchTerm.toLowerCase().trim();
    
    // Base filter by category
    let categoryRecipes = recipes.filter(r => r.category === categoryName);
    
    // Special handling for "Rápidas" which is logic-based, not just a string tag
    if (categoryId === 'rapidas') {
      categoryRecipes = recipes.filter(r => r.totalTime <= 30);
    }

    // If no search, return all in category
    if (!term) return categoryRecipes;

    // SMART SEARCH LOGIC:
    
    // 1. Is the user searching for the Category itself? 
    // If user types "Doces", show ALL doces, don't filter by title.
    const isCategorySearch = 
        categoryName.toLowerCase().includes(term) ||
        (categoryId === 'doces' && (term.includes('sobremesa') || term.includes('bolo') || term.includes('doce'))) ||
        (categoryId === 'sopas' && (term.includes('sopa') || term.includes('creme'))) ||
        (categoryId === 'vegan' && (term.includes('vegan') || term.includes('vegetariano'))) ||
        (categoryId === 'rapidas' && (term.includes('rapida') || term.includes('fácil') || term.includes('facil')));

    if (isCategorySearch) {
      return categoryRecipes;
    }

    // 2. Otherwise, filter recipes by Title within this category
    return categoryRecipes.filter(r => r.title.toLowerCase().includes(term));
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId) // Collapse
        : [...prev, categoryId] // Expand
    );
  };

  // Calculate total visible results to show empty state if needed
  const hasAnyResults = CATEGORIES.some(cat => getRecipesForCategory(cat.name, cat.id).length > 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 bg-[#FAFAF9]">
      
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6 border-b border-stone-200 pb-8">
        <div>
          <h2 className="text-4xl font-serif font-bold text-stone-900 mb-3">O Nosso Menu</h2>
          <p className="text-stone-500 font-light text-lg">
            Navegue pela nossa seleção organizada de {recipes.length} pratos.
          </p>
        </div>
        
        <div className="w-full md:w-96 relative group">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-hover:text-brand-500 transition-colors" size={20} />
           <input 
            type="text" 
            placeholder="Pesquise por nome ou categoria (ex: Doces)..." 
            className="w-full bg-white border border-stone-200 rounded-xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none text-base shadow-sm transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Render Sections based on CATEGORIES constant */}
      <div className="space-y-20">
        {CATEGORIES.map((category) => {
          const categoryRecipes = getRecipesForCategory(category.name, category.id);
          
          // Auto-expand if searching, otherwise rely on manual toggle
          const isSearching = searchTerm.trim().length > 0;
          const isExpanded = expandedCategories.includes(category.id) || (isSearching && categoryRecipes.length > 0);

          // Skip empty categories (e.g. if search filters everything out)
          if (categoryRecipes.length === 0) return null;

          // Different styling for "Rápidas" to make it stand out or keep consistent
          const isHighlight = category.id === 'rapidas';
          const isTargeted = category.id === initialCategory;

          // Decide how many to show based on expanded state
          // If searching, show ALL matches, don't limit to 8
          const visibleRecipes = (isExpanded || isSearching) ? categoryRecipes : categoryRecipes.slice(0, 8);
          const remainingCount = categoryRecipes.length - 8;

          return (
            <section key={category.id} className={`scroll-mt-24 transition-all duration-1000 ${isTargeted ? 'bg-white p-6 rounded-3xl shadow-sm border border-brand-100' : ''}`} id={category.id}>
              {/* Section Header */}
              <div className="flex items-center gap-4 mb-8">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-sm ${isHighlight ? 'bg-yellow-100 text-yellow-600' : 'bg-white text-stone-700 border border-stone-100'}`}>
                  {category.icon}
                </div>
                <div>
                  <h3 className="text-3xl font-serif font-bold text-stone-900">{category.name}</h3>
                  <p className="text-sm text-stone-500 font-medium uppercase tracking-wider mt-1">
                    {categoryRecipes.length} {categoryRecipes.length === 1 ? 'Receita encontrada' : 'Receitas disponíveis'}
                  </p>
                </div>
              </div>

              {/* Grid for this Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
                {visibleRecipes.map((recipe) => (
                  <div 
                    key={recipe.id} 
                    className="group cursor-pointer flex flex-col animate-in fade-in duration-500"
                    onClick={() => onSelectRecipe(recipe.slug)}
                  >
                    {/* Image Card */}
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4 bg-stone-100 shadow-sm group-hover:shadow-lg transition-all duration-300">
                      <img 
                        src={recipe.imageUrl} 
                        alt={recipe.title} 
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-700 ease-in-out"
                      />
                      <div className="absolute top-3 right-3 bg-white/95 backdrop-blur px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest text-stone-800 shadow-sm">
                        {recipe.totalTime} min
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col">
                      <h4 className="text-lg font-serif font-bold text-stone-900 mb-2 leading-tight group-hover:text-brand-600 transition-colors line-clamp-2">
                        {recipe.title}
                      </h4>
                      
                      <div className="flex items-center gap-3 mt-auto text-xs text-stone-500 font-medium border-t border-stone-100 pt-3">
                        <span className="flex items-center gap-1">
                           <Clock size={14} className="text-stone-400" /> {recipe.prepTime + recipe.cookTime}m
                        </span>
                        <span className="w-1 h-1 rounded-full bg-stone-300"></span>
                        <span className="text-stone-400">{recipe.difficulty}</span>
                        <span className="ml-auto text-brand-600 flex items-center gap-0.5">
                          ★ {recipe.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Expand/Collapse Button Logic - Only show if NOT searching (search shows all) */}
              {!isSearching && categoryRecipes.length > 8 && (
                 <div className="mt-12 text-center">
                    <button 
                      onClick={() => toggleCategory(category.id)}
                      className="inline-flex items-center gap-2 bg-white text-stone-800 hover:text-brand-600 hover:border-brand-300 font-bold transition-all text-sm uppercase tracking-widest border border-stone-200 rounded-full px-8 py-3 shadow-sm hover:shadow-md"
                    >
                       {isExpanded ? (
                         <>Mostrar menos <ChevronUp size={16} /></>
                       ) : (
                         <>Ver mais {remainingCount} pratos de {category.name} <ChevronDown size={16} /></>
                       )}
                    </button>
                 </div>
              )}

              {/* Divider */}
              {!isTargeted && <div className="w-full h-px bg-stone-200 mt-16"></div>}
            </section>
          );
        })}
      </div>

      {/* Empty State */}
      {!hasAnyResults && (
        <div className="text-center py-32">
          <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4 text-stone-400">
            <Filter size={24} />
          </div>
          <p className="text-xl font-serif text-stone-600">Nenhuma receita encontrada para "{searchTerm}".</p>
          <p className="text-stone-400 mt-2">Tente pesquisar por ingrediente ou categoria (ex: "Sopas").</p>
          <button 
            onClick={() => setSearchTerm('')} 
            className="mt-6 px-6 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition"
          >
            Ver Todo o Menu
          </button>
        </div>
      )}
    </div>
  );
};

export default RecipeList;