/* ============================================================
   app.js — Main application logic
   ============================================================ */

let db = null;
let activeTable = null;
let activeTab = 'query';
let SESSION_TABLES = {}; // Each user gets their own copy of tables

// ── Initialize session-isolated tables ────────────────────────────────────
function initializeSessionTables() {
  // Deep copy TABLES to SESSION_TABLES so each session is isolated
  SESSION_TABLES = {};
  for (const [tname, tdef] of Object.entries(TABLES)) {
    SESSION_TABLES[tname] = {
      label: tdef.label,
      icon: tdef.icon,
      cols: JSON.parse(JSON.stringify(tdef.cols)),
      rows: JSON.parse(JSON.stringify(tdef.rows))  // Deep copy of rows
    };
  }
}

// ── Initialize SQL.js database ────────────────────────────────────────────
async function initDB() {
  try {
    const SQL = await initSqlJs({
      locateFile: (f) => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.2/${f}`
    });
    db = new SQL.Database();

    // Initialize session-isolated copy of tables
    initializeSessionTables();

    // Create tables from SESSION_TABLES
    for (const [tname, tdef] of Object.entries(SESSION_TABLES)) {
      const colDefs = tdef.cols
        .map((c) => {
          let def = `${c.name} ${c.type}`;
          if (c.pk) def += ' PRIMARY KEY';
          if (c.nn && !c.pk) def += ' NOT NULL';
          return def;
        })
        .join(', ');

      db.run(`CREATE TABLE ${tname} (${colDefs})`);

      // Insert rows
      for (const row of tdef.rows) {
        const placeholders = row.map(() => '?').join(', ');
        db.run(`INSERT INTO ${tname} VALUES (${placeholders})`, row);
      }
    }

    renderTableList();
    renderSchema();
    setActiveTable('employees');
    showToast('Database initialized successfully', 'ok');
  } catch (e) {
    showToast('Failed to load SQL engine: ' + e.message, 'error');
    console.error(e);
  }
}

// ── Render table list in sidebar ──────────────────────────────────────────
function renderTableList() {
  const list = document.getElementById('tableList');
  list.innerHTML = '';
  for (const [tname, tdef] of Object.entries(SESSION_TABLES)) {
    const rowCount = tdef.rows.length;
    const el = document.createElement('div');
    el.className = 'pg-table-item' + (tname === activeTable ? ' active' : '');
    el.id = 'tbl-' + tname;
    el.innerHTML = `
      <i class="ti ${tdef.icon}"></i>
      <span>${tdef.label}</span>
    `;
    el.onclick = () => setActiveTable(tname);
    list.appendChild(el);
  }
}

// ── Set active table ─────────────────────────────────────────────────────
function setActiveTable(tname) {
  activeTable = tname;
  document.querySelectorAll('.pg-table-item').forEach((el) => el.classList.remove('active'));
  const el = document.getElementById('tbl-' + tname);
  if (el) el.classList.add('active');
  document.getElementById('sqlEditor').value = `SELECT * FROM ${tname} LIMIT 20;`;
  if (activeTab === 'insert') renderInsertForm();
}

// ── Switch tabs ──────────────────────────────────────────────────────────
function switchTab(tab) {
  activeTab = tab;
  ['query', 'schema', 'insert'].forEach((t) => {
    const tabEl = document.getElementById('tab-' + t);
    const paneEl = document.getElementById('pane-' + t);
    if (t === tab) {
      tabEl.classList.add('active');
      paneEl.style.display = t === 'query' ? 'flex' : 'block';
    } else {
      tabEl.classList.remove('active');
      paneEl.style.display = 'none';
    }
  });
  if (tab === 'insert') renderInsertForm();
  if (tab === 'schema') renderSchema();
}

// ── Render schema view ───────────────────────────────────────────────────
function renderSchema() {
  const container = document.getElementById('schemaView');
  container.innerHTML = '';
  for (const [tname, tdef] of Object.entries(SESSION_TABLES)) {
    const div = document.createElement('div');
    div.className = 'pg-schema-block';
    let html = `
      <div class="pg-schema-block-head">
        <i class="ti ${tdef.icon}"></i>
        <span class="pg-schema-block-name">${tdef.label}</span>
        <span class="pg-schema-block-slug">${tname}</span>
      </div>
    `;
    for (const col of tdef.cols) {
      let badges = '';
      if (col.pk) badges += '<span class="badge badge-pk">PK</span>';
      if (col.fk) badges += `<span class="badge badge-fk">FK → ${col.fk}</span>`;
      if (col.nn && !col.pk) badges += '<span class="badge badge-nn">NOT NULL</span>';
      html += `
        <div class="pg-schema-row">
          <span class="pg-col-name">${col.name}</span>
          <span class="pg-col-type">${col.type}</span>
          ${badges}
        </div>
      `;
    }
    div.innerHTML = html;
    container.appendChild(div);
  }
}

// ── Render insert form ───────────────────────────────────────────────────
function renderInsertForm() {
  if (!activeTable) return;
  const container = document.getElementById('insertArea');
  const tdef = SESSION_TABLES[activeTable];

  let fields = '';
  for (const col of tdef.cols) {
    fields += `
      <div class="pg-field">
        <label>${col.name} <span style="color:var(--text-3)">${col.type}${col.pk ? ' PK' : ''}</span></label>
        <input id="ins_${col.name}" placeholder="${col.pk ? 'auto' : 'enter value'}" ${col.pk ? 'readonly' : ''}/>
      </div>
    `;
  }

  container.innerHTML = `
    <div class="pg-insert-hint">
      <i class="ti ti-info-circle"></i>
      <span>Inserting into <strong>${activeTable}</strong>. Fill the fields and click "Add row" to insert manually.</span>
    </div>
    <div class="pg-insert-form">
      <div class="pg-insert-form-title">
        <i class="ti ti-table-plus"></i> Add row to ${activeTable}
      </div>
      <div class="pg-field-grid">${fields}</div>
      <button class="pg-insert-btn" onclick="doInsert()">
        <i class="ti ti-plus"></i> Add row
      </button>
    </div>
  `;

  // Auto-populate PK with next ID
  const pkCol = tdef.cols.find((c) => c.pk);
  if (pkCol) {
    const nextId = Math.max(...tdef.rows.map((r) => r[0])) + 1;
    const inp = document.getElementById('ins_' + pkCol.name);
    if (inp) inp.value = nextId;
  }
}

// ── Insert a row manually ────────────────────────────────────────────────
function doInsert() {
  const tdef = SESSION_TABLES[activeTable];
  const allCols = tdef.cols;
  const pkCol = tdef.cols.find((c) => c.pk);

  const pkVal = parseInt(document.getElementById('ins_' + pkCol.name).value);
  const values = [pkVal];

  for (const col of tdef.cols.filter((c) => !c.pk)) {
    const inp = document.getElementById('ins_' + col.name);
    const v = inp ? inp.value.trim() : '';

    let val;
    if (col.type.includes('INT') || col.type.includes('DECIMAL')) {
      val = v === '' ? null : parseFloat(v);
    } else {
      val = v === '' ? null : v;
    }
    values.push(val);
  }

  try {
    const placeholders = allCols.map(() => '?').join(',');
    db.run(`INSERT INTO ${activeTable} VALUES (${placeholders})`, values);
    SESSION_TABLES[activeTable].rows.push(values);

    // Update count
    const el = document.querySelector(`#tbl-${activeTable} .pg-table-count`);
    if (el) el.textContent = SESSION_TABLES[activeTable].rows.length;

    showToast(`Row inserted into ${activeTable}`, 'ok');
    renderInsertForm();
  } catch (e) {
    showToast('Error: ' + e.message, 'error');
  }
}

// ── Parse CSV file ──────────────────────────────────────────────────────
function parseCSV(text) {
  const lines = text.trim().split('\n');
  if (lines.length < 1) return null;

  const headers = lines[0].split(',').map((h) => h.trim());
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Simple CSV parsing (handles basic cases; use Papa Parse for complex CSVs)
    const cols = line.split(',').map((c) => {
      c = c.trim();
      // Remove quotes if present
      if ((c.startsWith('"') && c.endsWith('"')) || (c.startsWith("'") && c.endsWith("'"))) {
        c = c.slice(1, -1);
      }
      return c === '' || c.toLowerCase() === 'null' ? null : c;
    });

    rows.push(cols);
  }

  return { headers, rows };
}

// ── Import CSV as new table ──────────────────────────────────────────────
function importCSV() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.csv';

  input.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const text = await file.text();
    const parsed = parseCSV(text);

    if (!parsed || parsed.rows.length === 0) {
      showToast('CSV file is empty or invalid', 'error');
      return;
    }

    const { headers, rows } = parsed;
    const tableName = file.name.replace('.csv', '').toLowerCase().replace(/[^a-z0-9_]/g, '_');

    try {
      // Create table with all VARCHAR columns (safest for CSV import)
      const colDefs = headers.map((h) => `${h} VARCHAR(255)`).join(', ');
      db.run(`CREATE TABLE IF NOT EXISTS ${tableName} (${colDefs})`);

      // Insert rows
      const placeholders = headers.map(() => '?').join(',');
      for (const row of rows) {
        const values = row.map((v) => v);
        db.run(`INSERT INTO ${tableName} VALUES (${placeholders})`, values);
      }

      // Add to SESSION_TABLES (not TABLES!) for session isolation
      SESSION_TABLES[tableName] = {
        label: tableName.replace(/_/g, ' '),
        icon: 'ti-file-text',
        cols: headers.map((h) => ({ name: h, type: 'VARCHAR(255)' })),
        rows: rows
      };

      renderTableList();
      renderSchema();
      setActiveTable(tableName);
      showToast(`CSV imported as table "${tableName}" (session-only)`, 'ok');
    } catch (e) {
      showToast('Error importing CSV: ' + e.message, 'error');
    }
  };

  input.click();
}

// ── Export current table as CSV ──────────────────────────────────────────
function exportTableAsCSV() {
  if (!activeTable) return;

  try {
    const result = db.exec(`SELECT * FROM ${activeTable}`);
    if (!result.length) {
      showToast('No data to export', 'error');
      return;
    }

    const { columns, values } = result[0];
    let csv = columns.join(',') + '\n';

    for (const row of values) {
      const escapedRow = row.map((cell) => {
        if (cell === null) return '';
        const str = String(cell);
        // Escape quotes and wrap in quotes if contains comma
        if (str.includes(',') || str.includes('"')) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      });
      csv += escapedRow.join(',') + '\n';
    }

    // Download
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeTable}_export.csv`;
    a.click();
    URL.revokeObjectURL(url);

    showToast(`Table "${activeTable}" exported as CSV`, 'ok');
  } catch (e) {
    showToast('Error exporting: ' + e.message, 'error');
  }
}

// ── Run query ────────────────────────────────────────────────────────────
function runQuery() {
  const raw = document.getElementById('sqlEditor').value.trim();
  if (!raw) return;

  const area = document.getElementById('resultsArea');

  // Check for MySQL compatibility issues
  const compat = detectCompat(raw);
  if (compat) {
    const { rule, match } = compat;
    const translated = rule.translate ? rule.translate(match, raw) : null;

    if (rule.noRun) {
      area.innerHTML = `
        <div class="pg-result-meta">
          <span class="pg-result-status warn">
            <i class="ti ti-alert-triangle"></i> MySQL-only command
          </span>
        </div>
        ${renderCompatCard(rule, match, null)}
      `;
      return;
    }

    try {
      const start = Date.now();
      const results = db.exec(translated);
      const elapsed = Date.now() - start;

      let html = `
        <div class="pg-result-meta">
          <span class="pg-result-status warn">
            <i class="ti ti-arrows-exchange"></i> Auto-translated
          </span>
          <span>${elapsed}ms</span>
        </div>
      `;

      if (results.length) {
        html += renderResultTable(results[0]);
      } else {
        html += '<div style="padding:10px 0;font-size:13px;color:var(--text-3)">No results returned.</div>';
      }

      html += renderCompatCard(rule, match, translated);
      area.innerHTML = html;
    } catch (e) {
      area.innerHTML = `
        <div class="pg-result-meta">
          <span class="pg-result-status err">
            <i class="ti ti-x"></i> Translation failed
          </span>
        </div>
        <div class="pg-error-box">${e.message}</div>
        ${renderCompatCard(rule, match, translated)}
      `;
    }
    return;
  }

  // Normal query
  try {
    const start = Date.now();
    const results = db.exec(raw);
    const elapsed = Date.now() - start;

    if (!results.length) {
      area.innerHTML = `
        <div class="pg-result-meta">
          <span class="pg-result-status ok">
            <i class="ti ti-check"></i> Query OK
          </span>
          <span>${elapsed}ms</span>
        </div>
        <div class="pg-empty" style="padding:20px">
          <i class="ti ti-circle-check" style="font-size:24px;color:var(--green)"></i>
          <p>Statement executed successfully — no rows returned</p>
        </div>
      `;

      // Update table counts if it's an INSERT/UPDATE/DELETE
      const upper = raw.toUpperCase().trim();
      if (upper.startsWith('INSERT') || upper.startsWith('UPDATE') || upper.startsWith('DELETE')) {
        const tMatch = raw.match(/(?:INTO|FROM|UPDATE)\s+(\w+)/i);
        if (tMatch && SESSION_TABLES[tMatch[1]]) {
          const tname = tMatch[1];
          const fresh = db.exec(`SELECT COUNT(*) FROM ${tname}`);
          if (fresh.length) {
            const newCount = fresh[0].values[0][0];
            SESSION_TABLES[tname].rows = [];
            const allRows = db.exec(`SELECT * FROM ${tname}`);
            if (allRows.length) SESSION_TABLES[tname].rows = allRows[0].values;
            const el = document.querySelector(`#tbl-${tname} .pg-table-count`);
            if (el) el.textContent = newCount;
          }
        }
      }
      return;
    }

    const html = `
      <div class="pg-result-meta">
        <span class="pg-result-status ok">
          <i class="ti ti-check"></i> ${results[0].values.length} row${results[0].values.length !== 1 ? 's' : ''}
        </span>
        <span>${elapsed}ms · ${results[0].columns.length} columns</span>
      </div>
      ${renderResultTable(results[0])}
    `;
    area.innerHTML = html;
  } catch (e) {
    area.innerHTML = `
      <div class="pg-result-meta">
        <span class="pg-result-status err">
          <i class="ti ti-x"></i> Error
        </span>
      </div>
      <div class="pg-error-box">${e.message}</div>
    `;
  }
}

// ── Render result table ──────────────────────────────────────────────────
function renderResultTable(result) {
  const { columns, values } = result;
  let html = '<div class="pg-table-wrap"><table class="pg-result-table"><thead><tr>';

  for (const col of columns) {
    html += `<th>${col}</th>`;
  }
  html += '</tr></thead><tbody>';

  for (const row of values) {
    html += '<tr>';
    for (const cell of row) {
      if (cell === null) {
        html += '<td><span class="pg-val-null">NULL</span></td>';
      } else if (typeof cell === 'number') {
        html += `<td><span class="pg-val-num">${cell}</span></td>`;
      } else if (typeof cell === 'string' && /^\d{4}-\d{2}-\d{2}/.test(cell)) {
        html += `<td><span class="pg-val-date">${cell}</span></td>`;
      } else {
        html += `<td><span class="pg-val-str">${cell}</span></td>`;
      }
    }
    html += '</tr>';
  }

  html += '</tbody></table></div>';
  return html;
}

// ── Insert snippet ───────────────────────────────────────────────────────
function insertSnippet(text) {
  const ta = document.getElementById('sqlEditor');
  const start = ta.selectionStart;
  ta.value = ta.value.substring(0, start) + text + ta.value.substring(ta.selectionEnd);
  ta.selectionStart = ta.selectionEnd = start + text.length;
  ta.focus();
}

// ── Clear editor ─────────────────────────────────────────────────────────
function clearEditor() {
  document.getElementById('sqlEditor').value = '';
  document.getElementById('sqlEditor').focus();
}

// ── Show all tables query ────────────────────────────────────────────────
function showAllTables() {
  document.getElementById('sqlEditor').value = `SELECT name AS Tables FROM sqlite_master WHERE type='table' ORDER BY name;`;
  runQuery();
}

// ── Toast notification ───────────────────────────────────────────────────
function showToast(msg, type = 'ok') {
  const t = document.getElementById('toast');
  let icon = 'ti-circle-check';
  if (type === 'error') icon = 'ti-alert-circle';
  if (type === 'warn') icon = 'ti-alert-triangle';

  t.innerHTML = `<i class="ti ${icon}"></i> ${msg}`;
  t.className = `pg-toast show`;
  setTimeout(() => t.classList.remove('show'), 3000);
}

// ── Event listeners ──────────────────────────────────────────────────────
document.getElementById('sqlEditor').addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    e.preventDefault();
    runQuery();
  }
  if (e.key === 'Tab') {
    e.preventDefault();
    insertSnippet('  ');
  }
});

// ── Initialize on page load ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initDB();
});
