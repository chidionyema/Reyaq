# REYAQ Landing Page

A beautiful, production-ready landing page for REYAQ - the first co-creation platform.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Build for Production

```bash
npm run build
npm start
```

## 🚢 Deploy to Vercel

### Option 1: Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

### Option 2: GitHub Integration

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Vercel will automatically detect Next.js and deploy

### Option 3: Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your Git repository
4. Vercel will auto-configure everything

## 📧 Email Capture Setup

The email capture form currently uses a placeholder API route at `/app/api/subscribe/route.ts`.

To integrate with a real email service:

### Using Resend (Recommended)

1. Install Resend:
```bash
npm install resend
```

2. Get your API key from [resend.com](https://resend.com)

3. Update `app/api/subscribe/route.ts`:
```typescript
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// In your POST handler:
await resend.emails.send({
  from: 'onboarding@resend.dev',
  to: email,
  subject: 'Welcome to Reyaq',
  html: '<p>Thanks for joining!</p>',
})

// Also save to your database
```

### Using Other Services

- **SendGrid**: Use `@sendgrid/mail`
- **Mailchimp**: Use `@mailchimp/mailchimp_marketing`
- **ConvertKit**: Use their REST API

## 🎨 Customization

### Colors

Edit `tailwind.config.ts` to modify brand colors:
- `reyaq-violet`: #9A4DF3
- `reyaq-ember`: #FFB267
- `pulse-pink`: #EB4CC0
- `mist-white`: #F6F4F9
- `ink-shadow`: #1A1A1F

### Typography

The project uses Inter font from Google Fonts. To change, update:
1. `app/globals.css` - Import statement
2. `tailwind.config.ts` - Font family configuration

## 📁 Project Structure

```
reyaq/
├── app/
│   ├── api/
│   │   └── subscribe/
│   │       └── route.ts      # Email capture API
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page
├── components/
│   ├── Hero.tsx              # Hero section
│   ├── Features.tsx          # How it works
│   ├── WhyReyaq.tsx          # Feature cards
│   ├── Vision.tsx            # Vision section
│   ├── EmailCapture.tsx      # Email form
│   └── Footer.tsx            # Footer
├── tailwind.config.ts        # Tailwind configuration
├── tsconfig.json             # TypeScript config
└── package.json              # Dependencies
```

## 🎭 Animations

The project includes custom animations:
- `fade-in`: Gentle fade in
- `fade-in-up`: Fade in with upward motion
- `pulse-soft`: Subtle pulsing effect
- `drift`: Slow drifting motion for orbs
- `spark`: Sparkle animation

All animations are defined in `tailwind.config.ts`.

## 🔧 Environment Variables

Create a `.env.local` file for production:

```env
RESEND_API_KEY=your_key_here
DATABASE_URL=your_database_url
```

## 📝 License

Private - All rights reserved.

---

**Made for moments.** ✨

