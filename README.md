# EC Management System - Admin Panel

A comprehensive Election Commission Management System with a powerful admin panel for user management.

## Features

### 🚀 Admin Panel
- **Secure Login System**: Role-based authentication with admin privileges
- **Dashboard**: Real-time statistics and overview of the system
- **User Management**: Add, edit, delete, and manage user accounts
- **Role Management**: Assign admin or user roles to accounts
- **Status Control**: Activate/deactivate user accounts
- **Search & Filter**: Advanced user search and filtering capabilities

### 🔐 Security Features
- **NextAuth.js Integration**: Secure authentication system
- **Role-based Access Control**: Admin-only routes and functionality
- **Password Hashing**: Secure password storage with bcrypt
- **Session Management**: JWT-based session handling
- **Protected API Routes**: All admin endpoints require authentication

### 📊 Dashboard Features
- Total users count
- Active/Inactive users statistics
- Recent users list
- Quick action buttons
- Responsive design for all devices

### 👥 User Management
- **Create Users**: Comprehensive user registration form
- **Edit Users**: Modify user information and settings
- **Delete Users**: Remove user accounts (with confirmation)
- **Status Toggle**: Activate/deactivate user accounts
- **Bulk Operations**: Efficient management of multiple users

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js
- **Database**: MongoDB with Prisma ORM
- **Password Hashing**: bcryptjs
- **Development**: Biome for linting and formatting

## Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB database
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ecmanagement
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Create the first admin user**
   ```bash
   npm run create-admin
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Access the admin panel**
   - Go to: `http://localhost:3000/admin/login`
   - Login with: `admin@example.com` / `admin123`

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# Database
DATABASE_URL="mongodb://localhost:27017/ecmanagement"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Facebook OAuth (optional)
FACEBOOK_CLIENT_ID="your-facebook-client-id"
FACEBOOK_CLIENT_SECRET="your-facebook-client-secret"
```

## API Endpoints

### Admin Authentication
- `POST /api/auth/signin` - Admin login
- `POST /api/auth/signout` - Admin logout

### Admin Dashboard
- `GET /api/admin/stats` - Get dashboard statistics

### User Management
- `GET /api/admin/users` - List all users
- `POST /api/admin/users` - Create new user
- `PATCH /api/admin/users/[id]` - Update user
- `DELETE /api/admin/users/[id]` - Delete user
- `PATCH /api/admin/users/[id]/toggle-status` - Toggle user status

## Database Schema

The system uses MongoDB with the following main models:

- **User**: Complete user profile with role and status
- **Message**: User communication system

## File Structure

```
ecmanagement/
├── app/
│   ├── admin/           # Admin panel pages
│   │   ├── dashboard/   # Admin dashboard
│   │   ├── users/       # User management
│   │   └── layout.tsx   # Admin layout
│   ├── api/             # API endpoints
│   │   ├── admin/       # Admin API routes
│   │   └── auth/        # Authentication routes
│   └── globals.css      # Global styles
├── prisma/              # Database schema
├── scripts/             # Utility scripts
└── public/              # Static assets
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run linting
- `npm run format` - Format code
- `npm run create-admin` - Create admin user

### Code Quality

- **Linting**: Biome for consistent code style
- **Formatting**: Automatic code formatting
- **TypeScript**: Full type safety
- **ESLint**: Code quality rules

## Security Considerations

1. **Change Default Password**: Update admin password after first login
2. **Environment Variables**: Keep `.env.local` secure and never commit
3. **Database Security**: Secure MongoDB instance
4. **HTTPS**: Use HTTPS in production
5. **Regular Updates**: Keep dependencies updated

## Deployment

### Production Checklist

- [ ] Set strong, unique passwords
- [ ] Configure environment variables
- [ ] Enable HTTPS
- [ ] Set up monitoring and logging
- [ ] Configure database backups
- [ ] Test all functionality
- [ ] Update dependencies

### Deployment Options

- **Vercel**: Recommended for Next.js applications
- **Netlify**: Alternative deployment platform
- **Self-hosted**: Docker or traditional hosting

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Support

For support and questions:
- Check the documentation
- Review the setup guide
- Check existing issues
- Create a new issue with details

## License

This project is licensed under the MIT License.

## Acknowledgments

- Next.js team for the amazing framework
- Prisma team for the excellent ORM
- NextAuth.js team for authentication
- Tailwind CSS for the utility-first CSS framework
