const XLSX = require('/tmp/node_modules/xlsx/xlsx.js');
const fs = require('fs');

// Read the workbook from buffer
const fileBuffer = fs.readFileSync('/root/app/code/subjects.xlsx');
const wb = XLSX.read(fileBuffer, { type: 'buffer' });

function transformSheet(sheetName, rawData) {
  const result = {};
  let currentSubject = null;
  let currentUnit = null;
  
  // Skip header row (row 0)
  for (let i = 1; i < rawData.length; i++) {
    const row = rawData[i];
    
    // Skip empty rows
    if (!row || row.length === 0) continue;
    
    const col0 = row[0] ? String(row[0]).trim() : null;
    const col1 = row[1] ? String(row[1]).trim() : null;
    const col2 = row[2] ? String(row[2]).trim() : null;
    
    // All three columns filled - Subject, Unit, Topic
    if (col0 && col1 && col2) {
      currentSubject = col0;
      currentUnit = col1;
      
      if (!result[currentSubject]) {
        result[currentSubject] = {};
      }
      if (!result[currentSubject][currentUnit]) {
        result[currentSubject][currentUnit] = [];
      }
      result[currentSubject][currentUnit].push(col2);
    }
    // Only col0 filled - Subject only
    else if (col0 && !col1 && !col2) {
      currentSubject = col0;
      currentUnit = null;
      
      if (!result[currentSubject]) {
        result[currentSubject] = {};
      }
    }
    // col0 and col1 filled - Subject and Unit
    else if (col0 && col1 && !col2) {
      currentSubject = col0;
      currentUnit = col1;
      
      if (!result[currentSubject]) {
        result[currentSubject] = {};
      }
      if (!result[currentSubject][currentUnit]) {
        result[currentSubject][currentUnit] = [];
      }
    }
    // Only col1 and col2 filled - continuation (Unit, Topic)
    else if (!col0 && col1 && col2) {
      currentUnit = col1;
      
      if (currentSubject && !result[currentSubject][currentUnit]) {
        result[currentSubject][currentUnit] = [];
      }
      if (currentSubject) {
        result[currentSubject][currentUnit].push(col2);
      }
    }
    // Only col2 filled - continuation (Topic only)
    else if (!col0 && !col1 && col2) {
      if (currentSubject && currentUnit) {
        result[currentSubject][currentUnit].push(col2);
      }
    }
  }
  
  // Clean up empty units/subjects
  Object.keys(result).forEach(subject => {
    Object.keys(result[subject]).forEach(unit => {
      if (Array.isArray(result[subject][unit]) && result[subject][unit].length === 0) {
        delete result[subject][unit];
      }
    });
  });
  
  return result;
}

// Process all sheets
const finalResult = {};

wb.SheetNames.forEach((sheetName) => {
  const ws = wb.Sheets[sheetName];
  const rawData = XLSX.utils.sheet_to_json(ws, { header: 1 });
  const transformed = transformSheet(sheetName, rawData);
  finalResult[sheetName] = transformed;
});

// Output full JSON
console.log('COMPLETE NESTED DATA STRUCTURE (TYPESCRIPT READY):\n');
console.log('export const subjectsData = ' + JSON.stringify(finalResult, null, 2) + ' as const;');
