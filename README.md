# SwipeAttend Frontend

This version is a pure HTML/CSS/JavaScript prototype matching the generated SwipeAttend UI direction.

## Files

- `index.html` — application screens
- `style.css` — dark/purple responsive UI
- `script.js` — swipe deck, attendance logic, dashboard navigation

## Run

Simplest option: open `index.html` in a browser.

Recommended for local development:

```bash
python -m http.server 5500
```

Then open:

http://localhost:5500

Or use VS Code Live Server.

## Main interaction

- Swipe right → PRESENT
- Swipe left → ABSENT
- Click green button → PRESENT
- Click red button → ABSENT
- Undo → restore previous student
- Right arrow → PRESENT
- Left arrow → ABSENT
- Ctrl/Cmd + Z → UNDO

This is the frontend/demo version. It uses browser-side demo data. For real deployment, connect the UI to the Node.js/PostgreSQL backend from the earlier MVP and add secure authentication.
