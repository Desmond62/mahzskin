# Contact Form Setup Guide

The contact form is now functional! Here's how to complete the setup:

## What's Been Implemented

1. **Contact Page** (`/about/contact-us`)
   - Form with Name, Email, and Comment fields
   - Form validation
   - Success/error messages
   - Loading states

2. **API Route** (`/api/contact`)
   - Handles form submissions
   - Validates input
   - Sends emails via Resend API
   - Fallback for development mode

## Setup Instructions

### Option 1: Using Resend (Recommended - Free tier available)

1. **Sign up for Resend**
   - Go to https://resend.com
   - Create a free account
   - Get your API key from https://resend.com/api-keys

2. **Create `.env.local` file**
   ```bash
   # In the malzskin directory, create .env.local
   RESEND_API_KEY=re_your_actual_api_key_here
   CONTACT_EMAIL=www.mahzskinltd@gmail.com
   ```

3. **Verify your domain (Optional but recommended)**
   - In Resend dashboard, add your domain
   - Add DNS records as instructed
   - Once verified, update the `from` field in `/api/contact/route.ts`:
     ```typescript
     from: "contact@yourdomain.com"
     ```

4. **Restart your development server**
   ```bash
   npm run dev
   ```

### Option 2: Development Mode (No email service)

If you don't set up Resend, the form will still work but messages will only be logged to the console. This is useful for testing.

## Testing the Form

1. Navigate to `/about/contact-us`
2. Fill in the form
3. Click "SUBMIT CONTACT"
4. You should see a success message
5. Check your email (if Resend is configured) or console logs

## Resend Free Tier

- 100 emails per day
- 3,000 emails per month
- Perfect for contact forms

## Alternative Email Services

If you prefer a different service, you can modify `/api/contact/route.ts` to use:
- **SendGrid**: https://sendgrid.com
- **Mailgun**: https://www.mailgun.com
- **Nodemailer**: For custom SMTP

## Security Notes

- Never commit `.env.local` to git (it's already in .gitignore)
- The API route validates all inputs
- Email addresses are validated with regex
- Rate limiting should be added for production

## Troubleshooting

**Form submits but no email received:**
- Check that `RESEND_API_KEY` is set correctly
- Verify the API key is active in Resend dashboard
- Check server logs for errors

**"Failed to send email" error:**
- Verify your Resend API key
- Check if you've exceeded free tier limits
- Ensure `from` email is from a verified domain

**Need help?**
- Resend docs: https://resend.com/docs
- Check the console for error messages
