# 🚀 Deployment Guide - Harassment Reporting PWA

## Vercel Deployment with Postgres Database

### Step 1: Prepare Your Repository

1. **Commit all changes to Git:**
```bash
git add .
git commit -m "Complete authentication system implementation"
git push origin main
```

2. **Ensure your repository is on GitHub, GitLab, or Bitbucket**

### Step 2: Create Vercel Project

1. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**
2. **Click "New Project"**
3. **Import your Git repository**
4. **Configure project settings:**
   - Framework Preset: Next.js
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

### Step 3: Set Up Vercel Postgres Database

1. **In your Vercel project dashboard:**
   - Go to the "Storage" tab
   - Click "Create Database"
   - Select "Postgres"
   - Choose a database name (e.g., `harassment-reporting-db`)
   - Select your preferred region
   - Click "Create"

2. **Get database connection strings:**
   - After creation, go to the database dashboard
   - Copy all the connection strings provided:
     - `POSTGRES_URL`
     - `POSTGRES_PRISMA_URL`
     - `POSTGRES_URL_NO_SSL`
     - `POSTGRES_URL_NON_POOLING`
     - `POSTGRES_USER`
     - `POSTGRES_HOST`
     - `POSTGRES_PASSWORD`
     - `POSTGRES_DATABASE`

### Step 4: Configure Environment Variables

1. **In your Vercel project dashboard:**
   - Go to "Settings" → "Environment Variables"
   - Add the following variables:

```env
# Database Configuration (from Vercel Postgres)
POSTGRES_URL=your-vercel-postgres-url
POSTGRES_PRISMA_URL=your-vercel-postgres-prisma-url
POSTGRES_URL_NO_SSL=your-vercel-postgres-no-ssl-url
POSTGRES_URL_NON_POOLING=your-vercel-postgres-non-pooling-url
POSTGRES_USER=your-postgres-user
POSTGRES_HOST=your-postgres-host
POSTGRES_PASSWORD=your-postgres-password
POSTGRES_DATABASE=your-postgres-database

# JWT Configuration (generate secure random strings)
JWT_SECRET=your-super-secure-jwt-secret-for-production-make-it-very-long-and-random
JWT_EXPIRES_IN=7d

# Next.js Configuration
NEXTAUTH_URL=https://your-vercel-app-url.vercel.app
NEXTAUTH_SECRET=your-nextauth-secret-key
NODE_ENV=production
```

2. **Generate secure secrets:**
   - For `JWT_SECRET`: Use a long random string (64+ characters)
   - For `NEXTAUTH_SECRET`: Use another long random string
   - You can generate these using: `openssl rand -base64 64`

### Step 5: Deploy the Application

1. **Trigger deployment:**
   - Push to your main branch, or
   - Click "Deploy" in Vercel dashboard

2. **Monitor deployment:**
   - Watch the build logs for any errors
   - Deployment should complete successfully

### Step 6: Initialize Database Tables

1. **After successful deployment, initialize the database:**
   - You can do this by making a request to any API endpoint
   - Or create a one-time initialization endpoint

2. **Option A: Automatic initialization**
   - The database tables will be created automatically on first API call
   - Try registering a user to trigger table creation

3. **Option B: Manual initialization**
   - Connect to your Vercel Postgres database
   - Run the SQL commands from `lib/db.ts` manually

### Step 7: Test Production Deployment

1. **Test user registration:**
   - Go to `https://your-app.vercel.app/register`
   - Complete the registration process
   - Verify user is created and logged in

2. **Test user login:**
   - Go to `https://your-app.vercel.app/login`
   - Login with registered credentials
   - Verify successful authentication

3. **Test route protection:**
   - Try accessing protected routes without login
   - Verify redirects work correctly

### Step 8: Configure Custom Domain (Optional)

1. **In Vercel project settings:**
   - Go to "Domains"
   - Add your custom domain
   - Follow DNS configuration instructions

2. **Update environment variables:**
   - Update `NEXTAUTH_URL` to your custom domain
   - Redeploy the application

### Step 9: Set Up Monitoring and Analytics

1. **Enable Vercel Analytics:**
   - Go to "Analytics" tab in project dashboard
   - Enable Web Analytics

2. **Set up error monitoring:**
   - Consider integrating Sentry or similar service
   - Add error tracking to your application

### Production Checklist

#### ✅ Security
- [ ] Strong JWT secret configured
- [ ] Database credentials secured
- [ ] HTTPS enabled (automatic with Vercel)
- [ ] Environment variables properly set
- [ ] No sensitive data in client-side code

#### ✅ Performance
- [ ] Build optimization enabled
- [ ] Static assets optimized
- [ ] Database queries optimized
- [ ] Proper caching headers

#### ✅ Functionality
- [ ] User registration works
- [ ] User login works
- [ ] Route protection works
- [ ] Database operations work
- [ ] All 5 registration steps work
- [ ] Session management works

#### ✅ Monitoring
- [ ] Error tracking configured
- [ ] Analytics enabled
- [ ] Database monitoring set up
- [ ] Performance monitoring enabled

### Troubleshooting Common Issues

#### Database Connection Issues
```bash
# Check if environment variables are set correctly
console.log(process.env.POSTGRES_URL)

# Verify database is accessible
# Check Vercel function logs for connection errors
```

#### Build Failures
```bash
# Check build logs in Vercel dashboard
# Verify all dependencies are in package.json
# Check for TypeScript errors
```

#### Authentication Issues
```bash
# Verify JWT_SECRET is set
# Check cookie settings for production domain
# Verify NEXTAUTH_URL matches your domain
```

#### API Route Issues
```bash
# Check function logs in Vercel dashboard
# Verify API routes are properly configured
# Check for runtime errors
```

### Environment-Specific Configuration

#### Development
```env
NODE_ENV=development
NEXTAUTH_URL=http://localhost:3000
```

#### Production
```env
NODE_ENV=production
NEXTAUTH_URL=https://your-app.vercel.app
```

### Database Management

#### Backup Strategy
- Vercel Postgres includes automatic backups
- Consider additional backup strategies for critical data
- Document data recovery procedures

#### Scaling Considerations
- Monitor database performance
- Consider connection pooling for high traffic
- Plan for database scaling as user base grows

### Security Best Practices

1. **Regular Security Updates:**
   - Keep dependencies updated
   - Monitor security advisories
   - Regular security audits

2. **Data Protection:**
   - Encrypt sensitive data
   - Implement proper access controls
   - Regular security reviews

3. **Monitoring:**
   - Set up alerts for unusual activity
   - Monitor authentication failures
   - Track database performance

Your harassment reporting PWA is now ready for production use with a complete authentication system! 🎉
