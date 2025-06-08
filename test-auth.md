# Authentication System Test Guide

## 🧪 Testing the Complete Authentication System

### Prerequisites
1. Set up environment variables in `.env.local`
2. Initialize the database: `npm run init-db`
3. Start the development server: `npm run dev`

### Test Scenarios

#### 1. User Registration Flow
**Test the complete 5-screen registration process:**

1. **Navigate to Registration**
   - Go to `http://localhost:3000/register`
   - Should see Step 1: User Profile & Auth

2. **Step 1: Authentication Data**
   - Fill in:
     - Full Name: "Test User"
     - Email: "test@example.com"
     - Password: "TestPass123"
     - Confirm Password: "TestPass123"
   - Upload identity document (optional)
   - Upload profile photo (optional)
   - Click "Continuar"

3. **Step 2: Personal Information**
   - Fill in:
     - Age: 25
     - Gender: Select any option
     - Add emergency contact with name, relationship, phone
   - Click "Continuar"

4. **Step 3: Physical Health** (Optional)
   - Fill in any health information
   - Click "Continuar"

5. **Step 4: Mental Health** (Optional)
   - Fill in any mental health information
   - Click "Continuar"

6. **Step 5: Previous Experiences** (Optional)
   - Add any harassment experiences or skip
   - Click "Continuar"

7. **Complete Registration**
   - Should automatically submit registration
   - Should show success message
   - Should be logged in automatically
   - Should redirect to home page

#### 2. User Login Flow
**Test login with registered user:**

1. **Navigate to Login**
   - Go to `http://localhost:3000/login`
   - Should see login form

2. **Login with Valid Credentials**
   - Email: "test@example.com"
   - Password: "TestPass123"
   - Click "Iniciar Sesión"
   - Should show success toast
   - Should redirect to home page

3. **Login with Invalid Credentials**
   - Try wrong password
   - Should show error message
   - Should not redirect

#### 3. Route Protection
**Test middleware protection:**

1. **Access Protected Route Without Login**
   - Logout first (if logged in)
   - Try to access `http://localhost:3000/profile`
   - Should redirect to `/login?redirect=/profile`

2. **Access Protected Route With Login**
   - Login first
   - Access `http://localhost:3000/profile`
   - Should allow access

3. **Access Auth Routes While Logged In**
   - While logged in, try to access `/login`
   - Should redirect to home page

#### 4. Session Management
**Test session persistence:**

1. **Session Persistence**
   - Login and refresh the page
   - Should remain logged in
   - Check browser cookies for `auth-token`

2. **Logout**
   - Click logout (if available in UI)
   - Or manually call `/api/auth/logout`
   - Should clear session
   - Should redirect to login for protected routes

### API Testing

#### Test API Endpoints Directly

1. **Registration API**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "step1": {
      "fullName": "API Test User",
      "email": "apitest@example.com",
      "password": "ApiTest123",
      "confirmPassword": "ApiTest123"
    }
  }'
```

2. **Login API**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "apitest@example.com",
    "password": "ApiTest123"
  }'
```

3. **Get Current User**
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Cookie: auth-token=YOUR_TOKEN_HERE"
```

4. **Logout API**
```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Cookie: auth-token=YOUR_TOKEN_HERE"
```

### Database Verification

**Check data was stored correctly:**

1. **Connect to your database** (Vercel Postgres dashboard or local client)

2. **Verify user creation:**
```sql
SELECT * FROM users WHERE email = 'test@example.com';
```

3. **Check profile data:**
```sql
SELECT * FROM user_profiles WHERE user_id = (
  SELECT id FROM users WHERE email = 'test@example.com'
);
```

4. **Check emergency contacts:**
```sql
SELECT * FROM emergency_contacts WHERE user_id = (
  SELECT id FROM users WHERE email = 'test@example.com'
);
```

### Expected Results

#### ✅ Successful Registration
- User record created in `users` table
- Profile data stored in `user_profiles` table
- Emergency contacts stored in `emergency_contacts` table
- Health data stored in respective tables
- JWT token generated and stored in cookie
- User automatically logged in

#### ✅ Successful Login
- Password verified against hash
- JWT token generated
- Session created in `user_sessions` table
- Cookie set with token
- User redirected appropriately

#### ✅ Route Protection Working
- Unauthenticated users redirected to login
- Authenticated users can access protected routes
- Auth routes redirect logged-in users to home

#### ✅ Session Management
- Sessions persist across page refreshes
- Logout properly clears sessions
- Expired sessions are handled gracefully

### Troubleshooting

#### Common Issues

1. **Database Connection Errors**
   - Check environment variables
   - Verify database is accessible
   - Run `npm run init-db` to create tables

2. **JWT Errors**
   - Check `JWT_SECRET` is set
   - Verify token format in cookies

3. **Registration Fails**
   - Check all required fields are provided
   - Verify password meets requirements
   - Check database constraints

4. **Login Fails**
   - Verify user exists in database
   - Check password hash comparison
   - Verify email format

### Security Verification

#### Check Security Features

1. **Password Hashing**
   - Passwords should be hashed in database
   - Should use bcryptjs with salt rounds

2. **JWT Security**
   - Tokens should be HTTP-only cookies
   - Should have appropriate expiration
   - Should be invalidated on logout

3. **Input Validation**
   - Email format validation
   - Password strength requirements
   - SQL injection protection

4. **Session Security**
   - Sessions tracked in database
   - Expired sessions cleaned up
   - Multiple sessions supported

This completes the authentication system testing guide. The system should now be fully functional and ready for production deployment!
