export function groupByPrefix(data: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};
  // console.log('groupByPrefix input keys:', Object.keys(data));

  for (const key in data) {
    const parts = key.split('.');
    // console.log(`Processing key: "${key}" split into parts:`, parts);
    let currentLevel = result;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (i === parts.length - 1) {
        // console.log(`Assigning value for key "${part}":`, data[key]);
        currentLevel[part] = data[key];
      } else {
        if (!currentLevel[part] || typeof currentLevel[part] !== 'object') {
          currentLevel[part] = {};
          // console.log(`Created nested object for part "${part}"`);
        }
        currentLevel = currentLevel[part];
      }
    }
  }

  // console.log('groupByPrefix output:', JSON.stringify(result, null, 2));
  return result;
}



export function printStructuredJson(data: Record<string, any>) {
  if (!data || typeof data !== 'object') {
    console.warn('Invalid or empty JSON data');
    return;
  }

  Object.entries(data).forEach(([section, content]) => {
    if (typeof content === 'object' && content !== null) {
      // console.log(`\n📂 ${section}:`);
      Object.entries(content).forEach(([key, value]) => {
        if (typeof value !== 'object') {
          // console.log(`   - ${key}: ${value}`);
        } else {
          // console.log(`   - ${key}: [nested object]`);
        }
      });
    } else {
      // console.log(`- ${section}: ${content}`);
    }
  });
}