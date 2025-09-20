# Admin Panel - PKL Management System

A comprehensive admin panel built with Next.js 14, TypeScript, and shadcn/ui components for managing a PKL (Praktik Kerja Lapangan) system.

## Features

### 🎯 Dashboard
- **Statistics Overview**: Real-time statistics showing total users, teachers, students, departments, classes, and industry partners
- **System Status**: Monitor system health and data freshness
- **Quick Actions**: Direct access to all management sections

### 👥 User Management
- **Guru Management**: Manage teacher accounts with role assignments (Koordinator, Pembimbing, Wali Kelas, Kaprog)
- **Siswa Management**: Manage student accounts and information
- **Role-based Access**: Different login methods for Admin, Guru, and Siswa

### 📚 Academic Management
- **Jurusan Management**: Manage study programs and departments
- **Kelas Management**: Manage classes and their assignments to departments
- **Industri Management**: Manage industry partners and placement opportunities

### 🔧 Technical Features
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Real-time Data**: Live data from backend API
- **Search & Filter**: Advanced search and filtering capabilities
- **CRUD Operations**: Create, Read, Update, Delete for all entities
- **Authentication**: Secure login with JWT tokens
- **Error Handling**: Comprehensive error handling and user feedback

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, React
- **UI Components**: shadcn/ui, Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Hooks
- **API Integration**: Custom API service layer
- **Authentication**: JWT-based authentication

## Project Structure

```
src/
├── app/
│   ├── (Auth)/
│   │   ├── login/
│   │   │   └── page.tsx          # Login page
│   │   └── admin/                # Admin routes
│   │       ├── page.tsx          # Dashboard
│   │       ├── guru/
│   │       │   └── page.tsx      # Guru management
│   │       ├── siswa/
│   │       │   └── page.tsx      # Siswa management
│   │       ├── jurusan/
│   │       │   └── page.tsx      # Jurusan management
│   │       ├── kelas/
│   │       │   └── page.tsx      # Kelas management
│   │       └── industri/
│   │           └── page.tsx      # Industri management
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── ui/                       # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── table.tsx
│   │   ├── badge.tsx
│   │   ├── dropdown-menu.tsx
│   │   └── avatar.tsx
│   ├── admin-layout.tsx          # Admin layout with navigation
│   ├── data-table.tsx            # Reusable data table component
│   ├── login-form.tsx            # Login form component
│   └── statistics-card.tsx       # Statistics card component
└── lib/
    ├── api.ts                    # API service layer
    └── utils.ts                  # Utility functions
```

## API Integration

The admin panel integrates with the backend API at `http://sispkl.gedanggoreng.com:8000` and supports:

### Authentication Endpoints
- `POST /auth/login` - Admin login
- `POST /auth/guru/login` - Teacher login
- `POST /auth/siswa/login` - Student login
- `POST /auth/logout` - Logout
- `POST /auth/refresh` - Token refresh

### Data Management Endpoints
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/guru` - List teachers
- `GET /api/siswa` - List students
- `GET /api/jurusan` - List departments
- `GET /api/kelas` - List classes
- `GET /api/industri` - List industry partners

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Access the Application**
   - Open [http://localhost:3000](http://localhost:3000)
   - Use the login form to access the admin panel

## Usage

### Login
1. Select your role (Admin, Guru, or Siswa)
2. Enter your credentials
3. You'll be redirected to the appropriate dashboard

### Admin Dashboard
- View system statistics and overview
- Navigate to different management sections
- Monitor system status and data freshness

### Managing Data
- Use the search functionality to find specific records
- Click "Add New" to create new entries
- Use the action menu (three dots) to view, edit, or delete records
- All changes are saved to the backend API

## Customization

### Adding New Entities
1. Create a new page in `src/app/(Auth)/admin/[entity]/page.tsx`
2. Add the entity to the navigation in `admin-layout.tsx`
3. Create API functions in `lib/api.ts`
4. Use the `DataTable` component for consistent UI

### Styling
- Modify `src/app/globals.css` for global styles
- Use Tailwind CSS classes for component styling
- Customize shadcn/ui components as needed

### API Configuration
- Update the `API_BASE_URL` in `lib/api.ts` to point to your backend
- Modify API endpoints as needed for your backend structure

## Security Features

- JWT token-based authentication
- Automatic token refresh
- Secure logout with token cleanup
- Role-based access control
- Input validation and sanitization

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is part of the PKL Management System and follows the same licensing terms.
