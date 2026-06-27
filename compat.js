/* ============================================================
   compat.js — MySQL → SQLite command translation
   ============================================================ */

const COMPAT_RULES = [
  {
    id: 'desc',
    pattern: /^\s*DESC(?:RIBE)?\s+(\w+)\s*;?\s*$/i,
    translate: (m) => `PRAGMA table_info(${m[1]})`,
    mysql: `DESC ${'{table}'}`,
    sqlite: `PRAGMA table_info(${'{table}'})`,
    note: 'MySQL\'s DESC/DESCRIBE command is not supported in SQLite. Use PRAGMA table_info() to inspect a table\'s columns, types, and constraints.'
  },

  {
    id: 'show_tables',
    pattern: /^\s*SHOW\s+TABLES\s*;?\s*$/i,
    translate: () => `SELECT name AS Tables FROM sqlite_master WHERE type='table' ORDER BY name`,
    mysql: 'SHOW TABLES',
    sqlite: `SELECT name FROM sqlite_master WHERE type='table'`,
    note: 'MySQL\'s SHOW TABLES lists all tables in the current database. In SQLite, the same info lives in the sqlite_master system table.'
  },

  {
    id: 'show_databases',
    pattern: /^\s*SHOW\s+DATABASES\s*;?\s*$/i,
    translate: () => null,
    mysql: 'SHOW DATABASES',
    sqlite: '(not applicable)',
    note: 'SQLite is a file-based engine — there is only one database per file. The concept of multiple databases does not exist here.',
    noRun: true
  },

  {
    id: 'show_create',
    pattern: /^\s*SHOW\s+CREATE\s+TABLE\s+(\w+)\s*;?\s*$/i,
    translate: (m) => `SELECT sql AS 'Create Table' FROM sqlite_master WHERE type='table' AND name='${m[1]}'`,
    mysql: `SHOW CREATE TABLE ${'{table}'}`,
    sqlite: `SELECT sql FROM sqlite_master WHERE name='${'{table}'}'`,
    note: 'MySQL\'s SHOW CREATE TABLE returns the original CREATE TABLE statement. In SQLite, the equivalent is stored in sqlite_master.sql.'
  },

  {
    id: 'show_columns',
    pattern: /^\s*SHOW\s+(?:FULL\s+)?COLUMNS\s+FROM\s+(\w+)\s*;?\s*$/i,
    translate: (m) => `PRAGMA table_info(${m[1]})`,
    mysql: `SHOW COLUMNS FROM ${'{table}'}`,
    sqlite: `PRAGMA table_info(${'{table}'})`,
    note: 'SHOW COLUMNS is MySQL-specific. In SQLite, PRAGMA table_info() returns column names, types, and NOT NULL / default / PK info.'
  },

  {
    id: 'show_indexes',
    pattern: /^\s*SHOW\s+(?:INDEX|INDEXES|KEYS)\s+FROM\s+(\w+)\s*;?\s*$/i,
    translate: (m) => `PRAGMA index_list(${m[1]})`,
    mysql: `SHOW INDEX FROM ${'{table}'}`,
    sqlite: `PRAGMA index_list(${'{table}'})`,
    note: 'MySQL\'s SHOW INDEX/KEYS lists all indexes on a table. In SQLite, use PRAGMA index_list() for a summary and PRAGMA index_info() for column details.'
  },

  {
    id: 'explain',
    pattern: /^\s*EXPLAIN\s+(?!FORMAT)/i,
    translate: (m, raw) => `EXPLAIN QUERY PLAN ${raw.replace(/^\s*EXPLAIN\s+/i, '')}`,
    mysql: 'EXPLAIN SELECT ...',
    sqlite: 'EXPLAIN QUERY PLAN SELECT ...',
    note: 'MySQL\'s EXPLAIN analyzes a query\'s execution plan. SQLite uses EXPLAIN QUERY PLAN which shows the same high-level access strategy.'
  },

  {
    id: 'use_db',
    pattern: /^\s*USE\s+\w+\s*;?\s*$/i,
    translate: () => null,
    mysql: 'USE database_name',
    sqlite: '(not applicable)',
    note: 'The USE statement switches active databases in MySQL. SQLite has no concept of switching databases — you work with one file at a time.',
    noRun: true
  },

  {
    id: 'show_status',
    pattern: /^\s*SHOW\s+(?:TABLE\s+)?STATUS\s*;?\s*$/i,
    translate: () => `SELECT name, 'SQLite' AS engine FROM sqlite_master WHERE type='table'`,
    mysql: 'SHOW TABLE STATUS',
    sqlite: `SELECT name FROM sqlite_master WHERE type='table'`,
    note: 'SHOW TABLE STATUS returns storage engine, row count, and other metadata in MySQL. SQLite has no equivalent — table stats are not stored the same way.'
  }
];

const GENERIC_MYSQL_HINTS = [
  { mysql: 'DESC / DESCRIBE table', sqlite: 'PRAGMA table_info(table)', note: 'Inspect column names, types, constraints' },
  { mysql: 'SHOW TABLES', sqlite: "SELECT name FROM sqlite_master WHERE type='table'", note: 'List all tables' },
  { mysql: 'SHOW DATABASES', sqlite: '(not applicable)', note: 'SQLite is single-file — no multi-DB support' },
  { mysql: 'SHOW CREATE TABLE t', sqlite: "SELECT sql FROM sqlite_master WHERE name='t'", note: 'View CREATE TABLE DDL' },
  { mysql: 'SHOW COLUMNS FROM t', sqlite: 'PRAGMA table_info(t)', note: 'List columns of a table' },
  { mysql: 'SHOW INDEX FROM t', sqlite: 'PRAGMA index_list(t)', note: 'List indexes on a table' },
  { mysql: 'EXPLAIN SELECT ...', sqlite: 'EXPLAIN QUERY PLAN SELECT ...', note: 'Analyze query execution plan' },
  { mysql: 'USE database', sqlite: '(not applicable)', note: 'SQLite has no USE statement' },
  { mysql: 'SHOW TABLE STATUS', sqlite: "SELECT name FROM sqlite_master WHERE type='table'", note: 'Table metadata overview' }
];

/**
 * Detect if a SQL statement is a MySQL-specific command
 * @param {string} sql Raw SQL input
 * @returns {object|null} Rule match or null
 */
function detectCompat(sql) {
  for (const rule of COMPAT_RULES) {
    const m = sql.match(rule.pattern);
    if (m) return { rule, match: m };
  }
  return null;
}

/**
 * Render a compatibility explanation card
 * @param {object} rule The compat rule
 * @param {array} match Regex match
 * @param {string} translatedSQL The translated SQLite command
 * @returns {string} HTML
 */
function renderCompatCard(rule, match, translatedSQL) {
  const fixBtn = (rule.noRun || !translatedSQL)
    ? ''
    : `<button class="pg-compat-fix-btn" onclick="applyFix(${JSON.stringify(translatedSQL)})">
        <i class="ti ti-wand"></i> Auto-fix & run
       </button>`;

  const translatedBox = translatedSQL
    ? `<div class="pg-compat-translated">
        <i class="ti ti-arrows-exchange"></i>
        <strong>Translates to:</strong> <code>${translatedSQL}</code>
       </div>`
    : '';

  const refRows = GENERIC_MYSQL_HINTS.map(h => `
    <tr>
      <td class="td-mysql">${h.mysql}</td>
      <td class="td-sqlite">${h.sqlite}</td>
      <td>${h.note}</td>
    </tr>`).join('');

  return `
    <div class="pg-compat-card">
      <div class="pg-compat-head">
        <i class="ti ti-alert-triangle"></i>
        <span class="pg-compat-head-title">MySQL syntax — not supported in SQLite</span>
        <span class="pg-compat-head-sub">This playground runs SQLite, not MySQL</span>
      </div>
      <div class="pg-compat-body">
        <p class="pg-compat-note">${rule.note}</p>
        ${translatedBox}
        ${fixBtn}
        <div class="pg-compat-ref-title">Full MySQL → SQLite reference</div>
        <table class="pg-compat-ref-table">
          <thead>
            <tr>
              <th>MySQL command</th>
              <th>SQLite equivalent</th>
              <th>What it does</th>
            </tr>
          </thead>
          <tbody>
            ${refRows}
          </tbody>
        </table>
      </div>
    </div>`;
}

/**
 * Apply a fix: set editor text and run query
 */
function applyFix(sql) {
  document.getElementById('sqlEditor').value = sql;
  runQuery();
}
