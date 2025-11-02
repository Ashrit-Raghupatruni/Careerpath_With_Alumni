# Dikshuch - Alumni Career Recommendation System

A comprehensive AI-powered career guidance platform connecting students with successful alumni. Built with React, TypeScript, Tailwind CSS, and Supabase.

## 🌟 Features

### Core Features

- **Career Quiz System** - 10-question assessment with AI-powered alumni matching
- **Alumni Directory** - Searchable database of 20+ successful alumni from top companies
- **Student Profile Management** - Complete profile system with skills, interests, and certifications
- **Resume Builder** - Interactive resume builder with real-time preview and download
- **AI Resume Generator** - Generate professional resumes from LinkedIn profiles
- **Skill Learning Pathways** - 8 curated learning paths with resources
- **Analytics Dashboard** - Real-time analytics and insights
- **Admin Panel** - Complete administrative controls
- **Pricing Plans** - Three subscription tiers (Free, Pro, Enterprise)
- **Contact & Feedback** - User feedback system with ratings

### Technical Features

- **Authentication** - Google OAuth 2.0 via Supabase Auth
- **Dark Mode** - System-wide dark mode with persistence
- **Responsive Design** - Mobile-first responsive design
- **Database** - Supabase PostgreSQL with Row Level Security
- **TypeScript** - Fully typed codebase
- **Modern UI** - Animated gradients and smooth transitions

## 🏗️ Tech Stack

- **Frontend:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth (Google OAuth)
- **Icons:** Lucide React
- **Routing:** React Router v6

## 📊 Database Schema

The system includes 12 tables:

1. `alumni` - Alumni information and career details
2. `student_profiles` - Student profile data
3. `quiz_responses` - Career quiz results and matches
4. `feedback` - User feedback and ratings
5. `analytics_events` - System analytics tracking
6. `moderation_logs` - Admin action logs
7. `skill_pathways` - Learning path resources
8. `mentor_connections` - Student-alumni connections
9. `admin_users` - Admin accounts
10. `student_goals` - Student career goals
11. `user_subscriptions` - Subscription management
12. `payment_history` - Payment tracking

All tables have Row Level Security (RLS) enabled with appropriate policies.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd dikshuch
```

2. Install dependencies:

```bash
npm install
```

3. Environment variables are already configured in `.env`:

```
VITE_SUPABASE_URL=<your-supabase-url>
VITE_SUPABASE_ANON_KEY=<your-anon-key>
```

4. Run development server:

```bash
npm run dev
```

5. Build for production:

```bash
npm run build
```

## 📱 Pages & Routes

- `/` - Home page with hero section and career quiz
- `/dashboard` - Alumni directory with analytics
- `/profile` - Student profile management
- `/resume` - Resume builder
- `/ai-resume` - AI-powered resume generator
- `/skills` - Learning pathways
- `/pricing` - Subscription plans
- `/contact` - Contact and feedback form
- `/about` - About the platform
- `/admin` - Admin panel

## 🎨 Design System

### Colors

- Primary: Purple (600) to Pink (600) gradient
- Secondary: Gray scale
- Accent colors for different features

### Typography

- Headings: Poppins (600-800)
- Body: Inter (300-700)

### Components

- Cards with hover effects
- Gradient backgrounds
- Floating blob animations
- Smooth transitions

## 🔐 Authentication

Google OAuth 2.0 is configured through Supabase. Users can:

- Sign in with Google
- Access protected routes (Dashboard, Profile)
- Track their quiz results and matches

## �� Bundle Size

- Total build size: ~447 KB
- Main JS bundle: 423 KB (116 KB gzipped)
- CSS bundle: 33 KB (6 KB gzipped)

## 🏫 About

Dikshuch is developed for SRM University AP to provide students with AI-driven career guidance and alumni mentorship opportunities.

### SRM University AP

- Website: https://srmap.edu.in
- Integrated throughout the platform

## 📄 License

© 2025 Dikshuch Alumni Career Recommendation System. All rights reserved.

## 🤝 Contributing

This is a university project. For inquiries, contact support@dikshuch.edu

## 🐛 Known Issues

- AI resume generation uses mock data (LinkedIn API integration pending)
- Payment processing is placeholder (Stripe integration pending)
- Admin CRUD operations show basic UI (full implementation available)

## 🔄 Future Enhancements

- Real LinkedIn profile parsing
- Live payment processing
- Advanced analytics visualizations
- Mobile app version
- Real-time chat with alumni
- Video mentorship sessions
