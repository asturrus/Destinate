# React App Design Guidelines

## Design Approach
**Selected Approach**: Design System Approach using Tailwind's default aesthetic
**Justification**: Since no specific requirements were provided, we'll create a clean, modern utility-focused application that demonstrates Tailwind's capabilities while maintaining flexibility for future customization.

## Core Design Elements

### A. Color Palette
**Light Mode**:
- Primary: 99 102% 52% (Tailwind blue-500)
- Secondary: 220 13% 91% (gray-100) 
- Text: 222 84% 5% (gray-900)
- Background: 0 0% 100% (white)

**Dark Mode**:
- Primary: 217 91% 60% (blue-400)
- Secondary: 215 28% 17% (gray-800)
- Text: 210 40% 98% (gray-50)
- Background: 222 84% 5% (gray-900)

### B. Typography
- **Primary Font**: Inter (via Google Fonts CDN)
- **Headings**: font-bold, text-3xl to text-6xl
- **Body**: font-normal, text-base to text-lg
- **Small Text**: text-sm, text-xs for captions

### C. Layout System
**Tailwind Spacing Units**: 2, 4, 6, 8, 12, 16, 24
- **Micro spacing**: p-2, m-2 (buttons, small elements)
- **Component spacing**: p-4, m-4, gap-4 (cards, form fields)
- **Section spacing**: p-8, m-8, py-12 (page sections)
- **Major layout**: p-16, py-24 (hero sections, major containers)

### D. Component Library

**Navigation**:
- Clean horizontal navbar with subtle shadow
- Mobile hamburger menu with slide-in drawer
- Sticky positioning with backdrop blur

**Buttons**:
- Primary: bg-blue-600 with hover states
- Secondary: border with transparent background
- Sizes: px-4 py-2 (default), px-6 py-3 (large)

**Cards**:
- White/dark background with subtle border
- Rounded corners (rounded-lg)
- Subtle shadow (shadow-sm)
- Consistent padding (p-6)

**Forms**:
- Clean input fields with focus states
- Consistent border radius and spacing
- Proper validation states and error messaging

**Data Display**:
- Clean tables with alternating row colors
- Card-based layouts for content
- Proper spacing and typography hierarchy

**Overlays**:
- Modal dialogs with backdrop blur
- Toast notifications with slide animations
- Dropdown menus with subtle shadows

### E. Animations
Minimal and purposeful:
- Hover transitions (transition-colors duration-200)
- Modal fade-in/out
- Loading spinners where necessary
- Smooth scroll behavior

## Layout Principles

**Responsive Design**:
- Mobile-first approach using Tailwind's responsive prefixes
- Breakpoints: sm: (640px), md: (768px), lg: (1024px), xl: (1280px)
- Flexible grid system using CSS Grid and Flexbox utilities

**Visual Hierarchy**:
- Clear heading structure (text-4xl → text-2xl → text-lg)
- Consistent spacing rhythm
- Strategic use of color for emphasis
- Proper contrast ratios for accessibility

**Content Organization**:
- Maximum content width of 1200px (max-w-6xl)
- Generous whitespace for readability
- Clear section divisions
- Logical information flow

## Images
This application will use placeholder images and icons:
- **Hero Section**: Large background image (1920x1080) with overlay text
- **Feature Cards**: Small illustrative icons (64x64) from Heroicons
- **Profile/Avatar**: Circular images (96x96) with border
- **Gallery**: Responsive grid of images with consistent aspect ratios

The design emphasizes clean, modern aesthetics with excellent usability and accessibility, perfect for demonstrating React and Tailwind CSS capabilities.