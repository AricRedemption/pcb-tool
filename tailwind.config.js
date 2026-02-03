

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#8B5CF6',
        tertiary: '#06B6D4',
        success: '#10B981',
        danger: '#EF4444',
        warning: '#F59E0B',
        info: '#3B82F6',
        'text-primary': '#1F2937',
        'text-secondary': '#6B7280',
        'bg-primary': '#F8FAFC',
        'bg-secondary': '#F1F5F9',
        'border-primary': '#E2E8F0',
        'border-secondary': '#CBD5E1',
        'card-bg': '#FFFFFF',
        'sidebar-bg': '#1E293B',
        'sidebar-text': '#94A3B8',
        'sidebar-text-active': '#FFFFFF',
        'sidebar-hover': '#334155'
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'glow': '0 0 20px rgba(59, 130, 246, 0.3)',
        'glow-secondary': '0 0 20px rgba(139, 92, 246, 0.3)'
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #06B6D4 0%, #10B981 100%)',
        'gradient-card': 'linear-gradient(145deg, #FFFFFF 0%, #F8FAFC 100%)',
        'gradient-sidebar': 'linear-gradient(180deg, #1E293B 0%, #334155 100%)'
      }
    }
  },
  plugins: [],
};

