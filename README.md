# Registrar's Ledger — Student Registration System

A lightweight, front-end-only student registration system. Register students, browse them in a searchable roster, edit or remove records, and export the roster to CSV — all running entirely in the browser with no backend required.

## Features

- **Registration form** with validation for required fields, a valid email format, and duplicate student-number prevention
- **Live ID card preview** that updates as you fill in the form
- **Roster table** listing every registered student
- **Search** by name, student number, or programme
- **Filter** by programme
- **Edit / Remove** any record directly from the roster
- **CSV export** of the full roster
- **Local persistence** — data is saved in the browser's `localStorage`, so records survive a page refresh (they are not sent to any server)

## Files

| File         | Purpose                                              |
|--------------|-------------------------------------------------------|
| `index.html` | Page structure — the form, ID card, and roster table |
| `style.css`  | All visual styling                                    |
| `app.js`     | Application logic — validation, CRUD, search, export  |
| `README.md`  | This file                                              |

## Getting started

No build tools or installation required.

1. Download all four files into the same folder.
2. Open `index.html` in any modern web browser (Chrome, Firefox, Edge, Safari).
3. Start registering students.

That's it — the app runs entirely client-side.

## How data is stored

Student records are kept in the browser's `localStorage` under the key `registrar_students_v1`. This means:

- Data persists between visits **on the same browser and device**
- Clearing browser data/cache will erase the roster
- Data is **not** shared across different browsers or devices
- Use the **Export CSV** button regularly if you want a portable backup

## Customizing

- **Programmes list:** edit the `<option>` values inside the `#course` select in `index.html`.
- **Colors and fonts:** all design tokens (colors, typefaces, spacing) are defined as CSS variables at the top of `style.css` under `:root`.
- **Fields:** to add a new field (e.g. phone number), add an `<input>` in the form, a matching column in the roster table, and extend `collectFormData()` / `renderRoster()` in `app.js`.

## Adding a real backend (optional next step)

This version stores data locally for simplicity. To make records shared across users/devices, you would replace the `localStorage` calls in `app.js` (`loadStudents` / `saveStudents`) with `fetch()` calls to a backend API (e.g. Node/Express + a database, or a serverless function) that performs the same create/read/update/delete operations.
