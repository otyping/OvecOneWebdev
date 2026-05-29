const XLSX = require('/tmp/node_modules/xlsx/xlsx.js');
const fs = require('fs');

// Read the workbook from buffer
const fileBuffer = fs.readFileSync('/root/app/code/subjects.xlsx');
const wb = XLSX.read(fileBuffer, { type: 'buffer' });

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
  
  // Print all rows for inspection
  data.forEach((row, idx) => {
    console.log('Row ' + idx + ': ' + JSON.stringify(row));
  });
  
  result[sheetName] = data;
});

// Output complete data as JSON
console.log('\n========================================\n');
console.log('COMPLETE DATA STRUCTURE:');
console.log(JSON.stringify(result, null, 2));
