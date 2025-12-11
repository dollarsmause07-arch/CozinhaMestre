import React, { useState, useRef, useEffect } from 'react';
import { MOCK_RECIPES } from './constants';
import Home from './components/Home';
import RecipeList from './components/RecipeList';
import RecipeDetail from './components/RecipeDetail';
import { Menu, X, ChefHat, Search, Mail, CheckCircle, ArrowRight, MessageCircle, Send } from 'lucide-react';
import { askGlobalChefAI } from './services/geminiService';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [currentRecipeSlug, setCurrentRecipeSlug] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // States for interactive features
  const [globalSearchTerm, setGlobalSearchTerm] = useState('');
  const [targetCategory, setTargetCategory] = useState(''); // New State for specific category navigation
  const [headerSearchInput, setHeaderSearchInput] = useState('');
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'info'} | null>(null);

  // Global Chat State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: 'Olá! Sou o seu Chef Global. Sou especialista em culinária Africana e Portuguesa. Posso ensinar-lhe a fazer uma Cachupa rica, uma Moamba de Galinha autêntica, ou qualquer um dos mais de 50 pratos do meu repertório. O que vamos cozinhar?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const navigateTo = (page: string) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
    setIsMobileMenuOpen(false);
  };

  const selectRecipe = (slug: string) => {
    setCurrentRecipeSlug(slug);
    setCurrentPage('recipe-detail');
    window.scrollTo(0, 0);
  };

  const handleCategorySelect = (categoryId: string) => {
    setTargetCategory(categoryId);
    setGlobalSearchTerm(''); // Clear text search to show the category clearly
    navigateTo('recipes');
  };

  // Feature: Show Toast Notification
  const showToast = (message: string) => {
    setNotification({ message, type: 'success' });
    setTimeout(() => setNotification(null), 4000);
  };

  // Feature: Global Header Search
  const handleHeaderSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (headerSearchInput.trim()) {
      setGlobalSearchTerm(headerSearchInput);
      setTargetCategory(''); // Clear specific category target
      navigateTo('recipes');
    }
  };

  // Feature: Subscribe Action
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    form.reset();
    showToast("Subscrição realizada com sucesso! Bem-vindo à família.");
  };

  // Chat Logic
  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsChatLoading(true);

    // Prepare history for API
    const history = chatMessages.map(m => ({ role: m.role, content: m.content }));
    
    const response = await askGlobalChefAI(userMsg, history);
    
    setChatMessages(prev => [...prev, { role: 'assistant', content: response }]);
    setIsChatLoading(false);
  };

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isChatOpen]);


  const renderContent = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={navigateTo} onSelectRecipe={selectRecipe} onSelectCategory={handleCategorySelect} />;
      case 'recipes':
        return (
          <RecipeList 
            recipes={MOCK_RECIPES} 
            onSelectRecipe={selectRecipe} 
            initialSearchTerm={globalSearchTerm}
            initialCategory={targetCategory}
          />
        );
      case 'recipe-detail':
        const recipe = MOCK_RECIPES.find(r => r.slug === currentRecipeSlug);
        return recipe ? (
          <RecipeDetail 
            recipe={recipe} 
            onSaveAction={(saved) => showToast(saved ? "Receita guardada nos favoritos!" : "Receita removida dos favoritos.")}
          />
        ) : <div className="min-h-[50vh] flex items-center justify-center">Receita não encontrada</div>;
      case 'techniques':
        return (
            <div className="max-w-4xl mx-auto py-32 px-4 text-center">
                <div className="inline-block p-4 bg-brand-50 rounded-full mb-6">
                   <ChefHat size={48} className="text-brand-500" />
                </div>
                <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-stone-900">Academia de Técnicas</h2>
                <p className="text-xl text-stone-500 max-w-2xl mx-auto leading-relaxed">
                   Estamos a filmar novos conteúdos de vídeo. Em breve, uma biblioteca completa de técnicas, desde o corte perfeito até aos segredos dos molhos franceses.
                </p>
                <button onClick={() => navigateTo('home')} className="mt-10 px-8 py-3 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition font-medium">
                   Voltar à Inspiração
                </button>
            </div>
        );
      default:
        return <Home onNavigate={navigateTo} onSelectRecipe={selectRecipe} onSelectCategory={handleCategorySelect} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-stone-800 font-sans flex flex-col relative">
      
      {/* Toast Notification Overlay */}
      {notification && (
        <div className="fixed top-24 right-4 md:right-8 z-[100] bg-stone-900 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-right-10 fade-in duration-300">
          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-stone-900">
            <CheckCircle size={18} strokeWidth={3} />
          </div>
          <div>
            <h4 className="font-bold text-sm">Sucesso</h4>
            <p className="text-sm text-stone-300">{notification.message}</p>
          </div>
          <button onClick={() => setNotification(null)} className="ml-2 text-stone-500 hover:text-white">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Professional Glassmorphism Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200/60 no-print transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => navigateTo('home')}>
              <div className="text-brand-600 transition-transform group-hover:rotate-12">
                <ChefHat size={32} strokeWidth={1.5} />
              </div>
              <div className="flex flex-col -space-y-1">
                 <span className="text-2xl font-serif font-bold tracking-tight text-stone-900">Cozinha<span className="text-brand-600">Mestre</span></span>
                 <span className="text-2xl font-serif font-bold tracking-tight text-stone-900 hidden">Cozinha<span className="text-brand-600">Mestre</span></span>
                 <span className="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-medium">Culinary Arts</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-10">
              {['Início', 'Receitas', 'Técnicas'].map((item, idx) => {
                 const pageMap = ['home', 'recipes', 'techniques'];
                 const isActive = currentPage === pageMap[idx];
                 return (
                   <button 
                    key={item}
                    onClick={() => {
                      if (pageMap[idx] === 'recipes') {
                         setGlobalSearchTerm(''); 
                         setTargetCategory('');
                      }
                      navigateTo(pageMap[idx]);
                    }} 
                    className={`text-sm font-medium tracking-wide transition-colors duration-200 relative py-2 
                      ${isActive ? 'text-brand-600' : 'text-stone-600 hover:text-stone-900'}`}
                   >
                     {item}
                     {isActive && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-600 rounded-full"></span>}
                   </button>
                 );
              })}
            </nav>

            {/* Actions */}
            <div className="hidden md:flex items-center gap-6">
               <form onSubmit={handleHeaderSearch} className="relative group">
                 <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 group-hover:text-brand-500 transition-colors cursor-pointer">
                    <Search size={18} />
                 </button>
                 <input 
                   type="text" 
                   value={headerSearchInput}
                   onChange={(e) => setHeaderSearchInput(e.target.value)}
                   placeholder="Buscar receita..." 
                   className="pl-10 pr-4 py-2 rounded-full bg-stone-100 text-sm border-transparent focus:bg-white focus:border-brand-200 focus:ring-4 focus:ring-brand-50/50 outline-none w-40 focus:w-64 transition-all duration-300 placeholder:text-stone-400" 
                 />
               </form>
               <button 
                onClick={(e) => handleSubscribe(e as any)}
                className="bg-stone-900 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-stone-800 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
               >
                 Subscrever
               </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-stone-600 hover:bg-stone-100 rounded-full transition">
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-stone-200 shadow-2xl p-6 space-y-6 animate-in slide-in-from-top-2">
            <form onSubmit={(e) => { handleHeaderSearch(e); setIsMobileMenuOpen(false); }}>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
                <input 
                  type="text" 
                  value={headerSearchInput}
                  onChange={(e) => setHeaderSearchInput(e.target.value)}
                  placeholder="O que procura hoje?"
                  className="w-full bg-stone-100 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>
            </form>
            <nav className="flex flex-col space-y-4">
              <button onClick={() => navigateTo('home')} className="text-xl font-serif font-medium text-stone-800 text-left">Início</button>
              <button onClick={() => { setGlobalSearchTerm(''); setTargetCategory(''); navigateTo('recipes'); }} className="text-xl font-serif font-medium text-stone-800 text-left">Receitas</button>
              <button onClick={() => navigateTo('techniques')} className="text-xl font-serif font-medium text-stone-800 text-left">Técnicas</button>
            </nav>
            <div className="pt-6 border-t border-stone-100">
               <button onClick={(e) => { handleSubscribe(e as any); setIsMobileMenuOpen(false); }} className="w-full bg-brand-600 text-white py-3 rounded-xl text-lg font-medium shadow-brand-200 shadow-lg">
                 Assinar Newsletter
               </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {renderContent()}
      </main>

      {/* Floating Chat Button */}
      <button 
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white p-4 rounded-full shadow-2xl hover:bg-brand-600 transition-all duration-300 transform hover:scale-105"
        title="Chef Global IA"
      >
        {isChatOpen ? <X size={24} /> : <MessageCircle size={28} />}
        {!isChatOpen && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-brand-500"></span>
          </span>
        )}
      </button>

      {/* Floating Chat Window */}
      {isChatOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-full max-w-sm sm:w-96 bg-white rounded-2xl shadow-2xl border border-stone-100 flex flex-col h-[500px] animate-in slide-in-from-bottom-10 fade-in duration-300 overflow-hidden">
          {/* Header */}
          <div className="bg-stone-900 p-4 flex items-center gap-3 border-b border-stone-800">
             <div className="bg-brand-600 p-2 rounded-full text-white">
                <ChefHat size={18} />
             </div>
             <div>
               <h3 className="text-white font-serif font-bold text-lg leading-none">Chef Global</h3>
               <p className="text-stone-400 text-xs mt-1 flex items-center gap-1">
                 <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Online • Cozinha Internacional
               </p>
             </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50">
             {chatMessages.map((msg, idx) => (
               <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                 <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                   msg.role === 'user' 
                    ? 'bg-stone-900 text-white rounded-br-none' 
                    : 'bg-white text-stone-700 border border-stone-200 rounded-bl-none shadow-sm prose prose-sm prose-p:my-1 prose-ul:my-1 prose-li:my-0'
                 }`}>
                   {msg.role === 'assistant' ? (
                      <div dangerouslySetInnerHTML={{ 
                        __html: msg.content
                          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                          .replace(/\n/g, '<br/>')
                       }} />
                   ) : (
                     msg.content
                   )}
                 </div>
               </div>
             ))}
             {isChatLoading && (
               <div className="flex justify-start">
                  <div className="bg-white border border-stone-200 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm flex gap-1">
                    <span className="w-2 h-2 bg-stone-300 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-stone-300 rounded-full animate-bounce delay-100"></span>
                    <span className="w-2 h-2 bg-stone-300 rounded-full animate-bounce delay-200"></span>
                  </div>
               </div>
             )}
             <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleChatSubmit} className="p-4 bg-white border-t border-stone-100">
             <div className="flex items-center gap-2 mb-2 overflow-x-auto pb-2 scrollbar-hide">
               <button type="button" onClick={() => setChatInput("Como fazer Cachupa Rica?")} className="text-xs bg-brand-50 text-brand-700 px-3 py-1 rounded-full whitespace-nowrap border border-brand-100 hover:bg-brand-100 transition">🇨🇻 Cachupa</button>
               <button type="button" onClick={() => setChatInput("Receita de Moamba de Galinha")} className="text-xs bg-brand-50 text-brand-700 px-3 py-1 rounded-full whitespace-nowrap border border-brand-100 hover:bg-brand-100 transition">🇦🇴 Moamba</button>
               <button type="button" onClick={() => setChatInput("Como fazer Matapa com Caranguejo?")} className="text-xs bg-brand-50 text-brand-700 px-3 py-1 rounded-full whitespace-nowrap border border-brand-100 hover:bg-brand-100 transition">🇲🇿 Matapa</button>
               <button type="button" onClick={() => setChatInput("Receita de Caldo de Mancarra")} className="text-xs bg-brand-50 text-brand-700 px-3 py-1 rounded-full whitespace-nowrap border border-brand-100 hover:bg-brand-100 transition">🇬🇼 Mancarra</button>
               <button type="button" onClick={() => setChatInput("Receita de Jollof Rice")} className="text-xs bg-brand-50 text-brand-700 px-3 py-1 rounded-full whitespace-nowrap border border-brand-100 hover:bg-brand-100 transition">🌍 Jollof</button>
               <button type="button" onClick={() => setChatInput("Receita de Rancho à Portuguesa")} className="text-xs bg-brand-50 text-brand-700 px-3 py-1 rounded-full whitespace-nowrap border border-brand-100 hover:bg-brand-100 transition">🇵🇹 Rancho</button>
             </div>
             <div className="relative">
               <input 
                 type="text" 
                 value={chatInput}
                 onChange={(e) => setChatInput(e.target.value)}
                 placeholder="Pergunte sobre qualquer prato..."
                 className="w-full bg-stone-100 border border-transparent focus:bg-white focus:border-brand-300 focus:ring-4 focus:ring-brand-50/50 rounded-xl pl-4 pr-12 py-3 text-sm outline-none transition-all"
               />
               <button 
                 type="submit" 
                 disabled={!chatInput.trim() || isChatLoading}
                 className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-stone-900 text-white rounded-lg hover:bg-brand-600 disabled:opacity-50 disabled:hover:bg-stone-900 transition-colors"
               >
                 <Send size={16} />
               </button>
             </div>
          </form>
        </div>
      )}

      {/* Professional Footer */}
      <footer className="bg-stone-900 text-stone-400 pt-20 pb-10 no-print">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-12 gap-12">
          
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-6">
            <div className="flex items-center gap-2 text-white">
              <ChefHat size={28} className="text-brand-500" />
              <span className="text-2xl font-serif font-bold">CozinhaMestre</span>
            </div>
            <p className="text-stone-400 leading-relaxed pr-6 max-w-sm">
              O destino premium para cozinheiros caseiros. Elevamos o padrão das receitas online com testes rigorosos, fotografia inspiradora e técnicas acessíveis.
            </p>
          </div>

          {/* Links Columns */}
          <div className="md:col-span-3">
            <h4 className="text-white font-serif font-bold text-lg mb-6">Descobrir</h4>
            <ul className="space-y-3 text-sm font-medium">
              <li><button onClick={() => navigateTo('recipes')} className="hover:text-brand-400 transition-colors">Receitas Recentes</button></li>
              <li><button onClick={() => navigateTo('techniques')} className="hover:text-brand-400 transition-colors">Vídeos</button></li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="md:col-span-4">
             <h4 className="text-white font-serif font-bold text-lg mb-6">Newsletter Semanal</h4>
             <p className="text-xs mb-4 text-stone-500">As melhores receitas e dicas no seu email. Sem spam.</p>
             <form onSubmit={handleSubscribe} className="space-y-3">
               <div className="relative">
                 <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" size={16} />
                 <input 
                    type="email" 
                    required 
                    placeholder="seu@email.com" 
                    className="bg-stone-800 border border-stone-700 rounded-lg pl-10 pr-4 py-3 text-sm w-full focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none text-white placeholder:text-stone-600 transition-all" 
                  />
               </div>
               <button type="submit" className="w-full bg-brand-600 text-white px-4 py-3 rounded-lg text-sm font-bold hover:bg-brand-700 transition shadow-lg tracking-wide uppercase flex items-center justify-center gap-2">
                 Inscrever-se <ArrowRight size={16} />
               </button>
             </form>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-stone-800 flex flex-col md:flex-row justify-between items-center text-xs text-stone-600 gap-4">
          <p>&copy; {new Date().getFullYear()} Cozinha Mestre Media. Todos os direitos reservados.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-stone-400">Privacidade</a>
            <a href="#" className="hover:text-stone-400">Termos</a>
            <a href="#" className="hover:text-stone-400">Cookies</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;