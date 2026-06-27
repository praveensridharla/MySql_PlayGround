# Images & Session Isolation Guide

## 🖼️ Part 1: Adding Images to MySQL_PlayGround

### What Images Can You Add?

1. **Favicon** — Browser tab icon (16x16 or 32x32 px)
2. **Logo/Brand Image** — In the header (recommended: 200x50 px)
3. **Background Image** — Behind tables or panels
4. **Custom Table Icons** — SVG or small PNG images

### Directory Structure with Images

```
mysql_playground/
├── index.html
├── style.css
├── app.js
├── data.js
├── compat.js
├── README.md
├── QUICKSTART.md
├── package.json
├── LICENSE
├── sample_data.csv
│
└── images/                    ← NEW: Images folder
    ├── favicon.ico            ← Browser tab icon (32x32)
    ├── favicon-16x16.png      ← Smaller version
    ├── logo.png               ← Header logo (optional)
    ├── logo-dark.svg          ← Vector logo
    ├── banner.jpg             ← Background image (optional)
    └── icons/
        ├── custom-icon-1.svg
        ├── custom-icon-2.svg
        └── table-icon.png
```

---

## 📌 How to Add Favicon (Browser Tab Icon)

### Step 1: Get or Create Favicon

**Option A: Create Online (Free)**
- Go to https://favicon-generator.org/
- Upload your image or draw something
- Download `favicon.ico`

**Option B: Use Online Tool**
- Go to https://www.favicon-ico-online.com/
- Convert PNG to ICO format

**Option C: Create Yourself**
- Open any image editor (Paint, Photoshop, Canva)
- Create a 32×32 pixel image
- Save as `favicon.ico` or `favicon.png`

### Step 2: Add to Project

```
mysql_playground/
├── index.html
├── favicon.ico              ← Put favicon here
└── images/
    └── favicon-16x16.png    ← (optional) smaller version
```

### Step 3: Update HTML (Already Done!)

The HTML already has this line:
```html
<link rel="icon" type="image/x-icon" href="favicon.ico" />
```

Just add your `favicon.ico` file to the project root!

### Step 4: Refresh Browser

Hard refresh to see changes:
- **Windows/Linux:** `Ctrl + F5`
- **Mac:** `Cmd + Shift + R`

---

## 🎨 How to Add a Logo in Header

### Step 1: Prepare Image

Create/download a logo:
- **Size:** 200×50 pixels (landscape)
- **Format:** PNG with transparency (recommended) or SVG
- **Placement:** `images/logo.png`

### Step 2: Update HTML

Replace this:
```html
<div class="pg-logo-icon">
  <i class="ti ti-database"></i>
</div>
```

With this:
```html
<div class="pg-logo-icon" style="width:auto; padding:0 10px; background:none;">
  <img src="images/logo.png" alt="Logo" style="height:40px; width:auto;" />
</div>
```

### Step 3: Optional - Update CSS

In `style.css`, find:
```css
.pg-logo-icon {
  width: 32px;
  height: 32px;
  background: var(--accent-bg);
  border-radius: var(--radius);
}
```

Change to:
```css
.pg-logo-icon {
  width: auto;
  height: 40px;
  background: none;
  border-radius: 0;
  padding: 0 10px;
}

.pg-logo-icon img {
  height: 40px;
  width: auto;
  object-fit: contain;
}
```

---

## 🔄 How to Add Background Images

### Step 1: Prepare Image

- **Size:** 1920×1080 pixels (or larger)
- **Format:** JPG (for photos) or PNG
- **File:** `images/background.jpg`

### Step 2: Update CSS

In `style.css`, find `:root` section and add:
```css
:root {
  /* ... existing variables ... */
  --bg-image: url('../images/background.jpg');
}
```

Then find:
```css
html, body {
  height: 100%;
  background: var(--bg);
  /* ... */
}
```

Change to:
```css
html, body {
  height: 100%;
  background: var(--bg-image), var(--bg);
  background-attachment: fixed;
  background-size: cover;
  background-position: center;
  /* ... */
}
```

### Step 3: Adjust Opacity (Optional)

Add overlay to make text readable:
```css
.pg-root {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  background: rgba(13, 17, 23, 0.85);  ← Added semi-transparent overlay
}
```

---

## 📊 Add Custom Icons for Tables

### Option 1: Use Tabler Icons (Already Supported)

In `data.js`, use any Tabler icon name:
```javascript
const TABLES = {
  employees: {
    label: 'Employees',
    icon: 'ti-users',        ← Tabler icon class
    cols: [ /* ... */ ]
  },
  products: {
    label: 'Products',
    icon: 'ti-package',      ← Different icon
    cols: [ /* ... */ ]
  }
};
```

**Available icons:** https://tabler-icons.io/

### Option 2: Use Custom PNG/SVG Icons

```javascript
// Create custom icon element instead of <i> tag
// In data.js, you could add:
{
  icon_type: 'image',
  icon_src: 'images/icons/custom.svg'
}
```

Then in `app.js`, update `renderTableList()`:
```javascript
let iconHTML;
if (tdef.icon_type === 'image') {
  iconHTML = `<img src="${tdef.icon_src}" style="width:16px; height:16px;" />`;
} else {
  iconHTML = `<i class="ti ${tdef.icon}"></i>`;
}
el.innerHTML = `${iconHTML}<span>${tdef.label}</span>...`;
```

---

## 🔐 Session Isolation Explained

### ✅ What's Now Fixed

**Before:** User 1 imports CSV → User 2 sees it (WRONG!)
**After:** Each user has their own isolated session (RIGHT!)

### How It Works

1. **Original Data:** Defined in `data.js` (TABLES object)
2. **Session Copy:** When app loads, makes a deep copy → SESSION_TABLES
3. **User Changes:** Modifications only affect their session
4. **Isolation:** Next user loads fresh copy of SESSION_TABLES

### Code Example

```javascript
// In app.js - happens on page load
function initializeSessionTables() {
  SESSION_TABLES = {};
  for (const [tname, tdef] of Object.entries(TABLES)) {
    SESSION_TABLES[tname] = {
      label: tdef.label,
      icon: tdef.icon,
      cols: JSON.parse(JSON.stringify(tdef.cols)),      ← Deep copy
      rows: JSON.parse(JSON.stringify(tdef.rows))       ← Deep copy
    };
  }
}
```

### What's Isolated?

✅ **Isolated (Per User):**
- Imported CSV files
- Inserted rows
- Modified data
- Query results
- Added tables

❌ **NOT Isolated (Shared):**
- Browser cookies (user session ID)
- Local storage (if used)
- Databases on server (if deployed with backend)

### Example Scenario

```
Browser 1 (User Alice)        Browser 2 (User Bob)
├─ Opens app                  ├─ Opens app
├─ SESSION_TABLES created     ├─ SESSION_TABLES created (fresh copy)
├─ Imports customers.csv      ├─ Sees only default tables
└─ Sees imported data         └─ Doesn't see Alice's data
```

---

## 📁 Complete File Structure with Images

```
mysql_playground/
│
├── index.html                    ← Main app (update favicon link)
├── style.css                     ← Styling
├── app.js                        ← Logic (NOW with SESSION_TABLES)
├── data.js                       ← Tables (ORIGINAL DATA, not modified)
├── compat.js                     ← MySQL translator
├── README.md                     ← Full docs
├── QUICKSTART.md                 ← Quick start
├── LICENSE                       ← MIT License
├── package.json                  ← NPM config
├── sample_data.csv               ← Example CSV
│
├── favicon.ico                   ← Browser tab icon (NEW)
│
└── images/                       ← Images folder (NEW, optional)
    ├── favicon-16x16.png         ← Small favicon
    ├── logo.png                  ← Header logo
    ├── background.jpg            ← Background image
    └── icons/
        ├── custom-table.svg
        └── company-logo.png
```

---

## 🎯 Step-by-Step: Add Favicon & Logo

### Step 1: Create Images

1. Create/download:
   - `favicon.ico` (32×32 pixels)
   - `logo.png` (200×50 pixels)

2. Place in project folder

### Step 2: Update Files

**Already Done in index.html:**
```html
<link rel="icon" type="image/x-icon" href="favicon.ico" />
```

**Optional - Update logo in header:**
```html
<div class="pg-logo-icon">
  <img src="images/logo.png" alt="Logo" style="height:40px; object-fit:contain;" />
</div>
```

### Step 3: Test

1. Hard refresh browser (`Ctrl+F5`)
2. Check browser tab for favicon
3. Check header for logo

---

## 🚀 Complete Updated ZIP Contents

```
mysql_playground-v2/
├── index.html              (updated with favicon)
├── style.css               (ready for images)
├── app.js                  (SESSION_TABLES for isolation)
├── data.js                 (unchanged)
├── compat.js               (unchanged)
├── README.md
├── QUICKSTART.md
├── LICENSE
├── package.json
├── sample_data.csv
├── favicon.ico             (NEW - add this!)
└── images/                 (NEW - optional folder)
    └── (add your images here)
```

---

## 💡 Pro Tips

### Favicon Tips
- Use transparent background for dark mode
- Keep it simple (recognizable at small sizes)
- Test in multiple browsers

### Logo Tips
- Use SVG for best quality at any size
- PNG with transparency works too
- Keep aspect ratio when resizing

### Session Isolation Tips
- Each browser tab = separate session
- Closing tab = data lost
- Refreshing page = new SESSION_TABLES copy
- To persist data, would need backend database

### Performance
- Images don't slow down app
- SQL.js (SQLite) is lightweight
- CSS is optimized

---

## ❓ FAQ

**Q: How do I share images when sending ZIP to friends?**
A: Include the `images/` folder in the ZIP. Make sure paths match in HTML.

**Q: Will images work if I host on GitHub Pages?**
A: Yes! Make sure to use correct paths (e.g., `images/logo.png`)

**Q: Can I add images to table cells?**
A: Not by default, but you could modify results to show image URLs as clickable links.

**Q: Does adding images slow down the app?**
A: No, images load separately from SQL engine.

**Q: How big can images be?**
A: Recommended max 2MB total for all images. Compress before uploading.

---

## 🎉 Summary

✅ **Session Isolation:** Each user gets their own SESSION_TABLES (deep copy)
✅ **Favicon:** Add favicon.ico to project root
✅ **Logo:** Add images/logo.png and update HTML
✅ **Background:** Add images/background.jpg and update CSS
✅ **Icons:** Use Tabler icons or add custom SVG/PNG

Your app is now **multi-user ready** with **custom branding options**! 🚀
