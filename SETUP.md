# Custom Sign Up Flow - Setup Instructions

This project demonstrates a custom authentication flow using Clerk 3 (v6.x) hooks.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Get your Clerk publishable key:**
   - Go to [https://dashboard.clerk.com](https://dashboard.clerk.com)
   - Sign in or create an account
   - Create a new application or select an existing one
   - Go to **API Keys** in the sidebar
   - Copy your **Publishable Key**

3. **Configure authentication settings:**
   - In the Clerk Dashboard, navigate to **User & Authentication** → **Email, phone, username**
   - Enable **Email address**
   - Enable **Password**
   - Under **Verification**, make sure **Email verification code** is enabled

4. **Create your `.env` file:**
   ```bash
   cp .env.example .env
   ```
   
   Then edit `.env` and add your Clerk publishable key:
   ```env
   VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_key_here
   ```

5. **Run the development server:**
   ```bash
   npm run dev
   ```

## Custom Components

### CustomSignUp Component
- Custom sign-up form with email, password, first name, and last name
- Email verification flow with code verification
- Uses Clerk 3 hooks: `useSignUp()`
- Includes proper error handling and loading states

### CustomSignIn Component  
- Custom sign-in form with email and password
- Support for MFA and client trust verification
- Uses Clerk 3 hooks: `useSignIn()`
- Includes proper error handling and loading states

## Key Features

- ✅ Email/password authentication
- ✅ Email verification with code
- ✅ Custom UI instead of Clerk's prebuilt components
- ✅ Proper error handling
- ✅ Loading states
- ✅ Toggle between sign-up and sign-in
- ✅ Full TypeScript support

## Clerk 3 (v6.x) API Changes

This project uses the new Clerk 3 API which introduced significant changes:

- `signUp.password()` instead of `signUp.create()`
- `signUp.verifications.sendEmailCode()` instead of `signUp.prepareEmailAddressVerification()`
- `signUp.verifications.verifyEmailCode()` instead of `signUp.attemptEmailAddressVerification()`
- `signUp.finalize()` instead of `setActive()`
- Similar changes for `signIn.password()` and `signIn.finalize()`

## Learn More

- [Clerk Documentation](https://clerk.com/docs)
- [Custom Email/Password Flow Guide](https://clerk.com/docs/custom-flows/email-password)
- [Clerk React Hooks Reference](https://clerk.com/docs/references/react/use-sign-up)
