# Wise — Clon visual

Clon visual (estático) de [wise.com](https://wise.com) construido con **React + Vite + Tailwind CSS**. Proyecto de práctica para replicar fielmente el diseño, tipografía y secciones del sitio de Wise.

## Stack

- React 18 + React Router v6
- Vite 5
- Tailwind CSS 3

## Desarrollo

```bash
npm install
npm run dev     # http://localhost:5180
npm run build   # build de producción
```

## Estructura

- `src/pages/` — Home, Personal, Empresa, Plataforma, Ayuda, Login, Registro y la plantilla de países (`SendMoneyCountry`).
- `src/components/` — Navbar, Footer, Logo, Calculadora, mockups, etc.
- `src/sections/` — Secciones reutilizables (tira de banderas animada, testimonios, grilla de países).
- `src/data/countries.js` — datos de ~100 países para las páginas "Envía dinero a X".

## Características

- Sistema de diseño fiel a Wise (verde `#9FE870` / forest `#163300`, tipografía **Wise Sans**).
- Calculadora de conversión funcional.
- Tira de banderas con animación ligada al scroll.
- ~100 páginas de país generadas desde una plantilla.

## Aviso

Proyecto educativo/de práctica, **sin afiliación** con Wise Payments Limited. La fuente *Wise Sans* es propietaria de Wise y se incluye solo con fines de demostración; reemplázala por una alternativa libre (p. ej. Inter) si vas a darle uso público.
