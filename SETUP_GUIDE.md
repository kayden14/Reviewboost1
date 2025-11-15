# ReviewBoost Setup Guide

## Quick Start

### 1. Environment Variables

Create a `.env` file in the root directory:

```bash
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

You can find these values in your Supabase project dashboard under Settings > API.

### 2. Install Dependencies

```bash
npm install
```

### 3. Database Setup

The database schema has already been applied to your Supabase instance. The following tables are ready:

- `profiles` - User accounts
- `freelancer_profiles` - Freelancer information
- `review_requests` - Review submissions
- `matches` - AI matches
- `notifications` - User notifications
- `resources` - Learning materials
- `contact_messages` - Contact form data

Sample resources have been seeded into the database.

### 4. Run the Application

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Testing the Application

### Create Test Accounts

#### Freelancer Account
1. Go to Sign Up page
2. Create account with role: "Freelancer"
3. Complete profile setup
4. Submit review request

#### Admin Account
1. Go to Sign Up page
2. Create account with role: "Admin"
3. Access admin dashboard
4. Review freelancer profiles and requests

### Test Workflows

#### 1. Freelancer Profile Setup
- Sign up as freelancer
- Navigate to "Set Up Profile"
- Add skills (comma-separated): "JavaScript, React, Node.js"
- Add portfolio URL
- Add credentials
- Submit profile

#### 2. Review Request
- From freelancer dashboard, click "Request Review"
- Fill out review details
- Select package ($50, $100, $200, or $500)
- Choose platforms (Upwork, Fiverr, etc.)
- Submit request

#### 3. Admin Vetting
- Sign in as admin
- Go to admin dashboard
- Click "Freelancers" tab
- Approve or reject freelancer profiles
- Create matches for approved freelancers

#### 4. Review Request Approval
- In admin dashboard, click "Review Requests" tab
- Review submitted requests
- Approve or reject requests
- Mark approved requests as "Issued" when completed

#### 5. Contact Form
- Navigate to Contact page
- Fill out contact form
- Admin can view messages in admin dashboard

#### 6. Chat Support
- Click the floating chat icon (bottom right)
- Send a test message
- Chat provides instant feedback

## Features to Test

### Freelancer Dashboard
- View vetting score
- Track review requests
- Read notifications
- Edit profile
- Request new reviews

### Admin Dashboard
- Approve/reject freelancers
- Create matches
- Approve/reject review requests
- Mark reviews as issued
- Manage contact messages
- View platform statistics

### Notifications
- Profile status changes
- Review request updates
- Match notifications
- Real-time unread count

### Resources Page
- Browse learning resources
- Filter by category
- View recommended resources for rejected freelancers

### Chat Overlay
- Available on all pages
- Responsive design (mobile + desktop)
- Instant feedback messages

## Common Issues

### Database Connection Error
- Verify your Supabase credentials in `.env`
- Check that you're using the correct project URL and anon key
- Ensure your Supabase project is active

### Build Errors
- Run `npm install` to ensure all dependencies are installed
- Clear node_modules and reinstall if needed
- Check that you're using Node.js 18 or higher

### Authentication Issues
- Clear browser local storage
- Check that RLS policies are properly set up in Supabase
- Verify email confirmation is disabled in Supabase Auth settings

## Database Management

### View Data
Use Supabase Table Editor to view and manage data:
1. Go to Supabase Dashboard
2. Click "Table Editor" in sidebar
3. Select a table to view/edit data

### Add Sample Resources
Resources are automatically seeded. To add more:
1. Go to Supabase SQL Editor
2. Use INSERT statements to add new resources

### Reset Data
To clear test data:
```sql
DELETE FROM contact_messages;
DELETE FROM notifications;
DELETE FROM review_requests;
DELETE FROM matches;
DELETE FROM freelancer_profiles;
DELETE FROM profiles WHERE id NOT IN (SELECT id FROM auth.users);
```

## Support

If you encounter issues:
1. Check the browser console for errors
2. Verify environment variables are set correctly
3. Ensure Supabase project is active and accessible
4. Check that RLS policies allow your operations

## Next Steps

1. Customize the color scheme in `tailwind.config.js`
2. Add Stripe integration for real payment processing
3. Implement email notifications with Supabase Edge Functions
4. Add more resources to the resources table
5. Customize the AI matching algorithm
6. Add analytics and reporting features
