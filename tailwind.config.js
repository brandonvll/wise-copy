/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Paleta oficial Wise
        'bright-green': '#9FE870',
        'bright-green-hover': '#8ed65c',
        'forest': '#163300',     // verde bosque (texto/fondos oscuros)
        'forest-dark': '#0E0F0C',
        'wise-green': '#37517E', // azul de detalles
        'content-primary': '#0E0F0C',
        'content-secondary': '#454745',
        'content-tertiary': '#6C6F6C',
        'bg-screen': '#FFFFFF',
        'bg-neutral': '#F0EEEC',     // gris fondo de secciones
        'bg-elevated': '#FFFFFF',
        'interactive-accent': '#163300',
      },
      fontFamily: {
        sans: ['Inter', 'Helvetica', 'Arial', 'sans-serif'],
        display: ['"Wise Sans"', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        pill: '9999px',
        card: '24px',
        'card-lg': '32px',
      },
      maxWidth: {
        wise: '1520px',
      },
      fontSize: {
        'hero': ['clamp(2.5rem, 5vw, 3.75rem)', { lineHeight: '1.05', fontWeight: '900' }],
        'h2-wise': ['clamp(2rem, 4vw, 3rem)', { lineHeight: '1.1', fontWeight: '800' }],
      },
    },
  },
  plugins: [],
}
