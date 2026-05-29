const XLSX = require('/tmp/node_modules/xlsx/xlsx.js');
const fs = require('fs');

// Read the workbook from buffer
const fileBuffer = fs.readFileSync('/root/app/code/subjects.xlsx');
const wb = XLSX.read(fileBuffer, { type: 'buffer' });

// Transform raw data to nested structure
function transformData(rawData) {
  const result = {};
  
  // Process each row starting from row 1 (skip header)
  for (let i = 1; i < rawData.length; i++) {
    const row = rawData[i];
    
    // Skip empty rows
    if (!row || row.length === 0 || !row[0]) continue;
    
    const subject = row[0] ? row[0].trim() : null;
    const unit = row[1] ? row[1].trim() : null;
    const topic = row[2] ? row[2].trim() : null;
    
    // Subject only (row has only 1 element or no unit/topic)
    if (subject && !unit && !topic) {
      if (!result[subject]) {
        result[subject] = {};
      }
    }
    // Subject + Unit
    else if (subject && unit && !topic) {
      if (!result[subject]) {
        result[subject] = {};
      }
      if (!result[subject][unit]) {
        result[subject][unit] = [];
      }
    }
    // Subject + Unit + Topic
    else if (subject && unit && topic) {
      if (!result[subject]) {
        result[subject] = {};
      }
      if (!result[subject][unit]) {
        result[subject][unit] = [];
      }
      result[subject][unit].push(topic);
    }
    // No subject (continuation) - use previous subject
    else if (!subject && unit && topic) {
      // Find the last subject that was set
      const lastSubject = Object.keys(result)[Object.keys(result).length - 1];
      if (lastSubject) {
        if (!result[lastSubject][unit]) {
          result[lastSubject][unit] = [];
        }
        result[lastSubject][unit].push(topic);
      }
    }
    // No subject, no unit, but topic (continuation)
    else if (!subject && !unit && topic) {
      // Find the last subject and unit
      const lastSubject = Object.keys(result)[Object.keys(result).length - 1];
      if (lastSubject) {
        const lastUnit = Object.keys(result[lastSubject])[Object.keys(result[lastSubject]).length - 1];
        if (lastUnit) {
          result[lastSubject][lastUnit].push(topic);
        }
      }
    }
  }
  
  return result;
}

// Process all sheets
const finalResult = {};

wb.SheetNames.forEach((sheetName) => {
  const ws = wb.Sheets[sheetName];
  const rawData = XLSX.utils.sheet_to_json(ws, { header: 1 });
  const transformed = transformData(rawData);
  finalResult[sheetName] = transformed;
});

console.log('COMPLETE TRANSFORMED DATA STRUCTURE:\n');
console.log('const subjectsData = ' + JSON.stringify(finalResult, null, 2) + ';');

// Also output as TypeScript export
console.log('\n\n// TypeScript version (ready to copy into your code):\n');
console.log('export const subjectsData = ' + JSON.stringify(finalResult, null, 2) + ' as const;');
