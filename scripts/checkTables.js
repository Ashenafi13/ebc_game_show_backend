require('dotenv').config();
const sql = require('mssql');

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_HOST,
  database: process.env.DB_NAME,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

async function checkTables() {
  try {
    await sql.connect(config);
    console.log('Connected to database successfully!\n');

    // Get all tables
    const tablesResult = await sql.query`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_TYPE = 'BASE TABLE'
      ORDER BY TABLE_NAME
    `;

    console.log('=== TABLES IN DATABASE ===\n');
    console.log(`Found ${tablesResult.recordset.length} tables:\n`);

    // For each table, get its structure
    for (const table of tablesResult.recordset) {
      const tableName = table.TABLE_NAME;
      console.log(`\n--- Table: ${tableName} ---`);

      // Get columns
      const columnsResult = await sql.query`
        SELECT 
          COLUMN_NAME,
          DATA_TYPE,
          CHARACTER_MAXIMUM_LENGTH,
          IS_NULLABLE,
          COLUMN_DEFAULT
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_NAME = ${tableName}
        ORDER BY ORDINAL_POSITION
      `;

      console.log('Columns:');
      columnsResult.recordset.forEach(col => {
        const length = col.CHARACTER_MAXIMUM_LENGTH ? `(${col.CHARACTER_MAXIMUM_LENGTH})` : '';
        const nullable = col.IS_NULLABLE === 'YES' ? 'NULL' : 'NOT NULL';
        const defaultVal = col.COLUMN_DEFAULT ? `DEFAULT ${col.COLUMN_DEFAULT}` : '';
        console.log(`  - ${col.COLUMN_NAME}: ${col.DATA_TYPE}${length} ${nullable} ${defaultVal}`);
      });

      // Get primary keys
      const pkResult = await sql.query`
        SELECT COLUMN_NAME
        FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
        WHERE OBJECTPROPERTY(OBJECT_ID(CONSTRAINT_SCHEMA + '.' + CONSTRAINT_NAME), 'IsPrimaryKey') = 1
        AND TABLE_NAME = ${tableName}
      `;

      if (pkResult.recordset.length > 0) {
        console.log('Primary Key(s):');
        pkResult.recordset.forEach(pk => {
          console.log(`  - ${pk.COLUMN_NAME}`);
        });
      }

      // Get foreign keys
      const fkResult = await sql.query`
        SELECT 
          fk.name AS FK_NAME,
          COL_NAME(fkc.parent_object_id, fkc.parent_column_id) AS COLUMN_NAME,
          OBJECT_NAME(fkc.referenced_object_id) AS REFERENCED_TABLE,
          COL_NAME(fkc.referenced_object_id, fkc.referenced_column_id) AS REFERENCED_COLUMN
        FROM sys.foreign_keys AS fk
        INNER JOIN sys.foreign_key_columns AS fkc 
          ON fk.object_id = fkc.constraint_object_id
        WHERE OBJECT_NAME(fkc.parent_object_id) = ${tableName}
      `;

      if (fkResult.recordset.length > 0) {
        console.log('Foreign Key(s):');
        fkResult.recordset.forEach(fk => {
          console.log(`  - ${fk.COLUMN_NAME} -> ${fk.REFERENCED_TABLE}(${fk.REFERENCED_COLUMN})`);
        });
      }

      // Get sample row count
      const countQuery = `SELECT COUNT(*) as count FROM [${tableName}]`;
      const countResult = await sql.query(countQuery);
      console.log(`Row count: ${countResult.recordset[0].count}`);
    }

    console.log('\n\n=== DATABASE INSPECTION COMPLETE ===\n');

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await sql.close();
  }
}

checkTables();

