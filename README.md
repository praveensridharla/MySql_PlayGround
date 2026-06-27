## 📁 Project Structure

```
mysql_playground/
├── index.html          # Main HTML file
├── style.css           # All styling (dark theme)
├── data.js             # Sample table definitions & data
├── compat.js           # MySQL → SQLite compatibility layer
├── app.js              # Core application logic
└── README.md           # This file
```

---

## ✨ Features

### 1. **Query Execution**
- Write any SQL SELECT, INSERT, UPDATE, DELETE, CREATE TABLE statement
- Real-time results with syntax highlighting hints
- Supports JOINs, GROUP BY, HAVING, subqueries, and more
- Keyboard shortcut: `Ctrl + Enter` to run query

### 2. **Sample Data**
Pre-loaded tables for learning:
- **departments** — 5 departments
- **employees** — 10 employees (with foreign key to departments)
- **customers** — 8 customers (multi-country)
- **products** — 10 products (e-commerce)
- **orders** — 10 orders
- **order_items** — 13 items (junction table)

### 3. **Schema Inspector**
- View all tables, columns, data types
- See primary keys (PK), foreign keys (FK), and NOT NULL constraints
- Quick reference for database structure

### 4. **Manual Data Entry**
- Use the "Insert row" tab to add data without writing SQL
- Auto-generated primary keys
- Form-based input with field validation

### 5. **CSV Import**
- Click the file icon or use "Import CSV" button
- Automatically creates a new table from CSV headers
- Supports: comma-separated values with optional quotes
- Example: Upload `customers.csv` → creates `customers` table

### 6. **CSV Export**
- Export any table as CSV file
- Properly escapes special characters
- Download with a single click

### 7. **MySQL Compatibility Guide**
- When you use MySQL-specific commands (e.g., `DESC table`), the app detects it
- Shows a helpful explanation card with the SQLite equivalent
- Auto-fixes and runs the translated query
- Comprehensive reference table of MySQL → SQLite commands

### 8. **Query Snippets**
Quick-insert buttons for common SQL clauses:
- SELECT *, WHERE, JOIN, GROUP BY, ORDER BY, HAVING, LIMIT

---

## 📊 Sample Queries to Try

### Basic SELECT
```sql
SELECT * FROM employees LIMIT 5;
```

### JOIN
```sql
SELECT e.first_name, e.job_title, d.dept_name
FROM employees e
JOIN departments d ON e.dept_id = d.dept_id;
```

### GROUP BY with HAVING
```sql
SELECT dept_id, AVG(salary) as avg_salary, COUNT(*) as emp_count
FROM employees
GROUP BY dept_id
HAVING AVG(salary) > 70000;
```

### Subquery
```sql
SELECT * FROM products
WHERE price > (SELECT AVG(price) FROM products);
```

### Multi-table JOIN
```sql
SELECT c.name, o.order_date, oi.quantity, p.product_name
FROM orders o
JOIN customers c ON o.customer_id = c.customer_id
JOIN order_items oi ON o.order_id = oi.order_id
JOIN products p ON oi.product_id = p.product_id
ORDER BY o.order_date DESC;
```

### INSERT
```sql
INSERT INTO employees (emp_id, first_name, last_name, email, dept_id, salary, hire_date, job_title)
VALUES (11, 'Alice', 'Johnson', 'alice@company.com', 1, 98000, '2023-06-01', 'Tech Lead');
```

### UPDATE
```sql
UPDATE products SET price = price * 1.1 WHERE category = 'Electronics';
```

### DELETE
```sql
DELETE FROM orders WHERE status = 'cancelled';
```

---

## 🔧 Technical Details

### Technology Stack
- **Frontend:** Vanilla JavaScript (ES6+), HTML5, CSS3
- **Database Engine:** SQLite (via sql.js running in WebAssembly)
- **Icons:** Tabler Icons CDN
- **Fonts:** Google Fonts (Inter, JetBrains Mono)
- **No backend required** — everything runs in the browser!

### Browser Compatibility
- Chrome/Brave ✅
- Firefox ✅
- Safari ✅
- Edge ✅
- Requires ES6 support (modern browsers only)

### Performance
- Tables up to 10,000 rows: Fast
- Complex JOINs on small tables: Instant
- CSV imports: Depends on file size (tested up to 100KB)

---

## 📝 CSV Import Guide

### CSV Format
```csv
id,name,email,created_at
1,John Doe,john@example.com,2023-01-15
2,Jane Smith,jane@example.com,2023-02-20
3,Bob Johnson,bob@example.com,2023-03-10
```

### Supported Features
- Comma-delimited values ✅
- Quoted fields with embedded commas ✅
- Header row detection (first row = column names) ✅
- NULL values (empty cells) ✅
- All columns treated as VARCHAR(255) for safety ✅

### Limitations
- Complex nested quotes need to be pre-escaped
- Date formats must be ISO (YYYY-MM-DD)
- No automatic type inference (all cols are text)

### To Fix Type Issues
After importing, use SQL to convert:
```sql
-- Convert text to numeric
SELECT id, CAST(age AS INTEGER) FROM users;
```

---

## 🐛 Troubleshooting

### "Database failed to load"
- **Cause:** SQL.js CDN may be blocked
- **Fix:** Check browser console (F12) for CORS errors; use a local server

### CSV import not working
- **Cause:** File format issue
- **Fix:** Ensure CSV is UTF-8 encoded; check for unusual line breaks

### Queries running slowly
- **Cause:** Large dataset or complex JOIN
- **Fix:** Use LIMIT to reduce results; SQLite on browser has memory limits

### Can't open index.html directly
- **Cause:** CORS policy in modern browsers
- **Fix:** Use a local server (see Quick Start section)

---

## 💡 Teaching Tips

### For Beginners
1. Start with simple SELECT queries
2. Use the Schema tab to understand table relationships
3. Try INSERT/UPDATE/DELETE on small datasets
4. Explore JOINs using the sample order/customer data

### For Students
1. Import your own CSV datasets
2. Practice writing queries without hints
3. Export results for reports
4. Share the link with classmates

### For Practice
- Try all the sample queries listed above
- Create new tables using CREATE TABLE
- Design a small e-commerce database
- Practice normalization and foreign keys

---

## 📜 License

This project is open-source and free to use, modify, and share. No attribution required.

---


## 📞 Support

**Something not working?**
1. Check the Troubleshooting section above
2. Open browser DevTools (F12) to see console errors
3. Ensure all files are in the same directory
4. Try a different browser

---

## 🎓 Learn More

- **SQL Basics:** https://www.w3schools.com/sql/
- **SQLite Docs:** https://www.sqlite.org/docs.html
- **sql.js Documentation:** https://sql.js.org/
- **Database Design:** https://en.wikipedia.org/wiki/Database_design

---

## 🚀 Next Steps

1. ✅ Download and extract the ZIP file
2. ✅ Open `index.html` or run a local server
3. ✅ Try the sample queries
4. ✅ Import your own CSV data
5. ✅ Share with friends and classmates!

---

**Happy SQL Learning! 🎉**

Built with ❤️ for SQL beginners everywhere.
