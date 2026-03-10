import type { GeneratedVariant, DesignTokens } from './store'
import { generateId } from './store'

type RequestType = 'component' | 'section' | 'page'
type VariantStyle = 'editorial' | 'action' | 'minimalist'

// Light mode defaults
const defaultColors = {
  background: '#ffffff',
  foreground: '#0a0a0a',
  muted: '#737373',
  card: '#f5f5f5',
  border: '#e5e5e5',
  primary: '#0a0a0a',
  'primary-foreground': '#ffffff',
  input: '#f5f5f5',
}

const getColor = (tokens: DesignTokens, key: string): string => {
  return tokens.colors?.[key] || defaultColors[key as keyof typeof defaultColors] || '#0a0a0a'
}

// Random utilities
const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]
const shuffle = <T>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5)
const randomBetween = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min
const maybe = (probability: number = 0.5): boolean => Math.random() < probability

// Extensive content pools (for true variety)
const headlines = {
  hero: [
    "Transform Your Vision Into Reality",
    "The Future of Digital Excellence",
    "Where Innovation Meets Design",
    "Elevate Your Digital Presence",
    "Built for Tomorrow",
    "Redefining What's Possible",
    "Your Success, Amplified",
    "Beyond Boundaries",
    "Crafting Digital Experiences",
    "The Art of Innovation",
    "Unlock Your Potential",
    "Design Without Limits",
    "Shaping the Future",
    "Excellence Delivered",
    "Where Ideas Come Alive",
  ],
  features: [
    "Powerful Features", "Why Choose Us", "Our Capabilities", "What We Offer",
    "Built Different", "Everything You Need", "The Complete Solution", "Core Features",
  ],
  pricing: [
    "Simple, Transparent Pricing", "Choose Your Plan", "Pricing That Scales",
    "Start Free, Grow Fast", "Fair Pricing", "Plans for Everyone",
  ],
  testimonials: [
    "Trusted by Thousands", "What Our Clients Say", "Success Stories",
    "Real Results", "Customer Love", "Voices of Success",
  ],
  contact: [
    "Let's Talk", "Get in Touch", "Start a Conversation", "Reach Out",
    "We'd Love to Hear From You", "Contact Us", "Say Hello",
  ],
  cta: [
    "Ready to Get Started?", "Join Us Today", "Start Your Journey",
    "Take the Next Step", "Let's Build Together", "Begin Now",
  ],
  faq: [
    "Frequently Asked Questions", "Common Questions", "Got Questions?",
    "We Have Answers", "FAQ", "Need Help?",
  ],
}

const subheadlines = [
  "Join thousands of satisfied customers transforming their business.",
  "Experience the difference with our cutting-edge solutions.",
  "Built by experts, designed for everyone.",
  "Simple, powerful, and effective - just the way it should be.",
  "Your success is our mission. Let's achieve it together.",
  "The smart choice for modern teams and forward-thinking businesses.",
  "Trusted by industry leaders worldwide.",
  "Where quality meets efficiency, every single time.",
  "Streamline your workflow and boost productivity today.",
  "The future is here. Are you ready?",
]

const ctaPrimary = ['Get Started', 'Start Free Trial', 'Try Now', 'Join Now', 'Sign Up Free', 'Start Building', 'Get Access', 'Launch Now']
const ctaSecondary = ['Learn More', 'Watch Demo', 'View Pricing', 'Book a Demo', 'Contact Sales', 'See How It Works', 'Explore Features']

const featureTitles = [
  'Lightning Fast Performance', 'Enterprise Security', 'Seamless Integrations', 'Real-time Analytics',
  'Team Collaboration', 'Smart Automation', 'Custom Workflows', 'Infinite Scalability',
  'AI-Powered Insights', '24/7 Global Support', 'Advanced Reporting', 'Cloud Native',
  'One-Click Deploy', 'Version Control', 'API First Design', 'Mobile Optimized',
  'Data Privacy', 'White Label', 'Multi-language', 'Offline Mode',
]

const featureDescriptions = [
  'Blazing fast performance that scales with your growing needs.',
  'Enterprise-grade security with end-to-end encryption built in.',
  'Connect seamlessly with your favorite tools in just minutes.',
  'Stay synchronized across all your devices in real-time.',
  'Deep insights powered by machine learning to drive decisions.',
  'Work together seamlessly with your entire distributed team.',
  'Build custom processes that match exactly how you work.',
  'Automatically handles growth without any configuration needed.',
]

const testimonialQuotes = [
  "This completely transformed how we operate. Can't imagine going back.",
  "The best investment we made for our business this year, hands down.",
  "Our productivity doubled since switching. Incredible product.",
  "Finally, a solution that actually delivers on all its promises.",
  "Game-changer for our team. Worth every single penny.",
  "Simple yet powerful. Exactly what we needed all along.",
  "Exceeded every expectation we had. Truly remarkable.",
  "We've tried many solutions. This one actually works.",
]

const names = ['Sarah Chen', 'Michael Torres', 'Emily Watson', 'David Kim', 'Jessica Lee', 'Alex Johnson', 'Maria Garcia', 'James Wilson', 'Sophia Brown', 'Oliver Davis']
const roles = ['CEO', 'Founder', 'Head of Product', 'CTO', 'VP Engineering', 'Director of Design', 'Lead Developer', 'Team Lead', 'Product Manager', 'COO']
const companies = ['Acme Inc', 'TechCorp', 'Innovate Co', 'Future Labs', 'NextGen', 'Scale Up', 'Growth Hub', 'Digital First', 'Momentum', 'Velocity']

const navLinks = ['Features', 'Pricing', 'About', 'Blog', 'Docs', 'Contact', 'Careers', 'Resources', 'Solutions', 'Enterprise']
const footerCols = [
  { title: 'Product', links: ['Features', 'Pricing', 'Integrations', 'Changelog', 'Roadmap'] },
  { title: 'Company', links: ['About', 'Careers', 'Blog', 'Press', 'Partners'] },
  { title: 'Resources', links: ['Documentation', 'Help Center', 'API Reference', 'Community', 'Status'] },
  { title: 'Legal', links: ['Privacy', 'Terms', 'Security', 'Cookies', 'Licenses'] },
]

const badges = ['New', 'Beta', 'Popular', '2025', 'Pro', 'Featured', 'Hot', 'Trending']

// ==================== HERO SECTION ====================
function generateHero(tokens: DesignTokens, style: VariantStyle, prompt: string): string {
  const headline = prompt || pick(headlines.hero)
  const sub = pick(subheadlines)
  const cta1 = pick(ctaPrimary)
  const cta2 = pick(ctaSecondary)
  const badge = pick(badges)
  const showBadge = maybe(0.6)
  const showStats = maybe(0.4)

  const stats = shuffle([
    ['10K+', 'Active Users'], ['99.9%', 'Uptime'], ['24/7', 'Support'],
    ['50M+', 'API Calls'], ['150+', 'Countries'], ['4.9/5', 'Rating'],
  ]).slice(0, 3)

  if (style === 'editorial') {
    const layouts = [
      // 1. Dramatic centered
      () => `<section class="min-h-[90vh] flex items-center justify-center px-6" style="background: ${getColor(tokens, 'background')}">
        <div class="max-w-5xl text-center">
          ${showBadge ? `<span class="inline-block mb-8 text-xs tracking-[0.4em] uppercase px-5 py-2" style="color: ${getColor(tokens, 'muted')}; border: 1px solid ${getColor(tokens, 'border')}">${badge}</span>` : ''}
          <h1 class="text-5xl md:text-7xl lg:text-[5.5rem] font-extralight tracking-tight leading-[0.95] mb-10" style="color: ${getColor(tokens, 'foreground')}">${headline}</h1>
          <p class="text-xl md:text-2xl font-light max-w-2xl mx-auto mb-14" style="color: ${getColor(tokens, 'muted')}">${sub}</p>
          <div class="flex justify-center gap-6">
            <button class="px-12 py-4 text-sm tracking-[0.2em] uppercase transition-all hover:bg-black/5" style="border: 1px solid ${getColor(tokens, 'border')}; color: ${getColor(tokens, 'foreground')}">${cta1}</button>
          </div>
        </div>
      </section>`,
      // 2. Split layout with vertical text
      () => `<section class="min-h-screen grid lg:grid-cols-2" style="background: ${getColor(tokens, 'background')}">
        <div class="flex items-center px-8 lg:px-20 py-20">
          <div>
            <p class="text-sm tracking-[0.3em] uppercase mb-10" style="color: ${getColor(tokens, 'muted')}">Welcome</p>
            <h1 class="text-4xl md:text-6xl lg:text-7xl font-extralight leading-[1.05] mb-10" style="color: ${getColor(tokens, 'foreground')}">${headline}</h1>
            <div class="h-px w-20 mb-10" style="background: ${getColor(tokens, 'border')}"></div>
            <p class="text-lg leading-relaxed mb-12 max-w-md" style="color: ${getColor(tokens, 'muted')}">${sub}</p>
            <a href="#" class="inline-flex items-center gap-4 text-sm tracking-[0.15em] uppercase" style="color: ${getColor(tokens, 'foreground')}">${cta1} <span class="text-xl">→</span></a>
          </div>
        </div>
        <div class="relative hidden lg:block" style="background: ${getColor(tokens, 'card')}">
          <div class="absolute right-12 top-1/2 -translate-y-1/2 writing-mode-vertical text-xs tracking-[0.4em] uppercase" style="color: ${getColor(tokens, 'muted')}; writing-mode: vertical-rl">Scroll to Explore</div>
        </div>
      </section>`,
      // 3. Asymmetric grid
      () => `<section class="py-32 lg:py-40 px-6" style="background: ${getColor(tokens, 'background')}">
        <div class="max-w-7xl mx-auto">
          <div class="grid lg:grid-cols-12 gap-12">
            <div class="lg:col-span-8">
              <p class="text-xs tracking-[0.4em] uppercase mb-8" style="color: ${getColor(tokens, 'muted')}">Featured</p>
              <h1 class="text-5xl md:text-6xl lg:text-8xl font-extralight leading-[1] mb-8" style="color: ${getColor(tokens, 'foreground')}">${headline}</h1>
            </div>
            <div class="lg:col-span-4 lg:flex lg:flex-col lg:justify-end">
              <p class="text-lg leading-relaxed mb-10" style="color: ${getColor(tokens, 'muted')}">${sub}</p>
              <a href="#" class="text-sm tracking-[0.2em] uppercase flex items-center gap-3" style="color: ${getColor(tokens, 'foreground')}">Discover <span>↓</span></a>
            </div>
          </div>
        </div>
      </section>`,
      // 4. Magazine style
      () => `<section class="py-20 px-6" style="background: ${getColor(tokens, 'background')}">
        <div class="max-w-7xl mx-auto">
          <div class="grid lg:grid-cols-3 gap-1" style="background: ${getColor(tokens, 'border')}">
            <div class="lg:col-span-2 p-12 lg:p-20" style="background: ${getColor(tokens, 'background')}">
              <h1 class="text-5xl lg:text-7xl font-light leading-[1.05] mb-8" style="color: ${getColor(tokens, 'foreground')}">${headline}</h1>
              <p class="text-lg max-w-xl" style="color: ${getColor(tokens, 'muted')}">${sub}</p>
            </div>
            <div class="p-12 flex flex-col justify-between" style="background: ${getColor(tokens, 'card')}">
              <p class="text-xs tracking-[0.3em] uppercase" style="color: ${getColor(tokens, 'muted')}">${badge}</p>
              <button class="self-start text-sm tracking-[0.2em] uppercase flex items-center gap-3" style="color: ${getColor(tokens, 'foreground')}">${cta1} →</button>
            </div>
          </div>
        </div>
      </section>`,
      // 5. Full bleed with overlay
      () => `<section class="relative min-h-[85vh] flex items-end pb-20 px-6" style="background: linear-gradient(to bottom, ${getColor(tokens, 'card')} 0%, ${getColor(tokens, 'background')} 100%)">
        <div class="max-w-6xl mx-auto w-full">
          <p class="text-xs tracking-[0.4em] uppercase mb-6" style="color: ${getColor(tokens, 'muted')}">${badge}</p>
          <h1 class="text-5xl md:text-7xl lg:text-8xl font-extralight leading-[0.95] mb-10" style="color: ${getColor(tokens, 'foreground')}">${headline}</h1>
          <div class="flex items-end justify-between gap-12 flex-wrap">
            <p class="text-lg max-w-lg" style="color: ${getColor(tokens, 'muted')}">${sub}</p>
            <a href="#" class="text-sm tracking-[0.2em] uppercase" style="color: ${getColor(tokens, 'foreground')}">${cta1} →</a>
          </div>
        </div>
      </section>`,
    ]
    return pick(layouts)()
  }

  if (style === 'action') {
    const layouts = [
      // 1. Classic two-column hero
      () => `<section class="py-20 lg:py-32 px-6" style="background: ${getColor(tokens, 'background')}">
        <div class="max-w-6xl mx-auto">
          <div class="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              ${showBadge ? `<span class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-8" style="background: ${getColor(tokens, 'primary')}15; color: ${getColor(tokens, 'primary')}">${badge}</span>` : ''}
              <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] mb-8" style="color: ${getColor(tokens, 'foreground')}">${headline}</h1>
              <p class="text-lg lg:text-xl mb-10" style="color: ${getColor(tokens, 'muted')}">${sub}</p>
              <div class="flex flex-wrap gap-4">
                <button class="px-8 py-4 font-semibold rounded-xl transition-all hover:scale-105 shadow-lg hover:shadow-xl" style="background: ${getColor(tokens, 'primary')}; color: ${getColor(tokens, 'primary-foreground')}">${cta1}</button>
                <button class="px-8 py-4 font-semibold rounded-xl" style="border: 2px solid ${getColor(tokens, 'border')}; color: ${getColor(tokens, 'foreground')}">${cta2}</button>
              </div>
            </div>
            <div class="relative">
              <div class="aspect-square rounded-3xl shadow-2xl" style="background: linear-gradient(135deg, ${getColor(tokens, 'card')} 0%, ${getColor(tokens, 'border')} 100%)"></div>
              <div class="absolute -bottom-6 -left-6 w-32 h-32 rounded-2xl shadow-xl" style="background: ${getColor(tokens, 'primary')}20"></div>
            </div>
          </div>
        </div>
      </section>`,
      // 2. Centered with trust badges
      () => `<section class="py-24 lg:py-32 px-6" style="background: ${getColor(tokens, 'background')}">
        <div class="max-w-4xl mx-auto text-center">
          ${showBadge ? `<span class="inline-block px-5 py-2 rounded-full text-xs font-bold mb-10" style="background: ${getColor(tokens, 'primary')}; color: ${getColor(tokens, 'primary-foreground')}">${badge}</span>` : ''}
          <h1 class="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-8" style="color: ${getColor(tokens, 'foreground')}">${headline}</h1>
          <p class="text-xl mb-12 max-w-2xl mx-auto" style="color: ${getColor(tokens, 'muted')}">${sub}</p>
          <div class="flex justify-center gap-4 mb-16">
            <button class="px-10 py-5 font-bold rounded-2xl transition-all hover:scale-105 shadow-xl" style="background: ${getColor(tokens, 'primary')}; color: ${getColor(tokens, 'primary-foreground')}">${cta1}</button>
            <button class="px-10 py-5 font-semibold rounded-2xl" style="border: 2px solid ${getColor(tokens, 'border')}; color: ${getColor(tokens, 'foreground')}">${cta2}</button>
          </div>
          ${showStats ? `<div class="grid grid-cols-3 gap-8 pt-16" style="border-top: 1px solid ${getColor(tokens, 'border')}">
            ${stats.map(([num, label]) => `<div><p class="text-3xl lg:text-4xl font-bold mb-2" style="color: ${getColor(tokens, 'foreground')}">${num}</p><p class="text-sm" style="color: ${getColor(tokens, 'muted')}">${label}</p></div>`).join('')}
          </div>` : ''}
        </div>
      </section>`,
      // 3. Bento-style hero with cards
      () => `<section class="py-20 px-6" style="background: ${getColor(tokens, 'card')}">
        <div class="max-w-6xl mx-auto">
          <div class="grid lg:grid-cols-5 gap-6">
            <div class="lg:col-span-3 p-10 lg:p-14 rounded-3xl" style="background: ${getColor(tokens, 'background')}">
              ${showBadge ? `<span class="inline-block px-4 py-1.5 rounded-full text-xs font-semibold mb-6" style="background: ${getColor(tokens, 'primary')}15; color: ${getColor(tokens, 'primary')}">${badge}</span>` : ''}
              <h1 class="text-4xl lg:text-5xl font-bold leading-[1.15] mb-6" style="color: ${getColor(tokens, 'foreground')}">${headline}</h1>
              <p class="text-lg mb-8 max-w-lg" style="color: ${getColor(tokens, 'muted')}">${sub}</p>
              <div class="flex gap-4">
                <button class="px-8 py-4 font-semibold rounded-xl" style="background: ${getColor(tokens, 'primary')}; color: ${getColor(tokens, 'primary-foreground')}">${cta1}</button>
                <button class="px-8 py-4 font-medium rounded-xl" style="border: 1px solid ${getColor(tokens, 'border')}; color: ${getColor(tokens, 'foreground')}">${cta2}</button>
              </div>
            </div>
            <div class="lg:col-span-2 grid gap-6">
              <div class="p-8 rounded-3xl" style="background: ${getColor(tokens, 'background')}">
                <p class="text-4xl font-bold mb-2" style="color: ${getColor(tokens, 'foreground')}">${stats[0][0]}</p>
                <p class="text-sm" style="color: ${getColor(tokens, 'muted')}">${stats[0][1]}</p>
              </div>
              <div class="p-8 rounded-3xl" style="background: ${getColor(tokens, 'primary')}">
                <p class="text-4xl font-bold mb-2" style="color: ${getColor(tokens, 'primary-foreground')}">${stats[1][0]}</p>
                <p class="text-sm opacity-80" style="color: ${getColor(tokens, 'primary-foreground')}">${stats[1][1]}</p>
              </div>
            </div>
          </div>
        </div>
      </section>`,
      // 4. Product showcase
      () => `<section class="py-20 lg:py-28 px-6" style="background: ${getColor(tokens, 'background')}">
        <div class="max-w-7xl mx-auto">
          <div class="text-center mb-16">
            ${showBadge ? `<span class="inline-block px-4 py-1.5 rounded-full text-xs font-semibold mb-6" style="background: ${getColor(tokens, 'primary')}; color: ${getColor(tokens, 'primary-foreground')}">${badge}</span>` : ''}
            <h1 class="text-4xl md:text-6xl font-bold mb-6" style="color: ${getColor(tokens, 'foreground')}">${headline}</h1>
            <p class="text-xl max-w-2xl mx-auto mb-10" style="color: ${getColor(tokens, 'muted')}">${sub}</p>
            <div class="flex justify-center gap-4">
              <button class="px-10 py-4 font-semibold rounded-xl shadow-lg" style="background: ${getColor(tokens, 'primary')}; color: ${getColor(tokens, 'primary-foreground')}">${cta1}</button>
            </div>
          </div>
          <div class="relative aspect-video max-w-5xl mx-auto rounded-2xl shadow-2xl overflow-hidden" style="background: linear-gradient(135deg, ${getColor(tokens, 'card')} 0%, ${getColor(tokens, 'border')} 100%)">
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="w-20 h-20 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform" style="background: ${getColor(tokens, 'primary')}">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="${getColor(tokens, 'primary-foreground')}"><path d="M8 5v14l11-7z"/></svg>
              </div>
            </div>
          </div>
        </div>
      </section>`,
      // 5. Gradient accent hero
      () => `<section class="relative py-28 lg:py-36 px-6 overflow-hidden" style="background: ${getColor(tokens, 'background')}">
        <div class="absolute top-0 right-0 w-1/2 h-full opacity-30" style="background: linear-gradient(135deg, ${getColor(tokens, 'primary')}40 0%, transparent 70%)"></div>
        <div class="relative max-w-6xl mx-auto">
          <div class="max-w-3xl">
            ${showBadge ? `<span class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-8" style="background: ${getColor(tokens, 'card')}; color: ${getColor(tokens, 'foreground')}">${badge}</span>` : ''}
            <h1 class="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-8" style="color: ${getColor(tokens, 'foreground')}">${headline}</h1>
            <p class="text-xl mb-12 max-w-xl" style="color: ${getColor(tokens, 'muted')}">${sub}</p>
            <div class="flex flex-wrap gap-4">
              <button class="px-10 py-5 font-bold rounded-2xl shadow-xl transition-transform hover:scale-105" style="background: ${getColor(tokens, 'primary')}; color: ${getColor(tokens, 'primary-foreground')}">${cta1}</button>
              <button class="px-10 py-5 font-semibold rounded-2xl flex items-center gap-2" style="color: ${getColor(tokens, 'foreground')}">${cta2} →</button>
            </div>
          </div>
        </div>
      </section>`,
    ]
    return pick(layouts)()
  }

  // Minimalist
  const layouts = [
    // 1. Ultra clean
    () => `<section class="min-h-[75vh] flex items-center justify-center px-6" style="background: ${getColor(tokens, 'background')}">
      <div class="max-w-2xl text-center">
        <h1 class="text-3xl md:text-5xl font-light leading-relaxed mb-10" style="color: ${getColor(tokens, 'foreground')}">${headline}</h1>
        <a href="#" class="inline-flex items-center gap-3 text-sm tracking-widest uppercase" style="color: ${getColor(tokens, 'foreground')}">${cta1} <span>→</span></a>
      </div>
    </section>`,
    // 2. Left-aligned minimal
    () => `<section class="min-h-[80vh] flex items-center px-6 lg:px-20" style="background: ${getColor(tokens, 'background')}">
      <div class="max-w-xl">
        <h1 class="text-4xl md:text-6xl font-light leading-[1.15] mb-12" style="color: ${getColor(tokens, 'foreground')}">${headline}</h1>
        <div class="flex items-center gap-8">
          <span class="text-sm uppercase tracking-widest" style="color: ${getColor(tokens, 'muted')}">${cta1}</span>
          <div class="h-px flex-1" style="background: ${getColor(tokens, 'border')}"></div>
        </div>
      </div>
    </section>`,
    // 3. Split with line
    () => `<section class="py-40 px-6" style="background: ${getColor(tokens, 'background')}">
      <div class="max-w-5xl mx-auto">
        <h1 class="text-5xl md:text-7xl font-extralight leading-[1.1] mb-16" style="color: ${getColor(tokens, 'foreground')}">${headline}</h1>
        <div class="h-px w-full mb-16" style="background: ${getColor(tokens, 'border')}"></div>
        <div class="flex justify-between items-end flex-wrap gap-8">
          <p class="text-lg max-w-md" style="color: ${getColor(tokens, 'muted')}">${sub}</p>
          <a href="#" class="text-sm uppercase tracking-widest" style="color: ${getColor(tokens, 'foreground')}">${cta1}</a>
        </div>
      </div>
    </section>`,
    // 4. Vertical rhythm
    () => `<section class="py-32 px-6" style="background: ${getColor(tokens, 'background')}">
      <div class="max-w-4xl mx-auto">
        <div class="grid md:grid-cols-4 gap-8 items-end">
          <div class="md:col-span-3">
            <h1 class="text-4xl md:text-6xl font-light leading-[1.1]" style="color: ${getColor(tokens, 'foreground')}">${headline}</h1>
          </div>
          <div class="text-right">
            <span class="text-sm uppercase tracking-widest" style="color: ${getColor(tokens, 'muted')}">${badge}</span>
          </div>
        </div>
        <div class="mt-20 pt-10" style="border-top: 1px solid ${getColor(tokens, 'border')}">
          <p class="max-w-md" style="color: ${getColor(tokens, 'muted')}">${sub}</p>
        </div>
      </div>
    </section>`,
    // 5. Dramatic whitespace
    () => `<section class="min-h-screen flex flex-col justify-center px-6" style="background: ${getColor(tokens, 'background')}">
      <div class="max-w-6xl mx-auto w-full">
        <p class="text-xs tracking-[0.5em] uppercase mb-20" style="color: ${getColor(tokens, 'muted')}">${badge}</p>
        <h1 class="text-5xl md:text-8xl font-extralight leading-[0.95] max-w-4xl" style="color: ${getColor(tokens, 'foreground')}">${headline}</h1>
      </div>
    </section>`,
  ]
  return pick(layouts)()
}

// ==================== FEATURES SECTION ====================
function generateFeatures(tokens: DesignTokens, style: VariantStyle, prompt: string): string {
  const parsed = parsePrompt(prompt)
  const count = parsed.count || randomBetween(3, 6)
  const features = shuffle(featureTitles).slice(0, count).map((title, i) => ({
    title,
    desc: featureDescriptions[i % featureDescriptions.length],
    num: String(i + 1).padStart(2, '0'),
  }))
  const sectionTitle = pick(headlines.features)
  const sub = 'Everything you need to build, scale, and succeed.'

  if (style === 'editorial') {
    const layouts = [
      // 1. Numbered grid
      () => `<section class="py-28 px-6" style="background: ${getColor(tokens, 'background')}">
        <div class="max-w-6xl mx-auto">
          <div class="mb-20">
            <p class="text-xs tracking-[0.4em] uppercase mb-4" style="color: ${getColor(tokens, 'muted')}">Capabilities</p>
            <h2 class="text-4xl md:text-6xl font-light" style="color: ${getColor(tokens, 'foreground')}">${sectionTitle}</h2>
          </div>
          <div class="grid md:grid-cols-3 gap-px" style="background: ${getColor(tokens, 'border')}">
            ${features.slice(0, 3).map(f => `<article class="p-10 lg:p-14" style="background: ${getColor(tokens, 'background')}">
              <span class="text-6xl font-extralight block mb-8" style="color: ${getColor(tokens, 'border')}">${f.num}</span>
              <h3 class="text-xl font-medium mb-4" style="color: ${getColor(tokens, 'foreground')}">${f.title}</h3>
              <p class="text-sm leading-relaxed" style="color: ${getColor(tokens, 'muted')}">${f.desc}</p>
            </article>`).join('')}
          </div>
        </div>
      </section>`,
      // 2. Alternating layout
      () => `<section class="py-24 px-6" style="background: ${getColor(tokens, 'background')}">
        <div class="max-w-5xl mx-auto">
          <p class="text-xs tracking-[0.4em] uppercase mb-20" style="color: ${getColor(tokens, 'muted')}">${sectionTitle}</p>
          ${features.slice(0, 4).map((f, i) => `<div class="grid md:grid-cols-2 gap-16 items-center py-16 ${i > 0 ? 'border-t' : ''}" style="border-color: ${getColor(tokens, 'border')}">
            <div class="${i % 2 === 1 ? 'md:order-2' : ''}">
              <span class="text-xs tracking-[0.2em] uppercase block mb-6" style="color: ${getColor(tokens, 'muted')}">${f.num}</span>
              <h3 class="text-2xl font-light mb-4" style="color: ${getColor(tokens, 'foreground')}">${f.title}</h3>
              <p class="leading-relaxed" style="color: ${getColor(tokens, 'muted')}">${f.desc}</p>
            </div>
            <div class="aspect-[4/3]" style="background: ${getColor(tokens, 'card')}"></div>
          </div>`).join('')}
        </div>
      </section>`,
      // 3. List style
      () => `<section class="py-28 px-6" style="background: ${getColor(tokens, 'background')}">
        <div class="max-w-4xl mx-auto">
          <h2 class="text-4xl md:text-5xl font-light mb-20" style="color: ${getColor(tokens, 'foreground')}">${sectionTitle}</h2>
          <div class="space-y-0">
            ${features.map(f => `<div class="py-10 flex justify-between items-start gap-8" style="border-bottom: 1px solid ${getColor(tokens, 'border')}">
              <div class="flex-1">
                <h3 class="text-xl mb-2" style="color: ${getColor(tokens, 'foreground')}">${f.title}</h3>
                <p class="text-sm" style="color: ${getColor(tokens, 'muted')}">${f.desc}</p>
              </div>
              <span class="text-sm" style="color: ${getColor(tokens, 'muted')}">${f.num}</span>
            </div>`).join('')}
          </div>
        </div>
      </section>`,
    ]
    return pick(layouts)()
  }

  if (style === 'action') {
    const layouts = [
      // 1. Card grid
      () => `<section class="py-24 px-6" style="background: ${getColor(tokens, 'background')}">
        <div class="max-w-6xl mx-auto">
          <div class="text-center mb-16">
            <h2 class="text-4xl md:text-5xl font-bold mb-4" style="color: ${getColor(tokens, 'foreground')}">${sectionTitle}</h2>
            <p class="text-lg max-w-2xl mx-auto" style="color: ${getColor(tokens, 'muted')}">${sub}</p>
          </div>
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${features.map(f => `<div class="p-8 rounded-2xl transition-all hover:-translate-y-1 hover:shadow-xl" style="background: ${getColor(tokens, 'card')}; border: 1px solid ${getColor(tokens, 'border')}">
              <div class="w-14 h-14 rounded-xl mb-6 flex items-center justify-center" style="background: ${getColor(tokens, 'primary')}15">
                <svg width="24" height="24" fill="none" stroke="${getColor(tokens, 'primary')}" stroke-width="2" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              </div>
              <h3 class="text-xl font-semibold mb-3" style="color: ${getColor(tokens, 'foreground')}">${f.title}</h3>
              <p class="text-sm leading-relaxed" style="color: ${getColor(tokens, 'muted')}">${f.desc}</p>
            </div>`).join('')}
          </div>
        </div>
      </section>`,
      // 2. Bento grid
      () => `<section class="py-24 px-6" style="background: ${getColor(tokens, 'background')}">
        <div class="max-w-6xl mx-auto">
          <div class="text-center mb-16">
            <h2 class="text-4xl font-bold mb-4" style="color: ${getColor(tokens, 'foreground')}">${sectionTitle}</h2>
            <p class="text-lg" style="color: ${getColor(tokens, 'muted')}">${sub}</p>
          </div>
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div class="lg:col-span-2 p-10 rounded-3xl" style="background: ${getColor(tokens, 'card')}">
              <div class="w-12 h-12 rounded-xl mb-6" style="background: ${getColor(tokens, 'primary')}"></div>
              <h3 class="text-2xl font-bold mb-3" style="color: ${getColor(tokens, 'foreground')}">${features[0].title}</h3>
              <p style="color: ${getColor(tokens, 'muted')}">${features[0].desc}</p>
            </div>
            ${features.slice(1, 3).map(f => `<div class="p-8 rounded-3xl" style="background: ${getColor(tokens, 'card')}">
              <div class="w-10 h-10 rounded-lg mb-4" style="background: ${getColor(tokens, 'primary')}20"></div>
              <h3 class="text-lg font-semibold mb-2" style="color: ${getColor(tokens, 'foreground')}">${f.title}</h3>
              <p class="text-sm" style="color: ${getColor(tokens, 'muted')}">${f.desc}</p>
            </div>`).join('')}
          </div>
        </div>
      </section>`,
      // 3. Icon row
      () => `<section class="py-24 px-6" style="background: ${getColor(tokens, 'card')}">
        <div class="max-w-6xl mx-auto">
          <h2 class="text-4xl font-bold text-center mb-20" style="color: ${getColor(tokens, 'foreground')}">${sectionTitle}</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-12">
            ${features.slice(0, 4).map(f => `<div class="text-center">
              <div class="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center" style="background: ${getColor(tokens, 'background')}; border: 1px solid ${getColor(tokens, 'border')}">
                <svg width="28" height="28" fill="none" stroke="${getColor(tokens, 'primary')}" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
              </div>
              <h3 class="font-semibold mb-2" style="color: ${getColor(tokens, 'foreground')}">${f.title}</h3>
              <p class="text-sm" style="color: ${getColor(tokens, 'muted')}">${f.desc}</p>
            </div>`).join('')}
          </div>
        </div>
      </section>`,
    ]
    return pick(layouts)()
  }

  // Minimalist
  const layouts = [
    // Simple list
    () => `<section class="py-32 px-6" style="background: ${getColor(tokens, 'background')}">
      <div class="max-w-3xl mx-auto">
        <h2 class="text-3xl font-light mb-20" style="color: ${getColor(tokens, 'foreground')}">${sectionTitle}</h2>
        ${features.slice(0, 4).map(f => `<div class="py-8 flex gap-8" style="border-bottom: 1px solid ${getColor(tokens, 'border')}">
          <span class="text-sm shrink-0 w-8" style="color: ${getColor(tokens, 'muted')}">${f.num}</span>
          <div>
            <h3 class="mb-2" style="color: ${getColor(tokens, 'foreground')}">${f.title}</h3>
            <p class="text-sm" style="color: ${getColor(tokens, 'muted')}">${f.desc}</p>
          </div>
        </div>`).join('')}
      </div>
    </section>`,
    // Two column
    () => `<section class="py-32 px-6" style="background: ${getColor(tokens, 'background')}">
      <div class="max-w-5xl mx-auto grid md:grid-cols-2 gap-20">
        <div>
          <h2 class="text-3xl font-light" style="color: ${getColor(tokens, 'foreground')}">${sectionTitle}</h2>
        </div>
        <div class="space-y-12">
          ${features.slice(0, 3).map(f => `<div>
            <h3 class="text-lg mb-2" style="color: ${getColor(tokens, 'foreground')}">${f.title}</h3>
            <p class="text-sm" style="color: ${getColor(tokens, 'muted')}">${f.desc}</p>
          </div>`).join('')}
        </div>
      </div>
    </section>`,
  ]
  return pick(layouts)()
}

// ==================== PRICING SECTION ====================
function generatePricing(tokens: DesignTokens, style: VariantStyle, prompt: string): string {
  const parsed = parsePrompt(prompt)
  const sectionTitle = pick(headlines.pricing)
  const planCount = parsed.count || 3
  const allPlans = [
    { name: 'Free', price: '$0', features: 2 },
    { name: 'Starter', price: '$' + randomBetween(9, 29), features: 3 },
    { name: 'Pro', price: '$' + randomBetween(39, 79), features: 5, popular: true },
    { name: 'Business', price: '$' + randomBetween(99, 149), features: 6 },
    { name: 'Enterprise', price: '$' + randomBetween(199, 299), features: 7 },
  ]
  const plans = planCount <= 2 
    ? allPlans.slice(1, 3) 
    : planCount === 4 
      ? allPlans.slice(1, 5) 
      : planCount >= 5 
        ? allPlans 
        : allPlans.slice(1, 4)
  const featureList = shuffle(['Unlimited projects', 'Priority support', 'Advanced analytics', 'Custom integrations', 'API access', 'Team collaboration', 'White label'])

  if (style === 'editorial') {
    const layouts = [
      () => `<section class="py-28 px-6" style="background: ${getColor(tokens, 'background')}">
        <div class="max-w-5xl mx-auto">
          <div class="text-center mb-20">
            <p class="text-xs tracking-[0.4em] uppercase mb-4" style="color: ${getColor(tokens, 'muted')}">Investment</p>
            <h2 class="text-4xl md:text-5xl font-light" style="color: ${getColor(tokens, 'foreground')}">${sectionTitle}</h2>
          </div>
          <div class="grid md:grid-cols-2 gap-px" style="background: ${getColor(tokens, 'border')}">
            ${plans.slice(0, 2).map(p => `<div class="p-12" style="background: ${getColor(tokens, 'background')}">
              <p class="text-xs tracking-[0.3em] uppercase mb-4" style="color: ${getColor(tokens, 'muted')}">${p.name}</p>
              <p class="text-5xl font-light mb-2" style="color: ${getColor(tokens, 'foreground')}">${p.price}</p>
              <p class="text-sm mb-10" style="color: ${getColor(tokens, 'muted')}">per month</p>
              <ul class="space-y-4 mb-10">
                ${featureList.slice(0, p.features).map(f => `<li class="text-sm" style="color: ${getColor(tokens, 'muted')}">— ${f}</li>`).join('')}
              </ul>
              <button class="w-full py-4 text-sm tracking-wide uppercase transition-colors hover:bg-black/5" style="border: 1px solid ${getColor(tokens, 'border')}; color: ${getColor(tokens, 'foreground')}">Select</button>
            </div>`).join('')}
          </div>
        </div>
      </section>`,
    ]
    return pick(layouts)()
  }

  if (style === 'action') {
    const layouts = [
      () => `<section class="py-24 px-6" style="background: ${getColor(tokens, 'background')}">
        <div class="max-w-6xl mx-auto">
          <div class="text-center mb-16">
            <h2 class="text-4xl md:text-5xl font-bold mb-4" style="color: ${getColor(tokens, 'foreground')}">${sectionTitle}</h2>
            <p class="text-lg" style="color: ${getColor(tokens, 'muted')}">No hidden fees. Cancel anytime.</p>
          </div>
          <div class="grid md:grid-cols-3 gap-6">
            ${plans.map(p => `<div class="p-8 rounded-2xl relative ${p.popular ? 'ring-2' : ''}" style="background: ${getColor(tokens, 'card')}; border: 1px solid ${p.popular ? getColor(tokens, 'primary') : getColor(tokens, 'border')}; ${p.popular ? `--tw-ring-color: ${getColor(tokens, 'primary')}` : ''}">
              ${p.popular ? `<span class="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold" style="background: ${getColor(tokens, 'primary')}; color: ${getColor(tokens, 'primary-foreground')}">Most Popular</span>` : ''}
              <h3 class="text-xl font-semibold mb-2" style="color: ${getColor(tokens, 'foreground')}">${p.name}</h3>
              <p class="text-4xl font-bold mb-1" style="color: ${getColor(tokens, 'foreground')}">${p.price}<span class="text-base font-normal" style="color: ${getColor(tokens, 'muted')}">/mo</span></p>
              <ul class="space-y-3 my-8">
                ${featureList.slice(0, p.features).map(f => `<li class="flex items-center gap-3 text-sm" style="color: ${getColor(tokens, 'muted')}">
                  <svg width="16" height="16" fill="${getColor(tokens, 'primary')}" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>
                  ${f}
                </li>`).join('')}
              </ul>
              <button class="w-full py-3 rounded-xl font-semibold transition-all hover:scale-105" style="background: ${p.popular ? getColor(tokens, 'primary') : 'transparent'}; color: ${p.popular ? getColor(tokens, 'primary-foreground') : getColor(tokens, 'foreground')}; border: ${p.popular ? 'none' : `1px solid ${getColor(tokens, 'border')}`}">Get Started</button>
            </div>`).join('')}
          </div>
        </div>
      </section>`,
    ]
    return pick(layouts)()
  }

  // Minimalist
  return `<section class="py-32 px-6" style="background: ${getColor(tokens, 'background')}">
    <div class="max-w-3xl mx-auto">
      <h2 class="text-3xl font-light mb-16" style="color: ${getColor(tokens, 'foreground')}">${sectionTitle}</h2>
      ${plans.map(p => `<div class="py-8 flex justify-between items-center" style="border-bottom: 1px solid ${getColor(tokens, 'border')}">
        <div>
          <h3 class="text-lg mb-1" style="color: ${getColor(tokens, 'foreground')}">${p.name}</h3>
          <p class="text-sm" style="color: ${getColor(tokens, 'muted')}">${p.features} features included</p>
        </div>
        <p class="text-2xl font-light" style="color: ${getColor(tokens, 'foreground')}">${p.price}<span class="text-sm" style="color: ${getColor(tokens, 'muted')}">/mo</span></p>
      </div>`).join('')}
    </div>
  </section>`
}

// ==================== TESTIMONIALS ====================
function generateTestimonials(tokens: DesignTokens, style: VariantStyle, prompt: string): string {
  const parsed = parsePrompt(prompt)
  const sectionTitle = pick(headlines.testimonials)
  const count = parsed.count || 3
  const testimonials = shuffle(testimonialQuotes).slice(0, count).map((quote, i) => ({
    quote,
    name: names[i],
    role: roles[i],
    company: companies[i],
  }))

  if (style === 'editorial') {
    return `<section class="py-32 px-6" style="background: ${getColor(tokens, 'background')}">
      <div class="max-w-4xl mx-auto text-center">
        <span class="text-8xl font-serif block mb-8" style="color: ${getColor(tokens, 'border')}">"</span>
        <p class="text-2xl md:text-4xl font-light leading-relaxed mb-12" style="color: ${getColor(tokens, 'foreground')}">${testimonials[0].quote}</p>
        <div>
          <p class="font-medium mb-1" style="color: ${getColor(tokens, 'foreground')}">${testimonials[0].name}</p>
          <p class="text-sm" style="color: ${getColor(tokens, 'muted')}">${testimonials[0].role}, ${testimonials[0].company}</p>
        </div>
      </div>
    </section>`
  }

  if (style === 'action') {
    return `<section class="py-24 px-6" style="background: ${getColor(tokens, 'card')}">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-4xl font-bold text-center mb-16" style="color: ${getColor(tokens, 'foreground')}">${sectionTitle}</h2>
        <div class="grid md:grid-cols-3 gap-6">
          ${testimonials.map(t => `<div class="p-8 rounded-2xl" style="background: ${getColor(tokens, 'background')}; border: 1px solid ${getColor(tokens, 'border')}">
            <div class="flex gap-1 mb-4">${'★'.repeat(5).split('').map(() => `<svg width="16" height="16" fill="${getColor(tokens, 'primary')}" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>`).join('')}</div>
            <p class="mb-6" style="color: ${getColor(tokens, 'muted')}">"${t.quote}"</p>
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full" style="background: ${getColor(tokens, 'border')}"></div>
              <div>
                <p class="font-medium text-sm" style="color: ${getColor(tokens, 'foreground')}">${t.name}</p>
                <p class="text-xs" style="color: ${getColor(tokens, 'muted')}">${t.role}</p>
              </div>
            </div>
          </div>`).join('')}
        </div>
      </div>
    </section>`
  }

  // Minimalist
  return `<section class="py-32 px-6" style="background: ${getColor(tokens, 'background')}">
    <div class="max-w-2xl mx-auto">
      <p class="text-2xl font-light leading-relaxed mb-8" style="color: ${getColor(tokens, 'foreground')}">"${testimonials[0].quote}"</p>
      <div class="flex items-center gap-4">
        <div class="h-px flex-1" style="background: ${getColor(tokens, 'border')}"></div>
        <p class="text-sm" style="color: ${getColor(tokens, 'muted')}">${testimonials[0].name}</p>
      </div>
    </div>
  </section>`
}

// ==================== CONTACT ====================
function generateContact(tokens: DesignTokens, style: VariantStyle, prompt: string): string {
  const parsed = parsePrompt(prompt)
  const sectionTitle = pick(headlines.contact)
  
  // Get team members if people are requested
  const teamCount = parsed.count || (parsed.hasPeople ? 2 : 0)
  const teamMembers = shuffle(names).slice(0, teamCount).map((name, i) => ({
    name,
    role: roles[i % roles.length],
    email: `${name.toLowerCase().replace(' ', '.')}@company.com`
  }))

  if (style === 'editorial') {
    // If people/team requested, show team contact cards
    if (parsed.hasPeople && teamCount > 0) {
      return `<section class="py-28 px-6" style="background: ${getColor(tokens, 'background')}">
        <div class="max-w-5xl mx-auto">
          <p class="text-xs tracking-[0.4em] uppercase mb-4" style="color: ${getColor(tokens, 'muted')}">Get in Touch</p>
          <h2 class="text-4xl md:text-5xl font-light mb-6" style="color: ${getColor(tokens, 'foreground')}">${sectionTitle}</h2>
          <p class="text-lg mb-16 max-w-2xl" style="color: ${getColor(tokens, 'muted')}">Reach out to our team directly. We're here to help.</p>
          <div class="grid md:grid-cols-${Math.min(teamCount, 3)} gap-8 mb-16">
            ${teamMembers.map(person => `<div class="text-center p-8" style="border: 1px solid ${getColor(tokens, 'border')}">
              <div class="w-24 h-24 rounded-full mx-auto mb-6" style="background: ${getColor(tokens, 'card')}"></div>
              <h3 class="text-xl font-light mb-1" style="color: ${getColor(tokens, 'foreground')}">${person.name}</h3>
              <p class="text-sm mb-4" style="color: ${getColor(tokens, 'muted')}">${person.role}</p>
              <a href="mailto:${person.email}" class="text-sm" style="color: ${getColor(tokens, 'foreground')}">${person.email}</a>
            </div>`).join('')}
          </div>
          ${parsed.hasMap ? `<div class="aspect-[2/1] w-full rounded-none mb-8" style="background: ${getColor(tokens, 'card')}; border: 1px solid ${getColor(tokens, 'border')}">
            <div class="w-full h-full flex items-center justify-center">
              <p class="text-sm tracking-widest uppercase" style="color: ${getColor(tokens, 'muted')}">Map Location</p>
            </div>
          </div>` : ''}
        </div>
      </section>`
    }
    
    // Default editorial contact
    return `<section class="py-28 px-6" style="background: ${getColor(tokens, 'background')}">
      <div class="max-w-4xl mx-auto">
        <p class="text-xs tracking-[0.4em] uppercase mb-4" style="color: ${getColor(tokens, 'muted')}">Contact</p>
        <h2 class="text-4xl md:text-5xl font-light mb-6" style="color: ${getColor(tokens, 'foreground')}">${sectionTitle}</h2>
        <p class="text-lg mb-16 max-w-2xl" style="color: ${getColor(tokens, 'muted')}">We'd love to hear from you. Send us a message.</p>
        <div class="grid md:grid-cols-2 gap-16">
          <form class="space-y-6">
            ${['Name', 'Email'].map(label => `<div>
              <label class="block text-xs tracking-widest uppercase mb-3" style="color: ${getColor(tokens, 'muted')}">${label}</label>
              <input type="${label === 'Email' ? 'email' : 'text'}" class="w-full px-0 py-3 bg-transparent border-0 border-b focus:outline-none" style="border-color: ${getColor(tokens, 'border')}; color: ${getColor(tokens, 'foreground')}">
            </div>`).join('')}
            <div>
              <label class="block text-xs tracking-widest uppercase mb-3" style="color: ${getColor(tokens, 'muted')}">Message</label>
              <textarea rows="4" class="w-full px-0 py-3 bg-transparent border-0 border-b focus:outline-none resize-none" style="border-color: ${getColor(tokens, 'border')}; color: ${getColor(tokens, 'foreground')}"></textarea>
            </div>
            <button type="submit" class="px-10 py-3 text-sm tracking-widest uppercase" style="border: 1px solid ${getColor(tokens, 'border')}; color: ${getColor(tokens, 'foreground')}">Send</button>
          </form>
          <div class="space-y-8">
            ${[['Email', 'hello@company.com'], ['Phone', '+1 (555) 000-0000'], ['Address', '123 Street, City']].map(([label, value]) => `<div>
              <p class="text-xs tracking-widest uppercase mb-2" style="color: ${getColor(tokens, 'muted')}">${label}</p>
              <p style="color: ${getColor(tokens, 'foreground')}">${value}</p>
            </div>`).join('')}
          </div>
        </div>
      </div>
    </section>`
  }

  if (style === 'action') {
    // If people/team requested, show team grid with contact info
    if (parsed.hasPeople && teamCount > 0) {
      return `<section class="py-24 px-6" style="background: ${getColor(tokens, 'background')}">
        <div class="max-w-6xl mx-auto">
          <div class="text-center mb-16">
            <h2 class="text-4xl font-bold mb-4" style="color: ${getColor(tokens, 'foreground')}">${sectionTitle}</h2>
            <p class="text-lg" style="color: ${getColor(tokens, 'muted')}">Connect with our team members directly</p>
          </div>
          <div class="grid md:grid-cols-${Math.min(teamCount, 3)} gap-8">
            ${teamMembers.map(person => `<div class="p-8 rounded-2xl text-center" style="background: ${getColor(tokens, 'card')}; border: 1px solid ${getColor(tokens, 'border')}">
              <div class="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center text-2xl font-bold" style="background: ${getColor(tokens, 'primary')}20; color: ${getColor(tokens, 'primary')}">${person.name.charAt(0)}</div>
              <h3 class="text-xl font-semibold mb-1" style="color: ${getColor(tokens, 'foreground')}">${person.name}</h3>
              <p class="text-sm mb-4" style="color: ${getColor(tokens, 'muted')}">${person.role}</p>
              <div class="space-y-2">
                <a href="mailto:${person.email}" class="block text-sm font-medium" style="color: ${getColor(tokens, 'primary')}">${person.email}</a>
                <p class="text-sm" style="color: ${getColor(tokens, 'muted')}">Schedule a call →</p>
              </div>
            </div>`).join('')}
          </div>
          ${parsed.hasForm ? `<div class="mt-16 max-w-xl mx-auto p-8 rounded-2xl" style="background: ${getColor(tokens, 'card')}; border: 1px solid ${getColor(tokens, 'border')}">
            <h3 class="text-xl font-semibold mb-6 text-center" style="color: ${getColor(tokens, 'foreground')}">Or send us a message</h3>
            <form class="space-y-4">
              <input type="email" placeholder="Your email" class="w-full px-4 py-3 rounded-lg" style="background: ${getColor(tokens, 'background')}; border: 1px solid ${getColor(tokens, 'border')}; color: ${getColor(tokens, 'foreground')}">
              <textarea rows="3" placeholder="Message" class="w-full px-4 py-3 rounded-lg resize-none" style="background: ${getColor(tokens, 'background')}; border: 1px solid ${getColor(tokens, 'border')}; color: ${getColor(tokens, 'foreground')}"></textarea>
              <button type="submit" class="w-full py-3 rounded-lg font-semibold" style="background: ${getColor(tokens, 'primary')}; color: ${getColor(tokens, 'primary-foreground')}">Send Message</button>
            </form>
          </div>` : ''}
        </div>
      </section>`
    }
    
    // Default action contact
    return `<section class="py-24 px-6" style="background: ${getColor(tokens, 'background')}">
      <div class="max-w-6xl mx-auto grid md:grid-cols-2 gap-16">
        <div>
          <h2 class="text-4xl font-bold mb-6" style="color: ${getColor(tokens, 'foreground')}">${sectionTitle}</h2>
          <p class="text-lg mb-10" style="color: ${getColor(tokens, 'muted')}">Have a question? We'd love to hear from you.</p>
          <div class="space-y-6">
            ${[['Email', 'hello@company.com'], ['Phone', '+1 (555) 000-0000']].map(([label, value]) => `<div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl flex items-center justify-center" style="background: ${getColor(tokens, 'primary')}15">
                <svg width="20" height="20" fill="none" stroke="${getColor(tokens, 'primary')}" stroke-width="2" viewBox="0 0 24 24"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              </div>
              <div>
                <p class="font-medium" style="color: ${getColor(tokens, 'foreground')}">${label}</p>
                <p class="text-sm" style="color: ${getColor(tokens, 'muted')}">${value}</p>
              </div>
            </div>`).join('')}
          </div>
        </div>
        <div class="p-8 rounded-2xl" style="background: ${getColor(tokens, 'card')}; border: 1px solid ${getColor(tokens, 'border')}">
          <form class="space-y-5">
            <div class="grid grid-cols-2 gap-4">
              <input type="text" placeholder="First name" class="px-4 py-3 rounded-lg" style="background: ${getColor(tokens, 'background')}; border: 1px solid ${getColor(tokens, 'border')}; color: ${getColor(tokens, 'foreground')}">
              <input type="text" placeholder="Last name" class="px-4 py-3 rounded-lg" style="background: ${getColor(tokens, 'background')}; border: 1px solid ${getColor(tokens, 'border')}; color: ${getColor(tokens, 'foreground')}">
            </div>
            <input type="email" placeholder="Email" class="w-full px-4 py-3 rounded-lg" style="background: ${getColor(tokens, 'background')}; border: 1px solid ${getColor(tokens, 'border')}; color: ${getColor(tokens, 'foreground')}">
            <textarea rows="4" placeholder="Message" class="w-full px-4 py-3 rounded-lg resize-none" style="background: ${getColor(tokens, 'background')}; border: 1px solid ${getColor(tokens, 'border')}; color: ${getColor(tokens, 'foreground')}"></textarea>
            <button type="submit" class="w-full py-3 rounded-lg font-semibold" style="background: ${getColor(tokens, 'primary')}; color: ${getColor(tokens, 'primary-foreground')}">Send Message</button>
          </form>
        </div>
      </div>
    </section>`
  }

  // Minimalist
  if (parsed.hasPeople && teamCount > 0) {
    return `<section class="py-32 px-6" style="background: ${getColor(tokens, 'background')}">
      <div class="max-w-3xl mx-auto">
        <h2 class="text-3xl font-light mb-16" style="color: ${getColor(tokens, 'foreground')}">${sectionTitle}</h2>
        <div class="grid md:grid-cols-${Math.min(teamCount, 2)} gap-12">
          ${teamMembers.map(person => `<div>
            <div class="w-16 h-16 rounded-full mb-4" style="background: ${getColor(tokens, 'card')}"></div>
            <h3 class="text-lg mb-1" style="color: ${getColor(tokens, 'foreground')}">${person.name}</h3>
            <p class="text-sm mb-3" style="color: ${getColor(tokens, 'muted')}">${person.role}</p>
            <a href="mailto:${person.email}" class="text-sm" style="color: ${getColor(tokens, 'foreground')}">${person.email} →</a>
          </div>`).join('')}
        </div>
      </div>
    </section>`
  }
  
  return `<section class="py-32 px-6" style="background: ${getColor(tokens, 'background')}">
    <div class="max-w-lg mx-auto">
      <h2 class="text-3xl font-light mb-4" style="color: ${getColor(tokens, 'foreground')}">${sectionTitle}</h2>
      <p class="mb-12" style="color: ${getColor(tokens, 'muted')}">hello@company.com</p>
      <form class="space-y-8">
        ${['Name', 'Email', 'Message'].map((label, i) => `<div style="border-bottom: 1px solid ${getColor(tokens, 'border')}">
          ${i === 2 
            ? `<textarea rows="3" placeholder="${label}" class="w-full py-4 bg-transparent border-0 focus:outline-none resize-none" style="color: ${getColor(tokens, 'foreground')}"></textarea>`
            : `<input type="${i === 1 ? 'email' : 'text'}" placeholder="${label}" class="w-full py-4 bg-transparent border-0 focus:outline-none" style="color: ${getColor(tokens, 'foreground')}">`
          }
        </div>`).join('')}
        <button type="submit" class="text-sm tracking-wide uppercase flex items-center gap-2" style="color: ${getColor(tokens, 'foreground')}">Send →</button>
      </form>
    </div>
  </section>`
}

// ==================== FAQ ====================
function generateFAQ(tokens: DesignTokens, style: VariantStyle, prompt: string): string {
  const parsed = parsePrompt(prompt)
  const sectionTitle = pick(headlines.faq)
  const count = parsed.count || 4
  const questions = shuffle([
    'What makes your product different?',
    'How do I get started?',
    'What support options are available?',
    'Can I cancel anytime?',
    'Is there a free trial?',
    'Do you offer refunds?',
    'How does billing work?',
    'What payment methods do you accept?',
  ]).slice(0, count)

  if (style === 'editorial') {
    return `<section class="py-28 px-6" style="background: ${getColor(tokens, 'background')}">
      <div class="max-w-3xl mx-auto">
        <p class="text-xs tracking-[0.4em] uppercase mb-4" style="color: ${getColor(tokens, 'muted')}">FAQ</p>
        <h2 class="text-4xl font-light mb-16" style="color: ${getColor(tokens, 'foreground')}">${sectionTitle}</h2>
        ${questions.map((q, i) => `<details class="group py-6 ${i > 0 ? 'border-t' : ''}" style="border-color: ${getColor(tokens, 'border')}">
          <summary class="flex justify-between items-center cursor-pointer list-none">
            <span class="text-lg" style="color: ${getColor(tokens, 'foreground')}">${q}</span>
            <span class="text-2xl font-light transition-transform group-open:rotate-45" style="color: ${getColor(tokens, 'muted')}">+</span>
          </summary>
          <p class="mt-4 leading-relaxed" style="color: ${getColor(tokens, 'muted')}">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.</p>
        </details>`).join('')}
      </div>
    </section>`
  }

  if (style === 'action') {
    return `<section class="py-24 px-6" style="background: ${getColor(tokens, 'background')}">
      <div class="max-w-4xl mx-auto">
        <h2 class="text-4xl font-bold text-center mb-4" style="color: ${getColor(tokens, 'foreground')}">${sectionTitle}</h2>
        <p class="text-center text-lg mb-12" style="color: ${getColor(tokens, 'muted')}">Everything you need to know</p>
        <div class="space-y-4">
          ${questions.map(q => `<details class="group rounded-xl overflow-hidden" style="background: ${getColor(tokens, 'card')}; border: 1px solid ${getColor(tokens, 'border')}">
            <summary class="flex justify-between items-center p-6 cursor-pointer list-none">
              <span class="font-semibold" style="color: ${getColor(tokens, 'foreground')}">${q}</span>
              <div class="w-8 h-8 rounded-full flex items-center justify-center transition-colors group-open:rotate-45" style="background: ${getColor(tokens, 'primary')}15">
                <span style="color: ${getColor(tokens, 'primary')}">+</span>
              </div>
            </summary>
            <div class="px-6 pb-6">
              <p style="color: ${getColor(tokens, 'muted')}">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor.</p>
            </div>
          </details>`).join('')}
        </div>
      </div>
    </section>`
  }

  // Minimalist
  return `<section class="py-32 px-6" style="background: ${getColor(tokens, 'background')}">
    <div class="max-w-2xl mx-auto">
      <h2 class="text-2xl font-light mb-12" style="color: ${getColor(tokens, 'foreground')}">${sectionTitle}</h2>
      ${questions.slice(0, 3).map((q, i) => `<details class="group py-6 ${i > 0 ? 'border-t' : ''}" style="border-color: ${getColor(tokens, 'border')}">
        <summary class="flex justify-between items-center cursor-pointer list-none">
          <span style="color: ${getColor(tokens, 'foreground')}">${q}</span>
          <span class="text-sm" style="color: ${getColor(tokens, 'muted')}">+</span>
        </summary>
        <p class="mt-4 text-sm" style="color: ${getColor(tokens, 'muted')}">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      </details>`).join('')}
    </div>
  </section>`
}

// ==================== CTA ====================
function generateCTA(tokens: DesignTokens, style: VariantStyle, prompt: string): string {
  const sectionTitle = pick(headlines.cta)
  const cta = pick(ctaPrimary)

  if (style === 'editorial') {
    return `<section class="py-32 px-6" style="background: ${getColor(tokens, 'background')}">
      <div class="max-w-3xl mx-auto text-center">
        <p class="text-xs tracking-[0.4em] uppercase mb-6" style="color: ${getColor(tokens, 'muted')}">Ready?</p>
        <h2 class="text-4xl md:text-6xl font-light mb-8" style="color: ${getColor(tokens, 'foreground')}">${sectionTitle}</h2>
        <p class="text-lg mb-12" style="color: ${getColor(tokens, 'muted')}">${pick(subheadlines)}</p>
        <button class="px-12 py-4 text-sm tracking-wide uppercase" style="border: 1px solid ${getColor(tokens, 'border')}; color: ${getColor(tokens, 'foreground')}">${cta}</button>
      </div>
    </section>`
  }

  if (style === 'action') {
    return `<section class="py-24 px-6" style="background: ${getColor(tokens, 'primary')}">
      <div class="max-w-4xl mx-auto text-center">
        <h2 class="text-4xl md:text-5xl font-bold mb-6" style="color: ${getColor(tokens, 'primary-foreground')}">${sectionTitle}</h2>
        <p class="text-xl mb-10 opacity-90" style="color: ${getColor(tokens, 'primary-foreground')}">${pick(subheadlines)}</p>
        <div class="flex flex-wrap justify-center gap-4">
          <button class="px-10 py-4 font-semibold rounded-xl" style="background: ${getColor(tokens, 'background')}; color: ${getColor(tokens, 'foreground')}">${cta}</button>
          <button class="px-10 py-4 font-semibold rounded-xl border-2" style="border-color: ${getColor(tokens, 'primary-foreground')}; color: ${getColor(tokens, 'primary-foreground')}">Learn More</button>
        </div>
      </div>
    </section>`
  }

  // Minimalist
  return `<section class="py-32 px-6" style="background: ${getColor(tokens, 'card')}">
    <div class="max-w-xl mx-auto">
      <h2 class="text-2xl font-light mb-6" style="color: ${getColor(tokens, 'foreground')}">${sectionTitle}</h2>
      <div class="flex items-center gap-6">
        <input type="email" placeholder="Enter your email" class="flex-1 px-0 py-3 bg-transparent border-0 border-b focus:outline-none" style="border-color: ${getColor(tokens, 'border')}; color: ${getColor(tokens, 'foreground')}">
        <button class="text-sm tracking-wide uppercase" style="color: ${getColor(tokens, 'foreground')}">Subscribe →</button>
      </div>
    </div>
  </section>`
}

// ==================== NAVBAR ====================
function generateNavbar(tokens: DesignTokens, style: VariantStyle, prompt: string): string {
  const links = shuffle(navLinks).slice(0, randomBetween(3, 5))
  const cta = pick(ctaPrimary)

  if (style === 'editorial') {
    return `<nav class="py-6 px-6" style="background: ${getColor(tokens, 'background')}; border-bottom: 1px solid ${getColor(tokens, 'border')}">
      <div class="max-w-6xl mx-auto flex items-center justify-between">
        <a href="#" class="text-lg tracking-wide" style="color: ${getColor(tokens, 'foreground')}">BRAND</a>
        <div class="hidden md:flex items-center gap-10">
          ${links.map(link => `<a href="#" class="text-sm tracking-wide uppercase hover:opacity-60 transition-opacity" style="color: ${getColor(tokens, 'muted')}">${link}</a>`).join('')}
        </div>
        <a href="#" class="text-sm tracking-wide uppercase" style="color: ${getColor(tokens, 'foreground')}">${cta}</a>
      </div>
    </nav>`
  }

  if (style === 'action') {
    return `<nav class="py-4 px-6" style="background: ${getColor(tokens, 'background')}; border-bottom: 1px solid ${getColor(tokens, 'border')}">
      <div class="max-w-6xl mx-auto flex items-center justify-between">
        <a href="#" class="text-xl font-bold" style="color: ${getColor(tokens, 'foreground')}">Brand</a>
        <div class="hidden md:flex items-center gap-8">
          ${links.map(link => `<a href="#" class="text-sm font-medium hover:opacity-70 transition-opacity" style="color: ${getColor(tokens, 'foreground')}">${link}</a>`).join('')}
        </div>
        <button class="px-6 py-2.5 text-sm font-semibold rounded-lg" style="background: ${getColor(tokens, 'primary')}; color: ${getColor(tokens, 'primary-foreground')}">${cta}</button>
      </div>
    </nav>`
  }

  // Minimalist
  return `<nav class="py-8 px-6" style="background: ${getColor(tokens, 'background')}">
    <div class="max-w-6xl mx-auto flex items-center justify-between">
      <a href="#" class="text-sm uppercase tracking-widest" style="color: ${getColor(tokens, 'foreground')}">Brand</a>
      <div class="flex items-center gap-8">
        ${links.slice(0, 3).map(link => `<a href="#" class="text-sm" style="color: ${getColor(tokens, 'muted')}">${link}</a>`).join('')}
      </div>
    </div>
  </nav>`
}

// ==================== FOOTER ====================
function generateFooter(tokens: DesignTokens, style: VariantStyle, prompt: string): string {
  const cols = shuffle(footerCols).slice(0, randomBetween(2, 4))

  if (style === 'editorial') {
    return `<footer class="py-20 px-6" style="background: ${getColor(tokens, 'background')}; border-top: 1px solid ${getColor(tokens, 'border')}">
      <div class="max-w-6xl mx-auto">
        <div class="grid md:grid-cols-4 gap-12 mb-16">
          <div>
            <p class="text-lg tracking-wide mb-4" style="color: ${getColor(tokens, 'foreground')}">BRAND</p>
            <p class="text-sm leading-relaxed" style="color: ${getColor(tokens, 'muted')}">Creating exceptional experiences since 2020.</p>
          </div>
          ${cols.slice(0, 3).map(col => `<div>
            <p class="text-xs tracking-[0.2em] uppercase mb-6" style="color: ${getColor(tokens, 'muted')}">${col.title}</p>
            <ul class="space-y-3">
              ${col.links.slice(0, 4).map(link => `<li><a href="#" class="text-sm hover:opacity-60 transition-opacity" style="color: ${getColor(tokens, 'foreground')}">${link}</a></li>`).join('')}
            </ul>
          </div>`).join('')}
        </div>
        <div class="pt-8 flex justify-between items-center" style="border-top: 1px solid ${getColor(tokens, 'border')}">
          <p class="text-sm" style="color: ${getColor(tokens, 'muted')}">© 2025 Brand. All rights reserved.</p>
        </div>
      </div>
    </footer>`
  }

  if (style === 'action') {
    return `<footer class="py-16 px-6" style="background: ${getColor(tokens, 'card')}">
      <div class="max-w-6xl mx-auto">
        <div class="p-10 rounded-2xl mb-12 flex flex-col md:flex-row justify-between items-center gap-6" style="background: ${getColor(tokens, 'background')}; border: 1px solid ${getColor(tokens, 'border')}">
          <div>
            <h3 class="text-2xl font-bold mb-2" style="color: ${getColor(tokens, 'foreground')}">Stay Updated</h3>
            <p style="color: ${getColor(tokens, 'muted')}">Subscribe to our newsletter for the latest updates.</p>
          </div>
          <div class="flex gap-3">
            <input type="email" placeholder="Enter your email" class="px-4 py-3 rounded-lg w-64" style="background: ${getColor(tokens, 'card')}; border: 1px solid ${getColor(tokens, 'border')}; color: ${getColor(tokens, 'foreground')}">
            <button class="px-6 py-3 rounded-lg font-semibold" style="background: ${getColor(tokens, 'primary')}; color: ${getColor(tokens, 'primary-foreground')}">Subscribe</button>
          </div>
        </div>
        <div class="grid md:grid-cols-5 gap-8 mb-12">
          <div class="md:col-span-2">
            <p class="text-xl font-bold mb-4" style="color: ${getColor(tokens, 'foreground')}">Brand</p>
            <p class="text-sm" style="color: ${getColor(tokens, 'muted')}">Building the future of digital experiences.</p>
          </div>
          ${cols.slice(0, 3).map(col => `<div>
            <p class="font-semibold mb-4" style="color: ${getColor(tokens, 'foreground')}">${col.title}</p>
            <ul class="space-y-2">
              ${col.links.slice(0, 4).map(link => `<li><a href="#" class="text-sm hover:underline" style="color: ${getColor(tokens, 'muted')}">${link}</a></li>`).join('')}
            </ul>
          </div>`).join('')}
        </div>
        <div class="pt-8 text-center" style="border-top: 1px solid ${getColor(tokens, 'border')}">
          <p class="text-sm" style="color: ${getColor(tokens, 'muted')}">© 2025 Brand. All rights reserved.</p>
        </div>
      </div>
    </footer>`
  }

  // Minimalist
  return `<footer class="py-16 px-6" style="background: ${getColor(tokens, 'background')}; border-top: 1px solid ${getColor(tokens, 'border')}">
    <div class="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
      <p class="text-sm uppercase tracking-widest" style="color: ${getColor(tokens, 'foreground')}">Brand</p>
      <div class="flex flex-wrap gap-8">
        ${['About', 'Contact', 'Privacy'].map(link => `<a href="#" class="text-sm" style="color: ${getColor(tokens, 'muted')}">${link}</a>`).join('')}
      </div>
      <p class="text-sm" style="color: ${getColor(tokens, 'muted')}">© 2025</p>
    </div>
  </footer>`
}

// ==================== PROMPT PARSER ====================
interface ParsedPrompt {
  count: number | null
  hasTeam: boolean
  hasPeople: boolean
  hasImage: boolean
  hasVideo: boolean
  hasMap: boolean
  hasForm: boolean
  hasNewsletter: boolean
  columns: number | null
  layout: 'split' | 'centered' | 'grid' | 'cards' | null
  keywords: string[]
}

function parsePrompt(prompt: string): ParsedPrompt {
  const p = prompt.toLowerCase()
  
  // Extract numbers (e.g., "two people", "3 columns", "4 features")
  const numberWords: Record<string, number> = {
    'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
    'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10
  }
  
  let count: number | null = null
  for (const [word, num] of Object.entries(numberWords)) {
    if (p.includes(word)) count = num
  }
  const numMatch = p.match(/(\d+)\s*(people|person|team|member|column|card|feature|item|tier|plan|testimonial|review)/i)
  if (numMatch) count = parseInt(numMatch[1])
  
  // Extract column count
  let columns: number | null = null
  const colMatch = p.match(/(\d+)\s*col/i) || p.match(/(two|three|four|five)\s*col/i)
  if (colMatch) {
    columns = numberWords[colMatch[1].toLowerCase()] || parseInt(colMatch[1])
  }
  
  // Detect layout preferences
  let layout: 'split' | 'centered' | 'grid' | 'cards' | null = null
  if (p.includes('split') || p.includes('side by side') || p.includes('two column')) layout = 'split'
  if (p.includes('center') || p.includes('centred')) layout = 'centered'
  if (p.includes('grid') || p.includes('bento')) layout = 'grid'
  if (p.includes('card')) layout = 'cards'
  
  return {
    count,
    hasTeam: p.includes('team') || p.includes('people') || p.includes('person') || p.includes('member') || p.includes('staff'),
    hasPeople: p.includes('people') || p.includes('person') || p.includes('member') || p.includes('team'),
    hasImage: p.includes('image') || p.includes('photo') || p.includes('picture') || p.includes('visual'),
    hasVideo: p.includes('video') || p.includes('play') || p.includes('watch'),
    hasMap: p.includes('map') || p.includes('location') || p.includes('address') || p.includes('office'),
    hasForm: p.includes('form') || p.includes('input') || p.includes('field'),
    hasNewsletter: p.includes('newsletter') || p.includes('subscribe') || p.includes('email signup'),
    columns,
    layout,
    keywords: p.split(/\s+/).filter(w => w.length > 3),
  }
}

// ==================== SECTION TYPE DETECTION ====================
function detectSectionType(prompt: string): string {
  const p = prompt.toLowerCase()
  if (p.includes('nav') || p.includes('header') || p.includes('menu')) return 'navbar'
  if (p.includes('hero') || p.includes('banner') || p.includes('landing') || p.includes('above the fold')) return 'hero'
  if (p.includes('feature') || p.includes('benefit') || p.includes('capability') || p.includes('what we offer')) return 'features'
  if (p.includes('price') || p.includes('pricing') || p.includes('plan') || p.includes('subscription')) return 'pricing'
  if (p.includes('testimonial') || p.includes('review') || p.includes('quote') || p.includes('social proof')) return 'testimonials'
  if (p.includes('contact') || p.includes('get in touch') || p.includes('reach out') || p.includes('form')) return 'contact'
  if (p.includes('faq') || p.includes('question') || p.includes('accordion')) return 'faq'
  if (p.includes('cta') || p.includes('call to action') || p.includes('subscribe') || p.includes('newsletter')) return 'cta'
  if (p.includes('footer')) return 'footer'
  return 'hero'
}

// ==================== MAIN GENERATOR ====================
const generators: Record<string, (tokens: DesignTokens, style: VariantStyle, prompt: string) => string> = {
  navbar: generateNavbar,
  hero: generateHero,
  features: generateFeatures,
  pricing: generatePricing,
  testimonials: generateTestimonials,
  contact: generateContact,
  faq: generateFAQ,
  cta: generateCTA,
  footer: generateFooter,
}

const styleConfigs: Record<VariantStyle, { name: string; desc: string }> = {
  editorial: { name: 'The Editorial', desc: 'Refined typography and elegant whitespace' },
  action: { name: 'The Action', desc: 'Bold, conversion-focused design' },
  minimalist: { name: 'The Minimalist', desc: 'Clean and understated aesthetic' },
}

export function generateVariants(
  prompt: string,
  _type: RequestType,
  tokens: DesignTokens
): GeneratedVariant[] {
  const sectionType = detectSectionType(prompt)
  const generator = generators[sectionType] || generators.hero
  const styles: VariantStyle[] = ['editorial', 'action', 'minimalist']

  return styles.map((style) => {
    const config = styleConfigs[style]
    const sectionName = sectionType.charAt(0).toUpperCase() + sectionType.slice(1)
    return {
      id: generateId(),
      name: `${config.name} ${sectionName}`,
      description: config.desc,
      html: generator(tokens, style, prompt),
      style,
      sectionType,
    }
  })
}
