import React from 'react';
import { CATEGORIES, MOCK_RECIPES } from '../constants';
import { ArrowRight, Clock, Flame, Star, ChefHat } from 'lucide-react';

interface HomeProps {
  onNavigate: (page: string) => void;
  onSelectRecipe: (slug: string) => void;
  onSelectCategory: (categoryId: string) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate, onSelectRecipe, onSelectCategory }) => {
  const featured = MOCK_RECIPES.slice(0, 4);
  const trending = MOCK_RECIPES.slice(4, 7);

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Editorial Hero Section */}
      <section className="relative h-[85vh] w-full overflow-hidden">
        {/* Background with overlay */}
        <div className="absolute inset-0">
           <img 
             src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=90" 
             alt="Chef Profissional a cozinhar" 
             className="w-full h-full object-cover animate-in fade-in duration-1000"
           />
           <div className="absolute inset-0 bg-gradient-to-r from-stone-900/90 via-stone-900/50 to-transparent"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 h-full max-w-7xl mx-auto px-4 flex items-center">
          <div className="max-w-3xl text-white pt-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 border border-brand-500/30 backdrop-blur-sm mb-6">
              <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span>
              <span className="text-xs font-bold tracking-widest uppercase text-brand-100">Nova Coleção de Inverno</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-8 leading-[1.1] tracking-tight text-shadow-lg">
              Arte na cozinha,<br/>
              <span className="font-display text-6xl md:text-8xl text-brand-400 font-normal ml-2 drop-shadow-lg">simplicidade</span> <span className="text-white">no prato.</span>
            </h1>
            <p className="text-lg md:text-xl text-stone-200 mb-10 max-w-lg font-light leading-relaxed">
              Descubra receitas testadas exaustivamente pela nossa equipa de chefs. Guias visuais passo a passo para resultados de restaurante em sua casa.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => onNavigate('recipes')}
                className="bg-brand-600 hover:bg-brand-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 shadow-xl shadow-brand-900/20 flex items-center justify-center gap-3 group"
              >
                Explorar Receitas 
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => onNavigate('techniques')}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-lg font-bold text-lg transition-all flex items-center justify-center"
              >
                Ver Técnicas
              </button>
            </div>
            
            <div className="mt-16 flex items-center gap-8 text-stone-400 text-sm">
              <div>
                <span className="block text-2xl font-bold text-white font-serif">500+</span>
                <span>Receitas Originais</span>
              </div>
              <div className="w-px h-10 bg-white/20"></div>
              <div>
                <span className="block text-2xl font-bold text-white font-serif">100%</span>
                <span>Testadas por Chefs</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Elegant Categories */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
           <div className="text-center mb-16">
             <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 mb-4">Curadoria por Categoria</h2>
             <p className="text-stone-500 max-w-md mx-auto">Encontre inspiração para qualquer momento do dia ou ocasião especial.</p>
           </div>
           
           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
             {CATEGORIES.map((cat, idx) => (
               <div 
                  key={cat.id} 
                  className="group relative h-48 rounded-2xl overflow-hidden cursor-pointer shadow-soft hover:shadow-card transition-all duration-500"
                  onClick={() => onSelectCategory(cat.id)}
               >
                 {/* Pseudo-image background gradient for each category */}
                 <div className={`absolute inset-0 bg-gradient-to-br ${
                    idx === 0 ? 'from-green-100 to-green-50' :
                    idx === 1 ? 'from-orange-100 to-orange-50' :
                    idx === 2 ? 'from-pink-100 to-pink-50' :
                    idx === 3 ? 'from-emerald-100 to-emerald-50' :
                    'from-blue-100 to-blue-50'
                 } opacity-100 group-hover:scale-105 transition-transform duration-700`}></div>
                 
                 <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                    <span className="text-5xl mb-4 transform group-hover:-translate-y-2 transition-transform duration-300 drop-shadow-sm">{cat.icon}</span>
                    <h3 className="font-serif font-bold text-xl text-stone-800">{cat.name}</h3>
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-500 mt-2 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                      Ver Coleção
                    </span>
                 </div>
               </div>
             ))}
           </div>
        </div>
      </section>

      {/* Featured Section - Dark/Contrast */}
      <section className="py-24 bg-stone-900 text-stone-200">
        <div className="max-w-7xl mx-auto px-4">
           <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
             <div>
               <div className="flex items-center gap-2 mb-2 text-brand-500 font-bold uppercase tracking-widest text-xs">
                 <Flame size={16} /> Em Destaque
               </div>
               <h2 className="text-3xl md:text-4xl font-serif font-bold text-white">Receitas do Dia</h2>
             </div>
             <button onClick={() => onNavigate('recipes')} className="text-white border-b border-brand-500 pb-1 hover:text-brand-500 transition-colors">Ver todas as receitas</button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
             {featured.map(recipe => (
               <div 
                key={recipe.id} 
                className="group cursor-pointer"
                onClick={() => onSelectRecipe(recipe.slug)}
               >
                 <div className="aspect-[4/5] overflow-hidden rounded-xl relative mb-4 shadow-2xl">
                    <img 
                      src={recipe.imageUrl} 
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-700 ease-in-out" 
                      alt={recipe.title} 
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-stone-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                      {recipe.category}
                    </div>
                 </div>
                 <div className="space-y-2">
                   <div className="flex items-center justify-between text-stone-500 text-xs uppercase tracking-widest font-medium">
                     <span className="flex items-center gap-1"><Clock size={14} /> {recipe.totalTime} min</span>
                     <span className="flex items-center gap-1"><Star size={14} className="text-brand-500" /> {recipe.rating}</span>
                   </div>
                   <h3 className="font-serif text-2xl font-bold text-white leading-tight group-hover:text-brand-500 transition-colors">
                     {recipe.title}
                   </h3>
                   <p className="text-stone-400 text-sm line-clamp-2 font-light">
                     {recipe.description}
                   </p>
                 </div>
               </div>
             ))}
           </div>
        </div>
      </section>

      {/* "Why Us" Section - Clean */}
      <section className="py-24 bg-[#FAFAF9]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1 relative">
               <div className="absolute -top-10 -left-10 w-40 h-40 bg-brand-200 rounded-full opacity-50 blur-3xl"></div>
               <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-stone-300 rounded-full opacity-50 blur-3xl"></div>
               <img 
                 src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" 
                 alt="Chef a cozinhar" 
                 className="relative rounded-2xl shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500"
               />
            </div>
            <div className="order-1 md:order-2 space-y-8">
               <h2 className="text-4xl font-serif font-bold text-stone-900">A sua cozinha, <br/>ao nível de um Chef.</h2>
               <p className="text-lg text-stone-600 leading-relaxed">
                 O Cozinha Mestre não é apenas um site de receitas. É uma ferramenta de aprendizagem culinária projetada para transformar amadores em mestres da cozinha caseira.
               </p>
               
               <div className="space-y-6">
                 <div className="flex gap-4">
                   <div className="w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center text-brand-600 shrink-0">
                     <ChefHat size={24} />
                   </div>
                   <div>
                     <h4 className="font-bold text-lg text-stone-900">Desenvolvido por Profissionais</h4>
                     <p className="text-stone-500 text-sm">Todas as receitas são testadas 3 vezes antes de serem publicadas.</p>
                   </div>
                 </div>
                 <div className="flex gap-4">
                   <div className="w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center text-brand-600 shrink-0">
                     <Clock size={24} />
                   </div>
                   <div>
                     <h4 className="font-bold text-lg text-stone-900">Tempos Reais</h4>
                     <p className="text-stone-500 text-sm">Cronómetros integrados para que nunca perca o ponto.</p>
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Horizontal Scroll */}
      <section className="py-24 bg-white border-t border-stone-100">
        <div className="max-w-7xl mx-auto px-4">
           <h2 className="text-3xl font-serif font-bold text-stone-900 mb-10">Populares Esta Semana</h2>
           
           <div className="space-y-8">
             {trending.map(recipe => (
               <div 
                 key={recipe.id}
                 className="flex flex-col md:flex-row gap-8 items-center bg-stone-50 p-6 rounded-2xl hover:bg-white hover:shadow-card transition-all duration-300 border border-transparent hover:border-stone-100 cursor-pointer group"
                 onClick={() => onSelectRecipe(recipe.slug)}
               >
                 <div className="w-full md:w-1/3 aspect-video rounded-xl overflow-hidden shadow-md">
                   <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                 </div>
                 <div className="w-full md:w-2/3">
                   <div className="flex gap-2 mb-3">
                     <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2 py-1 rounded">{recipe.category}</span>
                     <span className="text-xs font-bold uppercase tracking-wider text-stone-500 bg-white border px-2 py-1 rounded">{recipe.difficulty}</span>
                   </div>
                   <h3 className="text-2xl font-serif font-bold text-stone-900 mb-3 group-hover:text-brand-600 transition-colors">{recipe.title}</h3>
                   <p className="text-stone-500 mb-4 line-clamp-2">{recipe.description}</p>
                   <div className="flex items-center gap-4 text-sm font-medium text-stone-800">
                      <div className="flex items-center gap-2">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${recipe.author}`} alt="author" className="w-6 h-6 rounded-full" />
                        <span>{recipe.author}</span>
                      </div>
                      <span className="text-stone-300">|</span>
                      <span>{recipe.votes} Votos</span>
                   </div>
                 </div>
               </div>
             ))}
           </div>
        </div>
      </section>

    </div>
  );
};

export default Home;