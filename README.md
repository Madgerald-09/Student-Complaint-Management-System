# AFE BABALOLA UNIVERSITY - Student Complaint Management System

A modern, secure, and efficient platform for students to submit complaints and administrators to manage and resolve them quickly. Built for AFE BABALOLA UNIVERSITY to streamline the complaint resolution process.

## 🚀 Programming Languages & Technologies

### Frontend
- **TypeScript** - Primary programming language for type-safe development
- **React 19** - Modern React framework with hooks and functional components
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework for styling
- **shadcn/ui** - Modern UI component library built on Radix UI

### Key Libraries & Frameworks
- **React Router** - Client-side routing
- **Lucide React** - Beautiful icon library
- **Sonner** - Toast notification system
- **Radix UI** - Accessible UI primitives
- **React Hook Form** - Form handling and validation
- **date-fns** - Date utility functions

### Build & Development Tools
- **ESLint** - Code linting and formatting
- **TypeScript Compiler** - Type checking
- **Vite** - Development server and bundler
- **PostCSS** - CSS processing

## 📋 Features

### For Students
- ✅ Secure login and registration
- ✅ Submit complaints with file attachments
- ✅ Real-time complaint tracking
- ✅ View complaint history
- ✅ Receive notifications on updates
- ✅ Responsive mobile-friendly interface

### For Administrators
- ✅ Admin dashboard with analytics
- ✅ Manage and assign complaints
- ✅ Track resolution metrics
- ✅ Communicate directly with students
- ✅ Generate reports and statistics
- ✅ Priority-based complaint handling

### System Features
- ✅ Credential validation with error messages
- ✅ Toast notifications for user feedback
- ✅ Responsive design for all devices
- ✅ Modern UI with AFE BABALOLA UNIVERSITY branding
- ✅ Secure authentication system
- ✅ File upload capabilities

## 🔐 Demo Credentials

### Student Login
- **Email:** `student@afebabalola.edu.ng`
- **Password:** `password123`

### Admin Login
- **Email:** `admin@afebabalola.edu.ng`
- **Password:** `admin123`

## 🛠 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

### Installation Steps


2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Add the university logo**
   - Place the AFE BABALOLA UNIVERSITY logo image in the `public/` folder
   - Name it `afe-babalola-logo.png`

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   - Navigate to `http://localhost:5173`
   - The application will be running in development mode

### Build for Production

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/           # Reusable UI components (shadcn/ui)
│   └── Logo.tsx      # University logo component
├── pages/            # Main application pages
│   ├── LandingPage.tsx
│   ├── StudentAuth.tsx
│   ├── AdminAuth.tsx
│   ├── StudentDashboard.tsx
│   └── AdminDashboard.tsx
├── hooks/
│   └── use-toast.ts  # Toast notification hook
├── lib/
│   └── utils.ts      # Utility functions
├── App.tsx           # Main application component
└── main.tsx          # Application entry point

public/
└── afe-babalola-logo.png  # University logo

Configuration Files:
├── package.json      # Dependencies and scripts
├── tsconfig.json     # TypeScript configuration
├── vite.config.ts    # Vite build configuration
├── tailwind.config.js # Tailwind CSS configuration
└── components.json   # shadcn/ui configuration
```

## 🎯 Usage

### Student Portal
1. Navigate to `/student-auth`
2. Login with student credentials or register a new account
3. Submit complaints through the dashboard
4. Track complaint status and view updates

### Admin Portal
1. Navigate to `/admin-auth`
2. Login with admin credentials
3. View complaint analytics and manage incoming complaints
4. Assign complaints to departments and track resolution

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style
- Uses ESLint for code quality
- TypeScript for type safety
- Prettier for code formatting (via ESLint)
- Follows React best practices and hooks patterns

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary software for AFE BABALOLA UNIVERSITY.

## 📞 Support

For technical support or questions, please contact the development team.

---

**Built with ❤️ for AFE BABALOLA UNIVERSITY**