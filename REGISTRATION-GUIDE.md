# 📋 Complete Registration Testing Guide

## 🎯 Goal
Test the complete multi-step registration process through the UI at `/register`

## 🚀 Quick Start

1. **Start the development server** (if not already running):
   ```bash
   npm run dev
   ```

2. **Open the registration page**:
   ```
   http://localhost:3000/register
   ```

3. **Follow the step-by-step guide below**

---

## 📝 Step-by-Step Registration Data

### **Step 1: Authentication & Identity** ✅ REQUIRED
```
Full Name: John Doe
Email: newuser@test.com
Password: TestPassword123!
Confirm Password: TestPassword123!

📁 Files (optional for now):
- Identity Document: [Skip for now - upload feature being integrated]
- Profile Photo: [Skip for now - upload feature being integrated]
```

### **Step 2: Personal Information** ⚠️ PARTIALLY REQUIRED
```
Age: 28
Gender: Select any option (required)
Sexual Orientation: [Optional]
Address: 123 Main Street, City, State 12345
Education Level: University
Occupation: Software Developer
Hobbies: Reading, Programming, Hiking
Frequent Places: Home, Office, Gym

📞 Emergency Contacts (at least 1 required):
Contact 1:
- Name: Jane Doe
- Relationship: Sister
- Phone: +1-555-0123

Contact 2 (optional):
- Name: John Smith  
- Relationship: Friend
- Phone: +1-555-0456
```

### **Step 3: Physical Health** ⚠️ OPTIONAL
```
Weight: 70 kg
Height: 175 cm
Blood Type: O+
Disability: No
Chronic Conditions: None
Allergies:
- Medical: Penicillin
- Food: Nuts
- Environmental: Pollen

💊 Current Medications (optional):
- Name: Vitamin D
- Dose: 1000 IU
- Frequency: Daily
```

### **Step 4: Mental Health** ⚠️ OPTIONAL
```
Psychiatric Conditions: None
Anxiety Attacks: No
Anxiety Frequency: [Leave empty if No above]
Family History: No significant mental health history

💊 Psychiatric Medications (optional):
[Leave empty if no conditions]
```

### **Step 5: Harassment Experiences** ⚠️ OPTIONAL
```
If you want to test this step:

Experience 1:
- Category: Verbal
- Location: Public transportation
- Date: 2024-01-15
- Description: [Write at least 100 characters describing an incident]
- Reported to Authorities: No
- Evidence Files: [Skip for now - upload feature being integrated]

Otherwise: Leave all fields empty to skip this step
```

---

## ✅ What Should Happen

### **During Registration:**
1. **Step 1**: Must be completed (email, password, name)
2. **Step 2**: Age and gender are required, at least 1 emergency contact
3. **Steps 3-5**: All optional, can be skipped or partially filled

### **After Successful Registration:**
1. ✅ User account created in database
2. ✅ Automatic login (you'll be redirected)
3. ✅ Only meaningful data saved (empty fields skipped)
4. ✅ Session cookie set for authentication

### **Database Records Created:**
- ✅ **users** table: Basic account info
- ✅ **user_profiles** table: Personal info (if provided)
- ✅ **emergency_contacts** table: Contact info (if provided)
- ✅ **physical_health** table: Health info (if provided)
- ✅ **medications** table: Medication info (if provided)
- ✅ **mental_health** table: Mental health info (if provided)
- ✅ **harassment_experiences** table: Experience info (if provided)

---

## 🔍 Verification Steps

### **1. Check Registration Success:**
- Look for success message
- Verify automatic login/redirect
- Check that you can access authenticated pages

### **2. Verify Database Storage:**
```bash
node quick-db-check.js
```

### **3. Test Login:**
- Logout if needed
- Go to `/login`
- Use the same email/password from registration
- Should login successfully

---

## 🚨 Troubleshooting

### **"Duplicate email" Error:**
```bash
# Clear test users and try again
node clear-test-users.js
```

### **"Validation Error":**
- Make sure Step 1 is completely filled
- Ensure password meets requirements (8+ chars, uppercase, lowercase, numbers)
- Check that at least 1 emergency contact is provided in Step 2

### **"Server Error":**
- Check that `npm run dev` is running
- Verify database connection in terminal logs

---

## 🎉 Success Criteria

✅ **Registration completes without errors**  
✅ **User is automatically logged in**  
✅ **Database contains user data**  
✅ **Login/logout works**  
✅ **Only meaningful data is saved (empty fields skipped)**

---

## 📞 Quick Test Data (Copy-Paste Ready)

**For Step 1:**
```
Name: Test User
Email: quicktest@test.com  
Password: TestPass123!
```

**For Step 2:**
```
Age: 25
Gender: Other
Emergency Contact: Emergency Person, Friend, +1234567890
```

**Skip Steps 3-5 or fill minimally to test the "skip empty data" logic.**
