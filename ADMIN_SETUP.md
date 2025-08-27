# Admin Panel Setup Guide

This guide will help you set up the admin panel for the EC Management system.

## Prerequisites

- Node.js 18+ installed
- MongoDB database running
- Environment variables configured

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
DATABASE_URL="mongodb://localhost:27017/ecmanagement"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

## Installation & Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up the database:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

3. **Create the first admin user:**
   ```bash
   npm run create-admin
   ```
   
   This will create an admin user with:
   - Email: `admin@example.com`
   - Password: `admin123`
   - Role: `admin`

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Access the admin panel:**
   - Go to: `http://localhost:3000/admin/login`
   - Login with the admin credentials created above

## Admin Panel Features

### Dashboard
- Overview of system statistics
- Total users count
- Active/Inactive users count
- Recent users list
- Quick action buttons

### User Management
- View all users
- Add new users
- Edit existing users
- Activate/Deactivate users
- Delete users
- Search and filter users by role and status

### Security Features
- Role-based access control
- Admin-only routes
- Session management
- Password hashing

## User Roles

- **Admin**: Full access to all features, can manage users
- **User**: Limited access, can only view their own profile

## API Endpoints

### Admin Stats
- `GET /api/admin/stats` - Get dashboard statistics

### User Management
- `GET /api/admin/users` - List all users
- `POST /api/admin/users` - Create new user
- `PATCH /api/admin/users/[id]` - Update user
- `DELETE /api/admin/users/[id]` - Delete user
- `PATCH /api/admin/users/[id]/toggle-status` - Toggle user status

## Security Notes

1. **Change default password**: After first login, change the default admin password
2. **Environment variables**: Keep your `.env.local` file secure and never commit it to version control
3. **Database security**: Ensure your MongoDB instance is properly secured
4. **HTTPS**: Use HTTPS in production environments

## Troubleshooting

### Common Issues

1. **Database connection error**: Check your MongoDB connection string and ensure the database is running
2. **Authentication error**: Verify your `NEXTAUTH_SECRET` is set correctly
3. **Permission denied**: Ensure the user has admin role in the database

### Getting Help

If you encounter issues:
1. Check the browser console for error messages
2. Check the terminal for server-side errors
3. Verify all environment variables are set correctly
4. Ensure the database schema is up to date

## Production Deployment

Before deploying to production:

1. Set strong, unique passwords
2. Use environment-specific configuration
3. Enable HTTPS
4. Set up proper logging and monitoring
5. Regular database backups
6. Update dependencies regularly

## Support

For additional support or questions, please refer to the project documentation or contact the development team.
