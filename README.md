# ReviewBoost - Freelance Verification Platform

ReviewBoost is a comprehensive platform that connects freelancers with verified, skill-validated reviews on leading freelancing platforms. The platform features rigorous vetting, AI-powered matching, and admin-approved review workflows.

## Features

### For Freelancers
- **Profile Management**: Create and manage freelancer profiles with skills, credentials, and portfolio
- **Review Requests**: Submit review requests with secure payment integration
- **Smart Matching**: AI-powered matching engine for optimal review opportunities
- **Status Tracking**: Real-time tracking of vetting, matching, and review status
- **Notifications**: In-app notifications for all status updates
- **Resource Library**: Access curated learning resources for skill improvement

### For Admins
- **Vetting Queue**: Review and approve/reject freelancer profiles
- **Match Management**: Create and manage AI-generated matches
- **Review Approval**: Approve and issue review requests
- **Message Management**: Handle contact form submissions
- **Analytics Dashboard**: Track platform metrics and user activity

### Platform Features
- **Role-Based Access**: Separate interfaces for freelancers and admins
- **Secure Authentication**: Email/password authentication with Supabase
- **Floating Chat**: Persistent chat overlay for instant support
- **Contact Form**: Comprehensive contact system for inquiries
- **Responsive Design**: Full mobile and desktop support
- **Modern UI**: Clean, professional design with Teal and Emerald color scheme

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account

### Environment Setup

1. Create a `.env` file in the project root:

```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

2. Get your Supabase credentials from your Supabase project settings.

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Database Schema

The platform uses the following main tables:

- **profiles**: User accounts with role-based access
- **freelancer_profiles**: Freelancer information, skills, and vetting status
- **review_requests**: Review request submissions with payment tracking
- **matches**: AI-generated matches between freelancers and opportunities
- **notifications**: User notifications for status updates
- **resources**: Learning resources for skill improvement
- **contact_messages**: Contact form submissions

All tables have Row Level Security (RLS) enabled for data protection.

## Usage Guide

### For Freelancers

1. **Sign Up**: Create an account as a freelancer
2. **Set Up Profile**: Add your skills, credentials, and portfolio
3. **Wait for Vetting**: Our AI system evaluates your profile
4. **Request Reviews**: Once approved, submit review requests
5. **Track Progress**: Monitor your requests in the dashboard
6. **Access Resources**: If rejected, access recommended learning materials

### For Admins

1. **Sign Up**: Create an account as an admin
2. **Review Freelancers**: Approve/reject freelancer profiles in the vetting queue
3. **Manage Requests**: Approve review requests and mark as issued
4. **Create Matches**: Generate matches for qualified freelancers
5. **Handle Messages**: Respond to contact form submissions

## Key Workflows

### Freelancer Vetting Process
1. Freelancer submits profile
2. AI matching engine calculates vetting score
3. Admin reviews and approves/rejects
4. Rejected freelancers receive resource recommendations
5. Approved freelancers can submit review requests

### Review Request Process
1. Freelancer submits review request with payment
2. Request enters admin approval queue
3. Admin reviews and approves/rejects request
4. Approved requests are marked for issuance
5. Admin marks review as issued when completed
6. Freelancer receives notifications at each stage

## Color Scheme

- **Primary**: Teal (#14B8A6)
- **Secondary**: Emerald (#10B981)
- **Neutral**: Gray tones for backgrounds and text
- **Accents**: Success (green), Warning (yellow), Error (red)

## Support

For questions or issues:
- Use the floating chat icon for instant messaging
- Submit inquiries via the Contact page
- Email: support@reviewboost.com

## License

Proprietary - All rights reserved
