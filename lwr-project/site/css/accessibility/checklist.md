# Accessibility System (WCAG 2.1 AA)

## Token Validation

- **Contrast**: Text colors (primary, secondary) checked against backgrounds (page, surface) for 4.5:1 ratio.
- **Focus Rings**: `--s-ring-color` and `--s-ring-width` ensure distinct focus states.
- **Motion**: `--s-motion-duration` is short (150ms/300ms) to respect prefers-reduced-motion (should ideally be wrapped in media query in tokens.css).

## Component Rules

1. **Focus State**: All interactive elements (btn, input, link) MUST show focus ring.
2. **Keyboard Nav**:
   - Modals trap focus.
   - Tabs support arrow key navigation (JS required).
   - Accordions expanding via Enter/Space.
3. **Semantics**:
   - `input` needs `<label>`.
   - `btn` needs visible text or `aria-label`.
   - `table` needs headers `<th>`.

## Checklist

- [ ] Color Contrast > 4.5:1
- [ ] Focus indicators visible
- [ ] Semantic HTML tags used
- [ ] ARIA attributes for complex widgets (Tabs, Modal)
