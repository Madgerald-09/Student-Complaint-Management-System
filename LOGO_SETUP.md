# AFE BABALOLA UNIVERSITY Logo Integration Guide

## Setup Instructions

The university logo has been integrated throughout the student complaint management system. Follow these steps to complete the setup:

### 1. Save the Logo Image

1. You've been provided with the AFE BABALOLA UNIVERSITY logo image
2. Save it as **`afe-babalola-logo.png`** in the `public/` folder at the root of your project

**Path:** `public/afe-babalola-logo.png`

### 2. Logo Component Reference

The logo is now implemented in: `src/components/Logo.tsx`

The component is reusable with different sizes:
- `size="sm"` - Small (h-8 w-8) - Used in navigation
- `size="md"` - Medium (h-12 w-12) - Used in mobile views
- `size="lg"` - Large (h-16 w-16) - Used in full-page sections

Optional: `showText` prop to display "AFE BABALOLA UNIVERSITY" text next to logo

### 3. Logo Integration Points

The logo has been integrated in the following pages:

#### Landing Page (`src/pages/LandingPage.tsx`)
- Navbar logo with branding text

#### Student Authentication (`src/pages/StudentAuth.tsx`)
- Left sidebar section (desktop view)
- Mobile header (hidden on desktop, visible on mobile)

#### Admin Authentication (`src/pages/AdminAuth.tsx`)
- Left sidebar section (desktop view)
- Mobile header (hidden on desktop, visible on mobile)

#### Student Dashboard (`src/pages/StudentDashboard.tsx`)
- Header navigation bar

#### Admin Dashboard (`src/pages/AdminDashboard.tsx`)
- Header navigation bar with Admin badge

## File Modified

- `/public/` - **Create and add logo image here**
- `src/components/Logo.tsx` - **Created** (Reusable logo component)
- `src/pages/LandingPage.tsx` - **Updated**
- `src/pages/StudentAuth.tsx` - **Updated**
- `src/pages/AdminAuth.tsx` - **Updated**
- `src/pages/StudentDashboard.tsx` - **Updated**
- `src/pages/AdminDashboard.tsx` - **Updated**

## Customization

To customize the logo display, edit `src/components/Logo.tsx`:

```tsx
// Change the alt text
alt="AFE BABALOLA UNIVERSITY"

// Adjust sizing by modifying the sizeClasses object
// Current sizes match common breakpoints
```

## Testing

Once you've saved the logo image:
1. Run `npm run dev` to start the development server
2. Visit each page to verify the logo displays correctly
3. The logo is responsive and will adapt to different screen sizes

## Notes

- The logo is set to `object-contain` for proper aspect ratio maintenance
- The component handles responsive design automatically
- Mobile views show a compact logo without text
- Desktop views show the logo with optional branding text
