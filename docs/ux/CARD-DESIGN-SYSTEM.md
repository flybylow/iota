# Card Design System

This document captures our base card visuals and the dot-indicator pattern so they can be reused consistently across the app.

## Default Card (Base)

Use this for most neutral cards (matches the Home “How It Works” and DEMO visuals).

Class: `card-default`

CSS:

```css
.card-default {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px; /* consistent soft radius */
}
```

Usage example:

```html
<div class="card-default p-4">
  <!-- content -->
  ...
  <!-- content -->
</div>
```

Notes:
- Keep padding responsive at the component level (`p-4`, `p-5`, etc.).
- Compose with Tailwind utilities as needed.

## Dot Indicator (Carousel/Stepper)

The dot indicator uses elongated active state for clarity and visual weight. The spacing uses `gap-3`.

HTML pattern:

```html
<div class="flex justify-center gap-3">
  <button class="transition-all rounded-full w-12 h-3 bg-blue-500"></button>
  <button class="transition-all rounded-full w-3 h-3 bg-gray-300 hover:bg-blue-400"></button>
  <button class="transition-all rounded-full w-3 h-3 bg-gray-300 hover:bg-blue-400"></button>
</div>
```

JSX example:

```tsx
<div className="flex justify-center gap-3">
  {items.map((_, idx) => (
    <button
      key={idx}
      aria-label={`Go to slide ${idx + 1}`}
      onClick={() => setIndex(idx)}
      className={`transition-all rounded-full ${
        idx === index ? 'w-12 h-3 bg-blue-500' : 'w-3 h-3 bg-gray-300 hover:bg-blue-400'
      }`}
    />
  ))}
</div>
```

Guidelines:
- Active dot: width 12–16px, height 3px, solid highlight color.
- Inactive dot: width/height 3px, neutral gray, hover highlight.
- Spacing: `gap-3` or larger for dense carousels.

## Migration Notes

- `home-step-card` in `app/home/home.css` reflects the same look-and-feel. For new work, prefer `card-default` from `app/design-system.css`.
- When converting existing cards, remove bespoke borders/rings and apply `card-default` + component-specific padding.


