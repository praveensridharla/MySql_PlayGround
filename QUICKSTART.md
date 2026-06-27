# Quick Start Guide

## 🎯 Get Started in 2 Minutes

### Step 1: Extract Files
Unzip `mysql_playground.zip` to a folder.

### Step 2: Open the App
Double-click `index.html` OR run a local server:

```bash
# Python 3 (already installed on most systems)
python3 -m http.server 8000
# Then open: http://localhost:8000
```

### Step 3: Try Your First Query
Click in the editor and run:
```sql
SELECT * FROM employees LIMIT 5;
```

---

## 🗂️ What's Inside

```
mysql_playground/
├── index.html              ← Start here!
├── style.css               ← Dark theme styling
├── app.js                  ← Main logic
├── data.js                 ← Sample tables
├── compat.js               ← MySQL→SQLite translator
├── README.md               ← Full documentation
├── LICENSE                 ← MIT License
├── package.json            ← For npm (optional)
├── sample_data.csv         ← Example CSV to import
└── QUICKSTART.md           ← This file!
```

---

## 🚀 Common Tasks

### Import CSV Data
1. Click **"Import CSV"** button in left sidebar
2. Select your CSV file
3. New table appears automatically!

Example CSV format:
```csv
id,name,email
1,John,john@example.com
2,Jane,jane@example.com
```

### Export a Table
1. Select a table from left sidebar
2. Click **"Export CSV"** button
3. File downloads automatically

### Write a Complex Query
```sql
SELECT c.name, COUNT(o.order_id) as total_orders
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_id
ORDER BY total_orders DESC;
```

---

## 🌐 Share With Friends

### 1. Host Yourself (Free Options)
- **GitHub Pages:** Push to `username.github.io` repo
- **Vercel:** Drag & drop folder to vercel.com
- **Netlify:** Drag & drop folder to netlify.com

### 2. Send Folder
- Zip the entire folder
- Email to friends
- They double-click `index.html`

### 3. Host on Your Server
```bash
scp -r mysql_playground/* user@yoursite.com:/var/www/html/
```

---

## 💡 Learning Path

1. **Start Here:** Run basic SELECTs on sample data
2. **Explore:** Check Schema tab to see table relationships
3. **Practice:** Try the sample queries in README
4. **Experiment:** Insert your own data using the form
5. **Advance:** Write JOINs, GROUP BY, subqueries

---

## 🆘 Troubleshooting

**Q: index.html won't open**
A: Use a local server instead (see Step 2 above)

**Q: CSV import failed**
A: Ensure CSV is in standard format (comma-separated, UTF-8)

**Q: Queries are slow**
A: Use LIMIT to reduce rows; SQLite has browser memory limits

**Q: MySQL command says "not supported"**
A: The app runs SQLite, not MySQL. Use the suggested SQLite equivalent.

---

## 📚 Learn SQL

- **Beginner:** https://www.w3schools.com/sql/
- **Interactive:** https://sqlzoo.net/
- **Advanced:** https://www.sqlite.org/docs.html

---

## 🎉 You're Ready!

Start querying and have fun learning SQL! Share this with anyone learning SQL. 🚀
