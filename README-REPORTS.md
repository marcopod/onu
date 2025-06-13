# 📋 Harassment Reports Feature

## Overview

A comprehensive harassment reporting system that allows users to report incidents, view reports, and manage them with proper access controls. The system includes user search, evidence file uploads, status management, and admin controls.

## ✅ Features Implemented

### 🗄️ Database Schema
- **`harassment_reports`** table for storing report data
- **`report_evidence_files`** table for evidence attachments
- Proper foreign key relationships and constraints
- Support for both registered user reports and anonymous reports

### 🔐 Authentication & Authorization
- JWT-based authentication integration
- Role-based access control (admin vs regular users)
- Protected routes for reports functionality
- User search with privacy controls

### 📝 Report Creation (`/report`)
- Enhanced form with user selection capability
- Category and subcategory classification system
- Evidence file upload support (images, documents, audio)
- Location and incident date tracking
- Public/private visibility options
- Real-time form validation

### 📊 Reports Dashboard (`/reports`)
- View all user's reports and public reports
- Admin view shows all reports in the system
- Advanced filtering by status, category, and search
- Responsive card-based layout
- Status badges and visual indicators

### 👁️ Report Details (`/reports/[id]`)
- Detailed view of individual reports
- Evidence file viewing and downloading
- Admin status management controls
- Proper access control (own reports + public reports)
- Timestamp tracking

### 🔍 User Search
- Search users by name or email for reporting
- Excludes current user from results
- Only shows verified users
- Privacy-focused with limited results

## 🛠️ Technical Implementation

### API Endpoints

#### Reports Management
- `POST /api/reports` - Create new harassment report
- `GET /api/reports` - Get user's reports (with admin override)
- `GET /api/reports/[id]` - Get specific report details
- `PATCH /api/reports/[id]` - Update report status (admin only)

#### User Search
- `GET /api/users/search?q={query}` - Search users for reporting

### Database Functions

#### Report Operations
```typescript
createHarassmentReport(reportData) // Create new report with evidence
getHarassmentReports(userId, isAdmin) // Get reports with access control
getHarassmentReportById(reportId, userId, isAdmin) // Get single report
updateHarassmentReportStatus(reportId, status, userId, isAdmin) // Admin status update
```

#### User Management
```typescript
searchUsers(query, currentUserId) // Search users excluding current user
```

### File Upload Integration
- Reuses existing file upload system
- Support for multiple evidence files per report
- File type validation (images, PDFs, audio)
- Temporary upload with permanent storage after submission

## 🎨 UI Components

### Navigation Integration
- Added reports icon to bottom navigation across all pages
- Consistent navigation experience
- Active state indicators

### Form Components
- Enhanced report creation form with user search
- File upload with progress indicators
- Category/subcategory selection with descriptions
- Date picker for incident dates
- Radio buttons for visibility settings

### Dashboard Components
- Filterable reports list
- Status badges with color coding
- Search functionality
- Responsive card layout
- Empty state handling

## 🔒 Security Features

### Access Control
- Users can only view their own reports and public reports
- Admins can view all reports and update statuses
- Proper authentication checks on all endpoints
- Protected routes via middleware

### Data Privacy
- Reporter information only visible to admins
- Optional anonymous reporting
- Public/private visibility controls
- Secure file upload handling

### Input Validation
- Server-side validation for all inputs
- Minimum description length requirements
- File type and size restrictions
- SQL injection prevention

## 📱 User Experience

### Report Creation Flow
1. Navigate to `/report` from navigation or home page
2. Optionally search and select user to report
3. Choose harassment category and subcategory
4. Fill in detailed description (minimum 50 characters)
5. Add location and incident date (optional)
6. Upload evidence files (optional)
7. Choose visibility (private/public)
8. Submit report

### Report Management Flow
1. Navigate to `/reports` from navigation
2. View list of own reports and public reports
3. Filter by status, category, or search terms
4. Click on report to view details
5. Admins can update report status

### Admin Features
- View all reports in the system
- Update report status (pending → reviewed → resolved/dismissed)
- Access to reporter contact information
- Bulk management capabilities

## 🚀 Usage Examples

### Creating a Report
```typescript
const reportData = {
  reportedUserId: 123,
  category: "acoso-escolar",
  subcategory: "verbal",
  description: "Detailed description of the incident...",
  location: "School cafeteria",
  incidentDate: "2024-01-15",
  isPublic: false,
  evidenceFiles: [...]
};
```

### Admin Status Update
```typescript
await fetch(`/api/reports/${reportId}`, {
  method: 'PATCH',
  body: JSON.stringify({ status: 'resolved' })
});
```

## 🔧 Configuration

### Admin Detection
Currently uses simple email-based detection:
- Emails containing "admin"
- Emails ending with "@admin.com"
- Specific admin email: "admin@example.com"

**Note**: Enhance this with a proper role-based system in production.

### File Upload Limits
- Maximum file size: 20MB per file
- Supported formats: JPG, PNG, PDF, MP3, WAV
- Multiple files allowed per report

## 🧪 Testing

### Manual Testing Steps
1. **Authentication**: Ensure only logged-in users can access reports
2. **Report Creation**: Test form validation and file uploads
3. **User Search**: Verify search functionality and privacy
4. **Access Control**: Test that users can only see appropriate reports
5. **Admin Functions**: Test status updates with admin account
6. **Navigation**: Verify all navigation links work correctly

### Test Data
The system includes sample harassment categories and subcategories for testing. Real data will be created through user interactions.

## 🔄 Future Enhancements

### Potential Improvements
- Email notifications for status updates
- Report analytics and statistics
- Bulk actions for admins
- Advanced filtering options
- Report templates
- Integration with external reporting systems
- Mobile app optimization
- Real-time updates with WebSockets

### Database Optimizations
- Indexing for better search performance
- Archiving old reports
- Data retention policies
- Backup and recovery procedures

## 📞 Support

For issues or questions about the reports feature:
1. Check the console for error messages
2. Verify database connectivity
3. Ensure proper authentication
4. Review access permissions

The system is designed to be robust and user-friendly while maintaining security and privacy standards.
