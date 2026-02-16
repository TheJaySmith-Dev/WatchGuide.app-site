import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Play, 
  Search, 
  List, 
  Users, 
  Calendar, 
  Smile, 
  History, 
  BarChart3, 
  Dices, 
  Sparkles,
  ChevronRight,
  Settings,
  LayoutGrid,
  Star,
  X,
  Menu,
  SlidersHorizontal,
  ArrowLeft,
  ShieldCheck,
  Mail,
  UserCircle,
  BrainCircuit,
  Zap,
  Lock,
  Compass,
  Database
} from 'lucide-react';

// Magenta/Purple Logo: Matching the branding exactly
const LogoIcon = ({ size = "w-10 h-10" }: { size?: string }) => (
  <div className={`${size} relative rounded-[22%] bg-gradient-to-br from-[#d900d9] to-[#800080] flex items-center justify-center overflow-hidden shadow-xl shadow-purple-900/40 ring-1 ring-white/10 group-hover:scale-105 transition-transform duration-300`}>
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.2)_0%,transparent_80%)]"></div>
    <div className="w-[85%] h-[85%] rounded-full border-[1.5px] border-white/20 flex items-center justify-center">
      <div className="w-[86%] h-[86%] rounded-full border-[2px] border-white/30 flex items-center justify-center">
        <div className="w-[88%] h-[88%] rounded-full border-[2.5px] border-white/40 flex items-center justify-center bg-white/5">
           <Play fill="white" className="text-white ml-0.5 drop-shadow-sm opacity-95" size={16} />
        </div>
      </div>
    </div>
  </div>
);

type Page = '/' | '/support' | '/profiles' | '/privacy-policy' | '/scout-ai';

const FeatureCard = ({ icon: Icon, title, description, delay = "" }: { icon: any, title: string, description: string, delay?: string }) => (
  <div className={`glass-card p-8 rounded-3xl flex flex-col gap-5 animate-fade-up opacity-0 ${delay}`}>
    <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-400">
      <Icon size={28} />
    </div>
    <h3 className="text-2xl font-bold text-white">{title}</h3>
    <p className="text-zinc-400 leading-relaxed">
      {description}
    </p>
  </div>
);

const AppStoreButton = () => (
  <a 
    href="https://apps.apple.com/us/app/watchguide-app/id6758427085" 
    target="_blank"
    rel="noopener noreferrer"
    className="inline-block transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-black/40"
  >
    <img 
      src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" 
      alt="Download on the App Store"
      className="h-[52px]"
    />
  </a>
);

const Navbar = ({ navigate, currentPage }: { navigate: (p: Page) => void, currentPage: Page }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNav = (p: Page) => {
    navigate(p);
    setIsMenuOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || currentPage !== '/' ? 'bg-black/90 backdrop-blur-xl border-b border-white/5 py-4' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => handleNav('/')}>
          <LogoIcon />
          <span className="text-2xl font-bold tracking-tight">Watch<span className="text-purple-400">Guide</span></span>
        </div>
        
        <div className="hidden md:flex items-center gap-10 text-sm font-semibold text-zinc-300">
          <button onClick={() => handleNav('/')} className={`transition-all hover:text-purple-400 ${currentPage === '/' ? 'text-purple-400' : ''}`}>Features</button>
          <button onClick={() => handleNav('/scout-ai')} className={`transition-all hover:text-purple-400 ${currentPage === '/scout-ai' ? 'text-purple-400' : ''}`}>Scout AI</button>
          <button onClick={() => handleNav('/profiles')} className={`transition-all hover:text-purple-400 ${currentPage === '/profiles' ? 'text-purple-400' : ''}`}>Profiles</button>
          <button onClick={() => handleNav('/privacy-policy')} className={`transition-all hover:text-purple-400 ${currentPage === '/privacy-policy' ? 'text-purple-400' : ''}`}>Privacy</button>
          <button onClick={() => handleNav('/support')} className="px-6 py-2.5 bg-zinc-800/80 hover:bg-zinc-700 text-white rounded-xl border border-white/10 transition-all">Support</button>
        </div>

        <button className="md:hidden text-zinc-400" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[73px] bg-black z-40 animate-fade-up">
          <div className="flex flex-col p-10 gap-8 text-2xl font-bold text-zinc-300">
            <button className="text-left" onClick={() => handleNav('/')}>Features</button>
            <button className="text-left" onClick={() => handleNav('/scout-ai')}>Scout AI</button>
            <button className="text-left" onClick={() => handleNav('/profiles')}>Profiles</button>
            <button className="text-left" onClick={() => handleNav('/privacy-policy')}>Privacy Policy</button>
            <button className="text-left text-purple-400" onClick={() => handleNav('/support')}>Support</button>
          </div>
        </div>
      )}
    </nav>
  );
};

const HomeView = ({ navigate }: { navigate: (p: Page) => void }) => (
  <div className="animate-fade-up">
    <section className="relative pt-40 pb-28 md:pt-60 md:pb-48 overflow-hidden">
      <div className="hero-blur"></div>
      <div className="container mx-auto px-6 flex flex-col items-center text-center">
        <div className="flex flex-col gap-10 max-w-5xl">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-widest mx-auto animate-pulse">
            <Sparkles size={16} />
            <span>Discover the Future of Streaming</span>
          </div>
          <h1 className="text-6xl md:text-9xl font-black leading-[1] tracking-tighter delay-1">
            Your personal <br className="hidden md:block" /> movie <span className="text-gradient">companion.</span>
          </h1>
          <p className="text-xl md:text-3xl text-zinc-400 mx-auto delay-2 leading-relaxed max-w-3xl font-medium">
            Discover trending titles, track your progress, and never miss a premiere again. Powered by Scout AI for the smartest recommendations.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center delay-3 items-center mt-4">
            <AppStoreButton />
            <button 
              onClick={() => navigate('/scout-ai')}
              className="px-12 py-4 bg-zinc-900 hover:bg-zinc-800 text-white rounded-2xl font-bold border border-white/5 transition-all h-[52px] flex items-center text-xl shadow-xl shadow-purple-900/10"
            >
              Learn more
            </button>
          </div>
        </div>
      </div>
    </section>

    <section id="features" className="py-32 bg-zinc-950/50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">Master your watchlist</h2>
          <p className="text-zinc-400 text-lg md:text-xl">Everything you need to organize your entertainment life in one beautiful, cinematic experience.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard icon={Search} title="Smart Search" description="Deep search across millions of movies, TV shows, and cast members with rich detail pages." delay="delay-1" />
          <FeatureCard icon={List} title="Lists & Tracking" description="Create custom lists, track your viewing history, and mark episodes as watched automatically." delay="delay-2" />
          <FeatureCard icon={Calendar} title="Countdown Calendar" description="Sync upcoming premieres to your calendar and get notifications when new seasons drop." delay="delay-3" />
          <FeatureCard icon={Smile} title="Mood Discovery" description="Can't decide? Pick a mood and let us curate the perfect evening for you instantly." delay="delay-1" />
          <FeatureCard icon={History} title="Decade Explorer" description="Travel back in time and discover the cinematic gems from any decade in history." delay="delay-2" />
          <FeatureCard icon={BarChart3} title="Stats & Insights" description="Visualize your watching habits with beautiful charts. See your top genres and watch time." delay="delay-3" />
        </div>
      </div>
    </section>

    <section className="py-32 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="glass-card rounded-[50px] p-10 md:p-24 overflow-hidden relative border-purple-500/10">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-purple-500/10 blur-[120px] -z-10"></div>
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <div>
              <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center text-white mb-10 shadow-2xl shadow-purple-600/30">
                <Sparkles size={32} />
              </div>
              <h2 className="text-5xl font-black mb-8 leading-tight tracking-tight">Meet Scout AI <br />Assistant</h2>
              <p className="text-zinc-400 text-xl mb-10 leading-relaxed font-medium">
                Scout is more than just a search tool. It's your personal film critic, concierge, and fellow cinema enthusiast.
              </p>
              <button 
                onClick={() => navigate('/scout-ai')}
                className="flex items-center gap-3 text-purple-400 text-xl font-black hover:gap-6 transition-all group"
              >
                Discover Scout AI <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            <div className="relative">
              <div className="aspect-square bg-[#0a0a0a] rounded-[40px] border border-white/5 p-10 flex flex-col gap-8 shadow-[0_40px_100px_rgba(0,0,0,0.6)]">
                 <div className="flex gap-5 items-start animate-fade-up">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex-shrink-0 flex items-center justify-center text-zinc-500"><UserCircle size={28} /></div>
                    <div className="bg-zinc-800/80 p-5 rounded-3xl rounded-tl-none text-base text-zinc-100 max-w-[85%] border border-white/5">
                      I'm looking for a sci-fi thriller with a twist.
                    </div>
                 </div>
                 <div className="flex gap-5 items-start justify-end animate-fade-up delay-1">
                    <div className="bg-purple-600 p-5 rounded-3xl rounded-tr-none text-base text-white font-semibold max-w-[85%] shadow-xl shadow-purple-600/20">
                      Based on your love for 'Inception', I recommend 'Arrival' (2016). It has a 94% rating.
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#d900d9] to-[#800080] flex-shrink-0 flex items-center justify-center text-white shadow-lg shadow-purple-600/40"><Sparkles size={20} /></div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
);

const ScoutView = ({ back }: { back: () => void }) => (
  <div className="min-h-screen pt-40 pb-20 container mx-auto px-6 animate-fade-up">
    <div className="max-w-5xl mx-auto">
      <button onClick={back} className="flex items-center gap-3 text-zinc-500 hover:text-white transition-colors mb-16 text-lg font-bold group">
        <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
      </button>
      
      <div className="flex flex-col lg:flex-row gap-16 items-start mb-24">
        <div className="flex-1">
          <div className="w-20 h-20 bg-purple-600 rounded-3xl flex items-center justify-center text-white mb-10 shadow-2xl shadow-purple-600/30">
            <BrainCircuit size={40} />
          </div>
          <h2 className="text-6xl font-black mb-8 tracking-tighter">Scout AI</h2>
          <p className="text-zinc-400 text-2xl leading-relaxed mb-10 font-medium">
            The world's most advanced movie intelligence assistant, built directly into your pocket.
          </p>
          <div className="flex gap-5">
            <div className="px-6 py-2.5 bg-purple-500/10 rounded-full text-purple-400 text-sm font-bold border border-purple-500/20 flex items-center gap-3">
              <Lock size={16} /> Adult (18+) Profiles
            </div>
          </div>
        </div>
        <div className="flex-1 glass-card p-12 rounded-[50px] border-purple-500/20">
          <h3 className="text-3xl font-black mb-8 flex items-center gap-4">
            <Zap className="text-purple-400" /> Intelligence Layer
          </h3>
          <ul className="space-y-8">
            <li className="flex gap-6">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-400 font-black shrink-0">1</div>
              <div>
                <span className="text-xl font-bold block mb-2">Contextual Understanding</span>
                <p className="text-zinc-400 leading-relaxed">
                  Scout understands the <span className="text-purple-400 italic font-semibold">nuance</span> of your emotional state. Ask for movies that match your current vibe perfectly.
                </p>
              </div>
            </li>
            <li className="flex gap-6">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-400 font-black shrink-0">2</div>
              <div>
                <span className="text-xl font-bold block mb-2">Personalized Graphs</span>
                <p className="text-zinc-400 leading-relaxed">
                  Every title you track refines a complex knowledge graph of your tastes, suggesting gems you didn't know you loved.
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="glass-card p-10 rounded-[40px]">
          <Database className="text-purple-400 mb-6" size={32} />
          <h4 className="text-xl font-bold mb-4">Unrivaled Data</h4>
          <p className="text-zinc-500 text-sm leading-relaxed">Direct access to millions of credits, trivia, and real-time streaming availability data.</p>
        </div>
        <div className="glass-card p-10 rounded-[40px]">
          <Compass className="text-purple-400 mb-6" size={32} />
          <h4 className="text-xl font-bold mb-4">Taste Mapping</h4>
          <p className="text-zinc-500 text-sm leading-relaxed">Sophisticated neural taste-matching that evolves with every interaction you make.</p>
        </div>
        <div className="glass-card p-10 rounded-[40px]">
          <ShieldCheck className="text-purple-400 mb-6" size={32} />
          <h4 className="text-xl font-bold mb-4">Privacy First</h4>
          <p className="text-zinc-500 text-sm leading-relaxed">Conversations are encrypted and never shared. Your taste profile stays completely private.</p>
        </div>
      </div>
    </div>
  </div>
);

const SupportView = ({ back }: { back: () => void }) => (
  <div className="min-h-screen pt-32 pb-20 container mx-auto px-6 flex flex-col items-center justify-center text-center animate-fade-up">
    <button onClick={back} className="flex items-center gap-3 text-zinc-500 hover:text-white transition-colors mb-16 font-bold">
      <ArrowLeft size={24} /> Back to Home
    </button>
    <div className="w-24 h-24 bg-purple-500/10 rounded-[40px] flex items-center justify-center text-purple-400 mb-10 shadow-2xl shadow-purple-500/10">
      <Mail size={48} />
    </div>
    <h2 className="text-5xl font-black mb-8">How can we help?</h2>
    <div className="glass-card p-10 rounded-[40px] max-w-2xl">
      <p className="text-zinc-400 text-2xl leading-relaxed mb-10 font-medium">
        Encountered a bug or have a feature request? Reach out to our dedicated support team and we'll get back to you within 24 hours.
      </p>
      <a href="mailto:support@watchguide.app" className="text-3xl font-black text-purple-400 hover:text-purple-300 transition-colors">
        support@watchguide.app
      </a>
    </div>
  </div>
);

const PrivacyView = ({ back }: { back: () => void }) => (
  <div className="min-h-screen pt-40 pb-20 container mx-auto px-6 animate-fade-up">
    <div className="max-w-4xl mx-auto">
      <button onClick={back} className="flex items-center gap-3 text-zinc-500 hover:text-white transition-colors mb-16 font-bold">
        <ArrowLeft size={24} /> Back to Home
      </button>
      <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center text-emerald-500 mb-10">
        <ShieldCheck size={40} />
      </div>
      <h2 className="text-6xl font-black mb-12 tracking-tighter">Privacy Commitment</h2>
      <div className="glass-card rounded-[50px] p-12 md:p-16 space-y-12">
        <div>
          <h3 className="text-3xl font-bold mb-6 text-white">Zero Third-Party Data Sharing</h3>
          <p className="text-zinc-400 leading-relaxed text-xl">
            At WatchGuide, your entertainment history is considered strictly personal. Our commitment to your digital sovereignty is absolute: 
            <br /><br />
            <span className="text-white text-2xl font-black border-l-8 border-purple-500 pl-10 block my-10 italic">
              We never send your personal data to advertisers or third parties. Period.
            </span>
          </p>
        </div>
        <p className="text-zinc-500 text-lg">
          All your tracking data, watchlists, and preferences are used solely to enhance your own experience within the ecosystem. We do not sell, rent, or trade your data with advertising networks or external data brokers.
        </p>
      </div>
    </div>
  </div>
);

const ProfilesView = ({ back }: { back: () => void }) => (
  <div className="min-h-screen pt-40 pb-20 container mx-auto px-6 animate-fade-up">
    <div className="max-w-5xl mx-auto text-center">
      <button onClick={back} className="flex items-center gap-3 text-zinc-500 hover:text-white transition-colors mb-16 mx-auto font-bold">
        <ArrowLeft size={24} /> Back to Home
      </button>
      <div className="w-20 h-20 bg-amber-500/10 rounded-3xl flex items-center justify-center text-amber-500 mb-10 mx-auto">
        <UserCircle size={40} />
      </div>
      <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter">Multi-Profile Ecosystem</h2>
      <p className="text-zinc-400 text-2xl mb-20 max-w-3xl mx-auto font-medium">
        WatchGuide is built for the entire household. Each profile serves as a secure, private vault for your cinema life.
      </p>
      
      <div className="grid md:grid-cols-3 gap-10">
        <div className="glass-card p-10 rounded-[40px] text-left">
          <div className="w-14 h-14 bg-purple-500 rounded-2xl mb-8 shadow-xl shadow-purple-500/20"></div>
          <h4 className="text-2xl font-bold mb-4">Adult (18+)</h4>
          <p className="text-zinc-500 leading-relaxed">
            Unlocks Scout AI, advanced analytics, and unrestricted access to the global movie database.
          </p>
        </div>
        <div className="glass-card p-10 rounded-[40px] text-left border-purple-500/20">
          <div className="w-14 h-14 bg-emerald-500 rounded-2xl mb-8 shadow-xl shadow-emerald-500/20"></div>
          <h4 className="text-2xl font-bold mb-4">Kids Mode</h4>
          <p className="text-zinc-500 leading-relaxed">
            Safety first. Automated rating filters (G, PG) and disabled AI conversational features.
          </p>
        </div>
        <div className="glass-card p-10 rounded-[40px] text-left">
          <div className="w-14 h-14 bg-zinc-800 rounded-2xl mb-8 shadow-xl shadow-black/20"></div>
          <h4 className="text-2xl font-bold mb-4">Shared Hub</h4>
          <p className="text-zinc-500 leading-relaxed">
            Instant profile switching on a single device. Your progress remains strictly isolated.
          </p>
        </div>
      </div>
    </div>
  </div>
);

const App = () => {
  const [currentPage, setCurrentPage] = useState<Page>('/');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as Page || '/';
      const validPages: Page[] = ['/', '/support', '/profiles', '/privacy-policy', '/scout-ai'];
      if (validPages.includes(hash)) {
        setCurrentPage(hash);
      } else {
        setCurrentPage('/');
      }
    };
    
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (p: Page) => {
    window.location.hash = p === '/' ? '' : p;
    setCurrentPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#050505] selection:bg-purple-500 selection:text-white">
      <Navbar navigate={navigate} currentPage={currentPage} />
      
      <main className="min-h-[calc(100vh-200px)]">
        {currentPage === '/' && <HomeView navigate={navigate} />}
        {currentPage === '/support' && <SupportView back={() => navigate('/')} />}
        {currentPage === '/privacy-policy' && <PrivacyView back={() => navigate('/')} />}
        {currentPage === '/profiles' && <ProfilesView back={() => navigate('/')} />}
        {currentPage === '/scout-ai' && <ScoutView back={() => navigate('/')} />}
      </main>

      <footer className="py-24 border-t border-white/5 bg-black/40">
        <div className="container mx-auto px-6 flex flex-col items-center gap-10">
          <div className="flex items-center gap-4 group cursor-pointer" onClick={() => navigate('/')}>
            <LogoIcon size="w-10 h-10" />
            <span className="text-2xl font-black">WatchGuide</span>
          </div>
          <nav className="flex flex-wrap justify-center gap-x-12 gap-y-6 text-sm font-bold text-zinc-500">
            <button onClick={() => navigate('/')} className="hover:text-purple-400 transition-colors uppercase tracking-widest">Features</button>
            <button onClick={() => navigate('/scout-ai')} className="hover:text-purple-400 transition-colors uppercase tracking-widest">Scout AI</button>
            <button onClick={() => navigate('/profiles')} className="hover:text-purple-400 transition-colors uppercase tracking-widest">Profiles</button>
            <button onClick={() => navigate('/privacy-policy')} className="hover:text-purple-400 transition-colors uppercase tracking-widest">Privacy</button>
            <button onClick={() => navigate('/support')} className="hover:text-purple-400 transition-colors uppercase tracking-widest">Support</button>
          </nav>
          <div className="flex flex-col items-center gap-6">
            <AppStoreButton />
            <p className="text-zinc-600 text-xs font-bold uppercase tracking-[0.2em]">© 2026 WatchGuide App. Developed for Cinema Lovers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);