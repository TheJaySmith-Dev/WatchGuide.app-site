import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowLeft,
  ArrowLeftRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Ban,
  BarChart3,
  Check,
  Film,
  FolderOpen,
  Globe,
  Heart,
  LayoutGrid,
  Link2,
  Mail,
  MapPin,
  MessagesSquare,
  Minus,
  Menu,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';

const APP_STORE_URL = 'https://apps.apple.com/us/app/watchguide-app/id6758427085';
const SUPPORT_EMAIL = 'watchguide@jasonforreels.com';

type Page = '/' | '/support' | '/privacy' | '/terms' | '/refunds';

// Clean paths (/terms, /privacy, /refunds, /support) are canonical. Old hash links
// (#/privacy, #/privacy-policy, ...) still resolve and are rewritten to the clean path.
const routeFromHash = (): Page => {
  const hash = window.location.hash.replace('#', '') || window.location.pathname.replace(/\/+$/, '');
  if (hash === '/support') return '/support';
  if (hash === '/privacy' || hash === '/privacy-policy') return '/privacy';
  if (hash === '/terms') return '/terms';
  if (hash === '/refunds' || hash === '/refund-policy') return '/refunds';
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
    { label: 'iPad', action: () => go('/', 'ipad'), active: false },
    { label: 'Apple TV', action: () => go('/', 'apple-tv'), active: false },
    { label: 'Privacy', action: () => go('/privacy'), active: page === '/privacy' },
    { label: 'Support', action: () => go('/support'), active: page === '/support' },
  ];

  return (
    <header className="fixed top-3 md:top-5 inset-x-0 z-50 px-4 flex justify-center pointer-events-none">
      <div className="pointer-events-auto w-full max-w-[48rem]">
        <nav className="glass rounded-full pl-2 pr-2 py-2 flex items-center justify-between gap-2 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.7)]">
          <button onClick={() => go('/')} className="flex items-center gap-2.5 pl-1 pr-2 py-0.5 rounded-full" aria-label="WatchGuide home">
            <AppIcon className="w-9 h-9" />
            <span className="text-[17px] font-extrabold tracking-tight">WatchGuide</span>
          </button>

          <div className="hidden md:flex items-center gap-0.5 lg:gap-1 whitespace-nowrap text-[14px] font-semibold text-[color:var(--muted)]">
            {links.map((l) => (
              <button
                key={l.label}
                onClick={l.action}
                className={`px-3 lg:px-3.5 py-2 rounded-full transition-colors hover:text-white hover:bg-white/5 ${l.active ? 'text-white bg-white/10' : ''}`}
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
              className="whitespace-nowrap px-4 py-2 rounded-full text-[14px] font-bold text-[#2a1206] bg-gradient-to-b from-[#ffb07a] to-[#f2865a] hover:brightness-110 transition shadow-[0_6px_20px_-6px_rgba(242,134,90,0.8)]"
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

type Mark = { v: 'yes' | 'no' | 'partial'; note?: string };

// Competitor facts come from each app's US App Store listing and website (October 2026).
const comparison: { feature: string; wg: Mark; letterboxd: Mark; justwatch: Mark; trakt: Mark }[] = [
  {
    feature: 'Movies and TV shows',
    wg: { v: 'yes' },
    letterboxd: { v: 'partial', note: 'Films only' },
    justwatch: { v: 'yes' },
    trakt: { v: 'yes' },
  },
  {
    feature: 'No third-party ads, for free',
    wg: { v: 'yes' },
    letterboxd: { v: 'no', note: 'Ads unless Pro' },
    justwatch: { v: 'no', note: 'Has ads' },
    trakt: { v: 'no', note: 'Ads unless VIP' },
  },
  {
    feature: 'Show only your streaming services',
    wg: { v: 'yes' },
    letterboxd: { v: 'partial', note: 'Pro only' },
    justwatch: { v: 'yes' },
    trakt: { v: 'partial', note: 'Sorts, not filters' },
  },
  {
    feature: 'IMDb, Rotten Tomatoes and Metacritic together',
    wg: { v: 'yes' },
    letterboxd: { v: 'no' },
    justwatch: { v: 'partial', note: 'No Metacritic' },
    trakt: { v: 'no' },
  },
  {
    feature: 'Theme packs that restyle the app',
    wg: { v: 'yes' },
    letterboxd: { v: 'no' },
    justwatch: { v: 'no' },
    trakt: { v: 'no' },
  },
  {
    feature: 'Apple TV app',
    wg: { v: 'yes' },
    letterboxd: { v: 'yes' },
    justwatch: { v: 'yes' },
    trakt: { v: 'yes' },
  },
];

const MarkCell = ({ mark, highlight = false }: { mark: Mark; highlight?: boolean }) => {
  const label = mark.v === 'yes' ? 'Yes' : mark.v === 'no' ? 'No' : 'Partly';
  return (
    <td className={`px-0.5 sm:px-4 py-4 text-center align-middle ${highlight ? 'bg-[rgba(242,134,90,0.07)]' : ''}`}>
      <div className="flex flex-col items-center gap-1">
        {mark.v === 'yes' && (
          <span className={`w-7 h-7 rounded-full flex items-center justify-center ${highlight ? 'bg-[color:var(--coral)] text-[#2a1206]' : 'bg-white/10 text-white'}`}>
            <Check size={16} strokeWidth={3} aria-label={label} />
          </span>
        )}
        {mark.v === 'partial' && (
          <span className="w-7 h-7 rounded-full flex items-center justify-center bg-white/[0.06] text-white/60">
            <Minus size={16} strokeWidth={3} aria-label={label} />
          </span>
        )}
        {mark.v === 'no' && (
          <span className="w-7 h-7 rounded-full flex items-center justify-center text-white/30">
            <X size={16} strokeWidth={2.5} aria-label={label} />
          </span>
        )}
        {mark.note && <span className="text-[10px] sm:text-xs leading-tight text-[color:var(--muted)]">{mark.note}</span>}
      </div>
    </td>
  );
};

const ComparisonSection = () => (
  <section id="compare" className="py-20 md:py-28 scroll-mt-24">
    <div className="max-w-5xl mx-auto px-3 sm:px-6">
      <div className="text-center px-1">
        <div className="reveal text-[13px] font-bold uppercase tracking-[0.18em] text-[color:var(--coral)] mb-4">Compare</div>
        <h2 className="reveal text-4xl md:text-6xl font-black tracking-[-0.035em] leading-[1.02]">
          Everything in <span className="text-coral">one place.</span>
        </h2>
        <p className="reveal mt-6 text-lg md:text-xl text-[color:var(--muted)] max-w-2xl mx-auto leading-relaxed">
          Other apps do one part well. WatchGuide brings tracking, ratings and streaming together, without the ads.
        </p>
      </div>
      <div className="reveal mt-12 card rounded-[1.75rem] overflow-hidden">
        <table className="w-full table-fixed text-left">
          <caption className="sr-only">WatchGuide compared with Letterboxd, JustWatch and Trakt</caption>
          <colgroup>
            <col />
            <col className="w-[18%] sm:w-[16%]" />
            <col className="w-[16%] sm:w-[15%]" />
            <col className="w-[16%] sm:w-[15%]" />
            <col className="w-[16%] sm:w-[15%]" />
          </colgroup>
          <thead>
            <tr className="border-b border-white/[0.07]">
              <th scope="col" className="px-4 sm:px-6 py-5 text-[13px] font-semibold text-[color:var(--muted)]">
                <span className="sr-only">Feature</span>
              </th>
              <th scope="col" className="px-1.5 sm:px-4 py-5 bg-[rgba(242,134,90,0.07)]">
                <div className="flex flex-col items-center gap-2">
                  <AppIcon className="w-8 h-8 sm:w-10 sm:h-10" />
                  <span className="text-[11px] sm:text-sm font-bold">WatchGuide</span>
                </div>
              </th>
              <th scope="col" className="px-1.5 sm:px-4 py-5 text-[11px] sm:text-sm font-semibold text-center text-white/80 hyphens-manual break-words">Letter&shy;boxd</th>
              <th scope="col" className="px-1.5 sm:px-4 py-5 text-[11px] sm:text-sm font-semibold text-center text-white/80 hyphens-manual break-words">Just&shy;Watch</th>
              <th scope="col" className="px-1.5 sm:px-4 py-5 text-[11px] sm:text-sm font-semibold text-center text-white/80">Trakt</th>
            </tr>
          </thead>
          <tbody>
            {comparison.map((row) => (
              <tr key={row.feature} className="border-b border-white/[0.05] last:border-0">
                <th scope="row" className="pl-3.5 pr-1 sm:px-6 py-4 text-[13px] sm:text-[16px] font-semibold leading-snug">{row.feature}</th>
                <MarkCell mark={row.wg} highlight />
                <MarkCell mark={row.letterboxd} />
                <MarkCell mark={row.justwatch} />
                <MarkCell mark={row.trakt} />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="reveal mt-6 card rounded-[1.5rem] px-5 py-5 sm:px-7 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
        <div className="shrink-0 w-11 h-11 rounded-2xl bg-[rgba(242,134,90,0.15)] text-[color:var(--coral)] flex items-center justify-center">
          <ArrowLeftRight size={22} />
        </div>
        <div>
          <h3 className="text-lg font-bold">Works with Trakt and Simkl</h3>
          <p className="mt-1 text-[15px] text-[color:var(--muted)] leading-relaxed">
            Already tracking somewhere else? Connect your account to bring your history over and keep your lists in sync.
          </p>
        </div>
      </div>
      <p className="reveal mt-5 text-center text-xs text-white/40 leading-relaxed max-w-2xl mx-auto">
        Based on each app's US App Store listing and website as of October 2026. Letterboxd, JustWatch and Trakt are trademarks of their respective owners and are not affiliated with WatchGuide.
      </p>
    </div>
  </section>
);

const ipadShots = [
  { src: '/img/ipad-browse.jpg', label: 'Browse', alt: 'Browse on iPad, featuring Carrie' },
  { src: '/img/ipad-tonight.jpg', label: 'Tonight', alt: 'Tonight on iPad suggesting Avatar: Fire and Ash' },
  { src: '/img/ipad-detail.jpg', label: 'Every rating', alt: 'The Dune: Part Two detail page on iPad' },
  { src: '/img/ipad-streamq.jpg', label: 'StreamQ', alt: 'StreamQ on iPad with Leaving Soon' },
  { src: '/img/ipad-lists.jpg', label: 'Your lists', alt: 'My Lists on iPad' },
  { src: '/img/ipad-themes.jpg', label: 'Themes', alt: 'Themes on iPad with Creature Feature selected' },
];

const IPad = ({ src, alt }: { src: string; alt: string }) => (
  <div className="phone rounded-[1.6rem] md:rounded-[2rem] p-[7px] md:p-[9px]">
    <img
      src={src}
      alt={alt}
      loading="lazy"
      width={1400}
      height={1867}
      className="block w-full h-auto rounded-[1.2rem] md:rounded-[1.5rem]"
    />
  </div>
);

// Mirrors the benefit list on the in-app paywall (WGUnlimitedPaywallView.swift).
const proBenefits = [
  { icon: MessagesSquare, title: 'Ask Atlas anything', body: 'Unlimited questions about any film or show.' },
  { icon: Film, title: 'Post-credits checks', body: 'Know before you leave your seat.' },
  { icon: MapPin, title: 'Cinema trip planning', body: 'Live traffic tells you when to leave.' },
  { icon: FolderOpen, title: 'Unlimited lists', body: 'Organize everything, no cap.' },
  { icon: Sparkles, title: 'AI playlists & share cards', body: 'Curated picks worth sharing.' },
  { icon: BarChart3, title: 'Stats & insights', body: 'Your watching, properly measured.' },
  { icon: Link2, title: 'Instant deep links', body: 'Jump straight into the right app.' },
];

const IPadGallery = () => {
  const track = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  const update = () => {
    const el = track.current;
    if (!el) return;
    setEdges({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth > el.scrollWidth - 8 });
  };

  useEffect(() => {
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const step = (dir: 1 | -1) => {
    const el = track.current;
    const card = el?.querySelector('figure');
    if (!el || !card) return;
    el.scrollBy({ left: dir * (card.getBoundingClientRect().width + 32), behavior: 'smooth' });
  };

  const arrow = 'w-11 h-11 rounded-full glass flex items-center justify-center transition-opacity hover:bg-white/10 disabled:opacity-30 disabled:cursor-default';

  return (
    <div className="reveal mt-14">
      <div
        ref={track}
        onScroll={update}
        className="flex gap-5 md:gap-8 overflow-x-auto snap-x snap-mandatory no-scrollbar px-[max(1rem,calc((100vw-72rem)/2+1.5rem))] pb-6"
      >
        {ipadShots.map((shot) => (
          <figure key={shot.src} className="snap-center shrink-0 w-[72vw] sm:w-[380px] md:w-[420px]">
            <IPad src={shot.src} alt={shot.alt} />
            <figcaption className="mt-4 text-center text-[15px] font-semibold text-[color:var(--muted)]">{shot.label}</figcaption>
          </figure>
        ))}
      </div>
      <div className="hidden md:flex justify-center gap-3 mt-4">
        <button className={arrow} onClick={() => step(-1)} disabled={edges.start} aria-label="Previous iPad screenshot">
          <ChevronLeft size={20} />
        </button>
        <button className={arrow} onClick={() => step(1)} disabled={edges.end} aria-label="Next iPad screenshot">
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

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
              <div className="w-11 h-11 rounded-2xl bg-[rgba(242,134,90,0.15)] text-[color:var(--coral)] flex items-center justify-center mb-5">
                <Icon size={22} />
              </div>
              <h3 className="text-lg font-bold mb-2">{title}</h3>
              <p className="text-[color:var(--muted)] leading-relaxed text-[15px]">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <ComparisonSection />

    {/* iPad */}
    <section id="ipad" className="relative py-20 md:py-32 overflow-hidden scroll-mt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
        <div className="reveal text-[13px] font-bold uppercase tracking-[0.18em] text-[color:var(--coral)] mb-4">iPad</div>
        <h2 className="reveal text-4xl md:text-6xl font-black tracking-[-0.035em] leading-[1.02]">
          Room for <span className="text-coral">every poster.</span>
        </h2>
        <p className="reveal mt-6 text-lg md:text-xl text-[color:var(--muted)] max-w-2xl mx-auto leading-relaxed">
          The whole app, laid out for the bigger screen. Same lists, same picks, wherever you are.
        </p>
      </div>
      <IPadGallery />
    </section>

    {/* Apple TV */}
    <section id="apple-tv" className="relative py-20 md:py-32 overflow-hidden scroll-mt-24">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_60%,rgba(98,76,214,0.3),transparent_70%)]" />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 text-center">
        <img
          src="/img/apple-tv.png"
          alt="Apple TV"
          width={256}
          height={256}
          className="reveal mx-auto mb-7 w-16 h-16 md:w-20 md:h-20 rounded-[22%] ring-1 ring-white/15 shadow-[0_12px_40px_-8px_rgba(0,0,0,0.8)]"
        />
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
    <section id="pro" className="py-16 md:py-24 scroll-mt-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="reveal card rounded-[2rem] p-6 sm:p-8 md:p-14 relative overflow-hidden">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[340px] bg-[radial-gradient(circle,rgba(242,134,90,0.25),transparent_70%)] blur-2xl" />
          <div className="relative">
            <div className="text-center">
              <div className="text-[13px] font-bold uppercase tracking-[0.18em] text-[color:var(--coral)] mb-4">WatchGuide Pro</div>
              <h2 className="text-3xl md:text-5xl font-black tracking-[-0.035em]">Never wonder <span className="text-coral">what's next.</span></h2>
              <p className="mt-5 text-lg text-[color:var(--muted)] max-w-xl mx-auto leading-relaxed">
                Ask Atlas anything, plan every cinema trip, and see your watching like never before.
              </p>
            </div>

            <ul className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 text-left">
              {proBenefits.map(({ icon: Icon, title, body }, i) => (
                <li
                  key={title}
                  className={`rounded-2xl p-5 ring-1 flex gap-4 ${i === 0 ? 'sm:col-span-2 lg:col-span-1 lg:row-span-3 lg:flex-col lg:justify-center lg:p-8 bg-[rgba(242,134,90,0.08)] ring-[rgba(242,134,90,0.3)]' : 'bg-white/[0.04] ring-white/[0.08]'}`}
                >
                  <div className={`shrink-0 rounded-xl flex items-center justify-center bg-[rgba(242,134,90,0.15)] text-[color:var(--coral)] ${i === 0 ? 'w-12 h-12' : 'w-10 h-10'}`}>
                    <Icon size={i === 0 ? 24 : 20} />
                  </div>
                  <div>
                    <h3 className={`font-bold ${i === 0 ? 'text-xl' : 'text-[16px]'}`}>{title}</h3>
                    <p className="mt-1 text-[15px] text-[color:var(--muted)] leading-relaxed">{body}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-10 grid grid-cols-2 gap-3 md:gap-4 max-w-lg mx-auto text-center">
              <div className="rounded-2xl p-5 md:p-6 bg-white/[0.04] ring-1 ring-white/10">
                <div className="text-sm font-semibold text-[color:var(--muted)]">Monthly</div>
                <div className="mt-1 text-2xl md:text-3xl font-black">$4.99</div>
                <div className="text-sm text-[color:var(--muted)]">per month</div>
              </div>
              <div className="rounded-2xl p-5 md:p-6 bg-[rgba(242,134,90,0.1)] ring-1 ring-[rgba(242,134,90,0.4)]">
                <div className="text-sm font-semibold text-[color:var(--peach)]">Yearly</div>
                <div className="mt-1 text-2xl md:text-3xl font-black">$29.99</div>
                <div className="text-sm text-[color:var(--muted)]">per year</div>
              </div>
            </div>
            <p className="mt-5 text-center text-xs text-white/40">US prices. May vary by country. Theme packs are optional one-time purchases.</p>
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
    <div className="w-16 h-16 rounded-2xl bg-[rgba(242,134,90,0.15)] text-[color:var(--coral)] flex items-center justify-center mb-8">
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
        If you create an account or turn on sync, your lists, ratings, watch history and settings are stored with our backend provider (Supabase) so they follow you between devices, and are used only to provide that sync. Web subscriptions are processed by Paddle (merchant of record) and entitlements are managed by RevenueCat; they receive only the data needed to take payment and unlock Pro, and we never see your full card details. Title and artwork data comes from TMDB and streaming-availability providers; searches you make may be sent to them to return results.
      </p>
      <p>
        You can ask us to delete your data at any time by email.
      </p>
      <p>
        Questions about your privacy? Email <a className="whitespace-nowrap text-[min(4.8vw,1em)] text-white underline decoration-[color:var(--coral)] underline-offset-4" href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
      </p>
    </div>
  </PageShell>
);

const mail = (
  <a className="whitespace-nowrap text-[min(4.8vw,1em)] text-white underline decoration-[color:var(--coral)] underline-offset-4" href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
);

const LegalSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="space-y-3">
    <h2 className="text-white text-xl font-bold">{title}</h2>
    {children}
  </section>
);

const TermsView = ({ back }: { back: () => void }) => (
  <PageShell back={back}>
    <h1 className="text-5xl md:text-6xl font-black tracking-[-0.04em]">Terms of Service</h1>
    <p className="mt-4 text-[color:var(--muted)]">Last updated: October 2026</p>
    <div className="mt-10 card rounded-3xl p-7 md:p-10 space-y-8 text-lg text-[color:var(--muted)] leading-relaxed">
      <LegalSection title="Who we are">
        <p>WatchGuide is operated by Jason Smith (&ldquo;we&rdquo;, &ldquo;us&rdquo;). These terms cover the WatchGuide apps for iPhone, iPad, Apple TV and the web at app.watchguide.app. By using WatchGuide you agree to them.</p>
      </LegalSection>
      <LegalSection title="Using WatchGuide">
        <p>WatchGuide helps you track movies and TV shows and find where to watch them. You must follow applicable law and not misuse, scrape, or attempt to disrupt the service. Title information is provided by third-party sources and may be incomplete or change; we do not guarantee that a title is available on any streaming service.</p>
      </LegalSection>
      <LegalSection title="WatchGuide Pro">
        <p>WatchGuide Pro is an optional paid subscription that unlocks extra features. Subscriptions bought in the iOS app are billed by Apple and managed in your Apple Account. Subscriptions bought on the web are processed by our payment provider Paddle, which is the merchant of record and handles payment, tax and invoices.</p>
        <p>Subscriptions renew automatically at the end of each billing period (monthly or annual) until cancelled. You can cancel at any time and keep access until the end of the period you paid for. Prices are shown before you pay and may change with notice before your next renewal. See our <a className="text-white underline decoration-[color:var(--coral)] underline-offset-4" href="/refunds">Refund Policy</a>.</p>
      </LegalSection>
      <LegalSection title="Your content and data">
        <p>Your lists, ratings and watch history belong to you. How we handle your data is described in the <a className="text-white underline decoration-[color:var(--coral)] underline-offset-4" href="/privacy">Privacy Policy</a>.</p>
      </LegalSection>
      <LegalSection title="Third-party services">
        <p>WatchGuide uses data from third parties such as TMDB and streaming-availability providers. Their names and logos belong to their owners. This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
      </LegalSection>
      <LegalSection title="Disclaimer and liability">
        <p>WatchGuide is provided &ldquo;as is&rdquo; without warranties of any kind. To the extent permitted by law, we are not liable for indirect or consequential losses, and our total liability for any claim is limited to the amount you paid us in the 12 months before the claim.</p>
      </LegalSection>
      <LegalSection title="Changes and contact">
        <p>We may update these terms; continued use after a change means you accept it. Questions? Email {mail}.</p>
      </LegalSection>
    </div>
  </PageShell>
);

const RefundsView = ({ back }: { back: () => void }) => (
  <PageShell back={back}>
    <h1 className="text-5xl md:text-6xl font-black tracking-[-0.04em]">Refund Policy</h1>
    <p className="mt-4 text-[color:var(--muted)]">Last updated: October 2026</p>
    <div className="mt-10 card rounded-3xl p-7 md:p-10 space-y-8 text-lg text-[color:var(--muted)] leading-relaxed">
      <LegalSection title="Web purchases (Paddle)">
        <p>If you bought WatchGuide Pro on the web, you can request a full refund within 14 days of your purchase or renewal, no questions asked. Email {mail} with the email address used at checkout, or request it through Paddle using the link in your receipt.</p>
        <p>After 14 days, payments are generally non-refundable, but you can cancel at any time and keep access until the end of the paid period.</p>
      </LegalSection>
      <LegalSection title="App Store purchases (Apple)">
        <p>Purchases made in the iOS app are handled by Apple, and refunds are decided by Apple. Request one at reportaproblem.apple.com.</p>
      </LegalSection>
      <LegalSection title="Cancelling">
        <p>Web subscriptions: use the cancellation link in your Paddle receipt email, or email us and we will cancel it for you. App Store subscriptions: Settings &rarr; your name &rarr; Subscriptions on your iPhone. Cancelling stops future renewals.</p>
      </LegalSection>
      <LegalSection title="Statutory rights">
        <p>Nothing here limits any refund or withdrawal rights you have under the consumer law where you live.</p>
      </LegalSection>
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
        <button onClick={() => navigate('/', 'ipad')} className="hover:text-white transition-colors">iPad</button>
        <button onClick={() => navigate('/', 'apple-tv')} className="hover:text-white transition-colors">Apple TV</button>
        <button onClick={() => navigate('/privacy')} className="hover:text-white transition-colors">Privacy</button>
        <button onClick={() => navigate('/terms')} className="hover:text-white transition-colors">Terms</button>
        <button onClick={() => navigate('/refunds')} className="hover:text-white transition-colors">Refunds</button>
        <button onClick={() => navigate('/support')} className="hover:text-white transition-colors">Support</button>
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
    // Turn a legacy #/route into its clean path without adding a history entry.
    const normalize = () => {
      const next = routeFromHash();
      if (window.location.hash && next !== '/') history.replaceState(null, '', next);
      setPage(next);
    };
    normalize();
    window.addEventListener('hashchange', normalize);
    window.addEventListener('popstate', normalize);
    return () => {
      window.removeEventListener('hashchange', normalize);
      window.removeEventListener('popstate', normalize);
    };
  }, []);

  useReveal([page]);

  const navigate = (p: Page, anchor?: string) => {
    if (p === page && anchor) {
      scrollToId(anchor);
      return;
    }
    history.pushState(null, '', p);
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
        {page === '/terms' && <TermsView back={() => navigate('/')} />}
        {page === '/refunds' && <RefundsView back={() => navigate('/')} />}
      </main>
      <Footer navigate={navigate} />
    </div>
  );
};

createRoot(document.getElementById('root')!).render(<App />);
