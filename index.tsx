import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowLeft,
  ArrowUpRight,
  Ban,
  Globe,
  Heart,
  LayoutGrid,
  Mail,
  Menu,
  ShieldCheck,
  Sparkles,
  Tv,
  X,
} from 'lucide-react';

const APP_STORE_URL = 'https://apps.apple.com/us/app/watchguide-app/id6758427085';
const SUPPORT_EMAIL = 'watchguide@jasonforreels.com';

type Page = '/' | '/support' | '/privacy';

// Hash routes. The app links to #/privacy; #/privacy-policy is kept for older links.
const routeFromHash = (): Page => {
  const hash = window.location.hash.replace('#', '');
  if (hash === '/support') return '/support';
  if (hash === '/privacy' || hash === '/privacy-policy') return '/privacy';
  return '/';
};

const useReveal = (deps: unknown[]) => {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal:not(.in)');
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      }),
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, deps);
};

const AppIcon = ({ className = 'w-8 h-8' }: { className?: string }) => (
  <img src="/img/icon.png" alt="" className={`${className} shrink-0 drop-shadow-[0_6px_16px_rgba(58,46,140,0.6)]`} />
);

const AppStoreBadge = ({ className = 'h-[52px]' }: { className?: string }) => (
  <a
    href={APP_STORE_URL}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-block transition-transform hover:scale-[1.03] active:scale-95"
  >
    <img
      src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
      alt="Download on the App Store"
      className={className}
    />
  </a>
);

const Phone = ({ src, alt, className = '' }: { src: string; alt: string; className?: string }) => (
  <div className={`phone rounded-[2.6rem] p-[7px] ${className}`}>
    <img
      src={src}
      alt={alt}
      loading="lazy"
      width={1206}
      height={2622}
      className="block w-full h-auto rounded-[2.2rem]"
    />
  </div>
);

const scrollToId = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

const Header = ({ page, navigate }: { page: Page; navigate: (p: Page, anchor?: string) => void }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [page]);

  const go = (p: Page, anchor?: string) => {
    setOpen(false);
    navigate(p, anchor);
  };

  const links: { label: string; action: () => void; active: boolean }[] = [
    { label: 'Features', action: () => go('/', 'features'), active: false },
    { label: 'Apple TV', action: () => go('/', 'apple-tv'), active: false },
    { label: 'Privacy', action: () => go('/privacy'), active: page === '/privacy' },
    { label: 'Support', action: () => go('/support'), active: page === '/support' },
  ];

  return (
    <header className="fixed top-3 md:top-5 inset-x-0 z-50 px-4 flex justify-center pointer-events-none">
      <div className="pointer-events-auto w-full max-w-[44rem]">
        <nav className="glass rounded-full pl-2 pr-2 py-2 flex items-center justify-between gap-2 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.7)]">
          <button onClick={() => go('/')} className="flex items-center gap-2.5 pl-1 pr-2 py-0.5 rounded-full" aria-label="WatchGuide home">
            <AppIcon className="w-9 h-9" />
            <span className="text-[17px] font-extrabold tracking-tight">WatchGuide</span>
          </button>

          <div className="hidden md:flex items-center gap-1 text-[14px] font-semibold text-[color:var(--muted)]">
            {links.map((l) => (
              <button
                key={l.label}
                onClick={l.action}
                className={`px-3.5 py-2 rounded-full transition-colors hover:text-white hover:bg-white/5 ${l.active ? 'text-white bg-white/10' : ''}`}
              >
                {l.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full text-[14px] font-bold text-[#2a1206] bg-gradient-to-b from-[#ffb07a] to-[#f2865a] hover:brightness-110 transition shadow-[0_6px_20px_-6px_rgba(242,134,90,0.8)]"
            >
              Get the app
            </a>
            <button
              className="md:hidden w-10 h-10 rounded-full flex items-center justify-center text-white/80 hover:bg-white/10"
              onClick={() => setOpen(!open)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>

        {open && (
          <div className="md:hidden glass mt-2 rounded-[1.75rem] p-2 flex flex-col text-[17px] font-semibold">
            {links.map((l) => (
              <button key={l.label} onClick={l.action} className="text-left px-5 py-3.5 rounded-2xl hover:bg-white/5">
                {l.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};

const features = [
  {
    id: 'tonight',
    eyebrow: 'Tonight',
    title: <>Can't decide? <span className="text-coral">Swipe.</span></>,
    body: "Tonight shows you one pick at a time, each with the reason it's for you. Swipe until something clicks, then mark it watched or save it for later.",
    points: ['One pick at a time', 'Movies, shows or everything', 'Learns from your watchlist'],
    img: '/img/tonight.jpg',
    alt: 'The Tonight screen suggesting One Battle After Another',
  },
  {
    id: 'ratings',
    eyebrow: 'Every title',
    title: <>Every rating. <span className="text-coral">One glance.</span></>,
    body: 'TMDB, IMDb, Rotten Tomatoes and Metacritic scores side by side on every title, with runtime, genre, certificate and a parent guide.',
    points: ['Four scores, side by side', 'Trailers and cast', 'Parent guide'],
    img: '/img/detail.jpg',
    alt: 'The Dune: Part Two detail page with four ratings',
  },
  {
    id: 'streamq',
    eyebrow: 'StreamQ',
    title: <>Only what's on <span className="text-coral">your services.</span></>,
    body: "Pick the streaming services you pay for and see only what's on them. Leaving Soon tells you what's about to disappear, so you never miss it.",
    points: ['Your subscriptions only', 'Leaving Soon alerts', 'Popular on each service'],
    img: '/img/streamq.jpg',
    alt: 'StreamQ showing titles from the services you subscribe to',
  },
  {
    id: 'lists',
    eyebrow: 'Your lists',
    title: <>A watchlist <span className="text-coral">worth keeping.</span></>,
    body: 'Watchlist, Watched, Liked and lists of your own, in poster-perfect grids. Continue Watching keeps your place in every show.',
    points: ['Continue Watching', 'Custom lists', 'Up Next widget'],
    img: '/img/lists.jpg',
    alt: 'My Lists with a poster grid of the watchlist',
  },
  {
    id: 'themes',
    eyebrow: 'Themes',
    title: <>Make it <span className="text-coral">your cinema.</span></>,
    body: 'Theme packs restyle the whole app: Marquee, Noir, Drive-In, Golden Age, Sci-Fi Terminal, Creature Feature and more, with a holiday theme that switches on by itself.',
    points: ['Marquee, Noir, Drive-In', 'Holiday auto-switch', 'One-time purchases'],
    img: '/img/themes.jpg',
    alt: 'The Themes screen with the Marquee theme selected',
  },
];

const extras = [
  { icon: Sparkles, title: 'Made for you', body: 'Recommendations learn from what you watch and like.' },
  { icon: LayoutGrid, title: 'Browse everything', body: 'Trending titles, studio and franchise hubs, cast and crew.' },
  { icon: Ban, title: 'Ad-free', body: 'No banners, no interruptions. Just your movies and shows.' },
  { icon: Globe, title: '9 languages', body: 'Including title art that follows your app language.' },
];

const HomeView = () => (
  <>
    {/* Hero */}
    <section className="relative bg-stage overflow-hidden pt-36 md:pt-44">
      <div className="beam" />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 text-center">
        <div className="reveal inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass text-[13px] font-semibold text-[color:var(--muted)] mb-7">
          <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--coral)]" />
          Ad-free on iPhone, iPad and Apple TV
        </div>
        <h1 className="reveal text-[3.25rem] leading-[0.98] sm:text-7xl md:text-[6.5rem] font-black tracking-[-0.045em]">
          Know what<br />to <span className="text-coral">watch.</span>
        </h1>
        <p className="reveal mt-7 text-lg md:text-2xl text-[color:var(--muted)] max-w-2xl mx-auto leading-relaxed font-medium">
          Track every movie and show. Find your next favorite.
        </p>
        <div className="reveal mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
          <AppStoreBadge />
          <button
            onClick={() => scrollToId('features')}
            className="px-6 h-[52px] rounded-full glass font-semibold hover:bg-white/10 transition-colors"
          >
            See what's inside
          </button>
        </div>

        {/* Phones */}
        <div className="reveal relative mt-16 md:mt-20 h-[460px] sm:h-[560px] md:h-[640px]">
          <Phone
            src="/img/lists.jpg"
            alt="My Lists"
            className="absolute left-1/2 top-16 w-[190px] sm:w-[230px] md:w-[260px] -translate-x-[118%] -rotate-[7deg] opacity-90 hidden sm:block"
          />
          <Phone
            src="/img/tonight.jpg"
            alt="Tonight"
            className="absolute left-1/2 top-16 w-[190px] sm:w-[230px] md:w-[260px] translate-x-[18%] rotate-[7deg] opacity-90 hidden sm:block"
          />
          <Phone
            src="/img/browse.jpg"
            alt="Browse, featuring Carrie"
            className="absolute left-1/2 top-0 w-[230px] sm:w-[270px] md:w-[300px] -translate-x-1/2 z-10"
          />
        </div>
      </div>
      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-[#07061a] to-transparent z-20" />
    </section>

    {/* Features */}
    <section id="features" className="relative py-20 md:py-32 scroll-mt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col gap-24 md:gap-36">
        {features.map((f, i) => (
          <div
            key={f.id}
            className={`flex flex-col ${i % 2 ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12 md:gap-20`}
          >
            <div className="reveal flex-1 max-w-xl text-center md:text-left">
              <div className="text-[13px] font-bold uppercase tracking-[0.18em] text-[color:var(--coral)] mb-4">{f.eyebrow}</div>
              <h2 className="text-4xl md:text-6xl font-black tracking-[-0.035em] leading-[1.02]">{f.title}</h2>
              <p className="mt-6 text-lg md:text-xl text-[color:var(--muted)] leading-relaxed">{f.body}</p>
              <ul className="mt-8 flex flex-wrap gap-2 justify-center md:justify-start">
                {f.points.map((p) => (
                  <li key={p} className="px-3.5 py-1.5 rounded-full card text-[14px] font-medium text-white/85">{p}</li>
                ))}
              </ul>
            </div>
            <div className="reveal relative flex-1 flex justify-center">
              <div className="absolute inset-0 m-auto w-[80%] h-[70%] rounded-full bg-[radial-gradient(circle,rgba(98,76,214,0.45),transparent_70%)] blur-2xl" />
              <Phone src={f.img} alt={f.alt} className="relative w-[250px] md:w-[300px]" />
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* Extras */}
    <section className="py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <h2 className="reveal text-center text-3xl md:text-5xl font-black tracking-[-0.035em] mb-12">And all the little things.</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {extras.map(({ icon: Icon, title, body }) => (
            <div key={title} className="reveal card rounded-3xl p-7">
              <div className="w-11 h-11 rounded-2xl bg-[color:var(--coral)]/15 text-[color:var(--coral)] flex items-center justify-center mb-5">
                <Icon size={22} />
              </div>
              <h3 className="text-lg font-bold mb-2">{title}</h3>
              <p className="text-[color:var(--muted)] leading-relaxed text-[15px]">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Apple TV */}
    <section id="apple-tv" className="relative py-20 md:py-32 overflow-hidden scroll-mt-24">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_60%,rgba(98,76,214,0.3),transparent_70%)]" />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 text-center">
        <div className="reveal inline-flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.18em] text-[color:var(--coral)] mb-4">
          <Tv size={16} /> Apple TV
        </div>
        <h2 className="reveal text-4xl md:text-6xl font-black tracking-[-0.035em] leading-[1.02]">
          Your cinema, on the <span className="text-coral">big screen.</span>
        </h2>
        <p className="reveal mt-6 text-lg md:text-xl text-[color:var(--muted)] max-w-2xl mx-auto leading-relaxed">
          Browse, Tonight, StreamQ and your lists, built for the couch and synced with your iPhone.
        </p>
        <div className="reveal mt-14 mx-auto max-w-5xl">
          <div className="rounded-[1.4rem] md:rounded-[2rem] p-2 md:p-3 bg-[#121024] ring-1 ring-white/10 shadow-[0_50px_120px_-30px_rgba(0,0,0,0.9)]">
            <img
              src="/img/tv-lists.jpg"
              alt="WatchGuide on Apple TV showing the watchlist"
              loading="lazy"
              width={1920}
              height={1080}
              className="block w-full h-auto rounded-[1rem] md:rounded-[1.4rem]"
            />
          </div>
          <div className="mx-auto w-[22%] h-3 md:h-4 bg-gradient-to-b from-[#1a1733] to-transparent rounded-b-xl" />
        </div>
      </div>
    </section>

    {/* Pro */}
    <section className="py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="reveal card rounded-[2rem] p-8 md:p-14 text-center relative overflow-hidden">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[radial-gradient(circle,rgba(242,134,90,0.25),transparent_70%)] blur-2xl" />
          <div className="relative">
            <div className="text-[13px] font-bold uppercase tracking-[0.18em] text-[color:var(--coral)] mb-4">WatchGuide Pro</div>
            <h2 className="text-3xl md:text-5xl font-black tracking-[-0.035em]">Unlock everything.</h2>
            <p className="mt-5 text-lg text-[color:var(--muted)] max-w-xl mx-auto leading-relaxed">
              Start free, then go Pro when you're ready. Theme packs are optional one-time purchases.
            </p>
            <div className="mt-9 grid sm:grid-cols-2 gap-4 max-w-lg mx-auto">
              <div className="rounded-2xl p-6 bg-white/[0.04] ring-1 ring-white/10">
                <div className="text-sm font-semibold text-[color:var(--muted)]">Monthly</div>
                <div className="mt-1 text-3xl font-black">$4.99</div>
                <div className="text-sm text-[color:var(--muted)]">per month</div>
              </div>
              <div className="rounded-2xl p-6 bg-[color:var(--coral)]/10 ring-1 ring-[color:var(--coral)]/40">
                <div className="text-sm font-semibold text-[color:var(--peach)]">Yearly</div>
                <div className="mt-1 text-3xl font-black">$29.99</div>
                <div className="text-sm text-[color:var(--muted)]">per year</div>
              </div>
            </div>
            <p className="mt-5 text-xs text-white/40">US prices. May vary by country.</p>
          </div>
        </div>
      </div>
    </section>

    {/* Closing CTA */}
    <section className="py-20 md:py-32 text-center">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 flex flex-col items-center">
        <AppIcon className="reveal w-24 h-24 md:w-28 md:h-28 mb-8" />
        <h2 className="reveal text-4xl md:text-6xl font-black tracking-[-0.035em] leading-[1.02]">
          Know what to watch <span className="text-coral">tonight.</span>
        </h2>
        <div className="reveal mt-9"><AppStoreBadge /></div>
      </div>
    </section>
  </>
);

const PageShell = ({ back, children }: { back: () => void; children: React.ReactNode }) => (
  <div className="bg-stage min-h-screen pt-32 md:pt-40 pb-24">
    <div className="max-w-3xl mx-auto px-4 sm:px-6">
      <button onClick={back} className="flex items-center gap-2 text-[color:var(--muted)] hover:text-white transition-colors mb-12 font-semibold">
        <ArrowLeft size={20} /> Home
      </button>
      {children}
    </div>
  </div>
);

const SupportView = ({ back }: { back: () => void }) => (
  <PageShell back={back}>
    <div className="w-16 h-16 rounded-2xl bg-[color:var(--coral)]/15 text-[color:var(--coral)] flex items-center justify-center mb-8">
      <Mail size={30} />
    </div>
    <h1 className="text-5xl md:text-6xl font-black tracking-[-0.04em]">How can we help?</h1>
    <p className="mt-6 text-xl text-[color:var(--muted)] leading-relaxed">
      Found a bug or have a feature request? Send an email and we'll get back to you within 24 hours.
    </p>
    <a
      href={`mailto:${SUPPORT_EMAIL}`}
      className="mt-10 card rounded-3xl px-5 py-6 sm:p-6 md:p-8 flex items-center justify-between gap-3 sm:gap-4 group hover:bg-white/[0.06] transition-colors"
    >
      <span className="whitespace-nowrap text-[min(4.8vw,1.875rem)] font-bold text-coral">{SUPPORT_EMAIL}</span>
      <ArrowUpRight className="hidden sm:block shrink-0 text-[color:var(--muted)] group-hover:text-white transition-colors" />
    </a>
    <div className="mt-6 card rounded-3xl p-6 md:p-8">
      <h2 className="text-lg font-bold mb-2">Subscriptions</h2>
      <p className="text-[color:var(--muted)] leading-relaxed">
        WatchGuide Pro is billed through your Apple Account. To manage or cancel it, open Settings on your iPhone, tap your name, then Subscriptions.
      </p>
    </div>
  </PageShell>
);

const PrivacyView = ({ back }: { back: () => void }) => (
  <PageShell back={back}>
    <div className="w-16 h-16 rounded-2xl bg-emerald-400/15 text-emerald-400 flex items-center justify-center mb-8">
      <ShieldCheck size={30} />
    </div>
    <h1 className="text-5xl md:text-6xl font-black tracking-[-0.04em]">Privacy Policy</h1>
    <div className="mt-10 card rounded-3xl p-7 md:p-10 space-y-7 text-lg text-[color:var(--muted)] leading-relaxed">
      <p className="text-white text-2xl font-bold leading-snug border-l-4 border-[color:var(--coral)] pl-5">
        We never send your personal data to advertisers or third parties. Period.
      </p>
      <p>
        At WatchGuide, your entertainment history is considered strictly personal. All your tracking data, watchlists and preferences are used solely to improve your own experience in the app.
      </p>
      <p>
        We do not sell, rent or trade your data with advertising networks or external data brokers.
      </p>
      <p>
        Questions about your privacy? Email <a className="whitespace-nowrap text-[min(4.8vw,1em)] text-white underline decoration-[color:var(--coral)] underline-offset-4" href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
      </p>
    </div>
  </PageShell>
);

const Footer = ({ navigate }: { navigate: (p: Page, anchor?: string) => void }) => (
  <footer className="border-t border-white/[0.06] py-14">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-8">
      <button onClick={() => navigate('/')} className="flex items-center gap-3">
        <AppIcon className="w-9 h-9" />
        <span className="text-lg font-extrabold tracking-tight">WatchGuide</span>
      </button>
      <nav className="flex flex-wrap justify-center gap-x-7 gap-y-3 text-[15px] font-medium text-[color:var(--muted)]">
        <button onClick={() => navigate('/', 'features')} className="hover:text-white transition-colors">Features</button>
        <button onClick={() => navigate('/', 'apple-tv')} className="hover:text-white transition-colors">Apple TV</button>
        <button onClick={() => navigate('/privacy')} className="hover:text-white transition-colors">Privacy</button>
        <button onClick={() => navigate('/support')} className="hover:text-white transition-colors">Support</button>
        <a href="https://www.apple.com/legal/internet-services/itunes/dev/stdeula/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Terms</a>
      </nav>
      <p className="text-[13px] text-white/40 flex items-center gap-1.5">
        © 2026 Jason Smith. Made with <Heart size={12} className="fill-current" /> for movie lovers.
      </p>
    </div>
  </footer>
);

const App = () => {
  const [page, setPage] = useState<Page>(routeFromHash);

  useEffect(() => {
    const onHash = () => setPage(routeFromHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useReveal([page]);

  const navigate = (p: Page, anchor?: string) => {
    if (p === page && anchor) {
      scrollToId(anchor);
      return;
    }
    if (p === '/') {
      history.pushState(null, '', window.location.pathname);
    } else {
      window.location.hash = p;
    }
    setPage(p);
    if (anchor) {
      setTimeout(() => scrollToId(anchor), 50);
    } else {
      window.scrollTo({ top: 0 });
    }
  };

  return (
    <div className="min-h-screen">
      <Header page={page} navigate={navigate} />
      <main>
        {page === '/' && <HomeView />}
        {page === '/support' && <SupportView back={() => navigate('/')} />}
        {page === '/privacy' && <PrivacyView back={() => navigate('/')} />}
      </main>
      <Footer navigate={navigate} />
    </div>
  );
};

createRoot(document.getElementById('root')!).render(<App />);
