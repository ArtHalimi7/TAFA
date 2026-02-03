# Contact Form Email Setup Guide

## Overview
The contact form is now fully functional and sends emails to **arthalimi989@gmail.com**. When users submit the form, they'll receive a confirmation email, and the admin will get a notification.

## Setup Instructions

### 1. Install Nodemailer Package
Run this command in your backend folder:

```bash
npm install
```

This will install `nodemailer` (already added to package.json).

### 2. Configure Environment Variables
Add these variables to your `.env` file in the backend root:

```env
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASSWORD=your_app_password
```

### 3. Get Gmail App Password (Important!)
**Do NOT use your regular Gmail password.** Follow these steps:

1. Go to your Google Account: https://myaccount.google.com
2. Click "Security" in the left menu
3. Enable "2-Step Verification" if not already enabled
4. Scroll down and find "App passwords"
5. Select "Mail" and "Windows Computer" (or your device)
6. Google will generate a 16-character password
7. Copy that password and paste it as `EMAIL_PASSWORD` in your `.env` file

**Example:**
```env
EMAIL_USER=arthalimi989@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
```

### 4. Frontend Integration (Already Done!)
The Contact.jsx page now:
- ✅ Captures form data (name, email, phone, message)
- ✅ Automatically includes car name if coming from CarDetail page
- ✅ Sends to backend API
- ✅ Shows loading state while sending
- ✅ Displays success/error messages
- ✅ Resets form on success

### 5. Backend Integration (Already Done!)
The contact routes now:
- ✅ Validates email format
- ✅ Saves inquiry to database
- ✅ Sends email to admin (arthalimi989@gmail.com)
- ✅ Sends confirmation email to user
- ✅ Returns proper success/error responses

## Features

### Admin Notification Email
When someone submits the form, the admin receives:
- Sender's name, email, and phone
- Full message
- If from a car page, includes the car name in the message
- Professional HTML formatted email

### User Confirmation Email
The user automatically receives:
- Thank you message
- Confirmation that their inquiry was received
- Expected response time (24 hours)
- Contact phone number

## Testing

### Test the Form:
1. Go to `/contact` page
2. Or click "Schedule Viewing" on any car detail page
3. Fill in the form
4. Click "Send Message"
5. You should see "Sent!" confirmation
6. Check your email for the confirmation

### Test Email Receipt:
- Admin emails go to: **arthalimi989@gmail.com**
- User confirmation goes to: The email entered in the form

## Troubleshooting

### "Failed to submit your inquiry" error:
- Check if `.env` file has `EMAIL_USER` and `EMAIL_PASSWORD`
- Verify Gmail App Password is correct (16 characters with spaces)
- Make sure backend is running
- Check browser console for more details

### Emails not received:
1. Check spam/junk folder
2. Verify `EMAIL_PASSWORD` is the **App Password**, not regular Gmail password
3. Make sure 2-Factor Authentication is enabled on the Gmail account
4. Check backend console logs for email errors

### Backend won't start:
- Run `npm install` to install nodemailer
- Restart the backend server

## How to Change Email Recipient

If you want emails to go to a different address, update line 30 in `/backend/services/emailService.js`:

```javascript
to: "arthalimi989@gmail.com",  // Change this email address
```

## API Endpoint

**POST** `/api/contact`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+383 44 123 456",
  "message": "I'm interested in the BMW M5"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Inquiry submitted successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+383 44 123 456",
    "message": "I'm interested in the BMW M5",
    "status": "new",
    "created_at": "2026-02-03T10:30:00Z"
  }
}
```

## Database
Inquiries are saved in the `contact_inquiries` table with:
- `id` - Unique inquiry ID
- `car_id` - Optional car reference
- `name` - Sender's name
- `email` - Sender's email
- `phone` - Sender's phone
- `message` - Inquiry message
- `status` - "new", "read", "replied", or "archived"
- `created_at` - Submission timestamp

You can view inquiries at `/api/contact` (admin endpoint) or in the Database via dashboard.
