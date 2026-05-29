const XLSX = require('/tmp/node_modules/xlsx');

// Read the workbook
const wb = XLSX.readFile('/tmp/subjects.xlsx');

console.log('Sheet names:', wb.SheetNames);
console.log('\n========================================\n');

const result = {};

// Parse each sheet
wb.SheetNames.forEach((sheetName) => {
  const ws = wb.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
  
  console.log('\nSheet: "' + sheetName + '"');
  console.log('-'.repeat(60));
  console.log('Rows: ' + data.length);
  
  // Print first 20 rows for inspection
  data.slice(0, 20).forEach((row, idx) => {
    console.log('Row ' + idx + ': ' + JSON.stringify(row));
  });
  
  result[sheetName] = data;
});

// Output complete data as JSON
console.log('\n========================================\n');
console.log('COMPLETE DATA STRUCTURE:');
console.log(JSON.stringify(result, null, 2));
