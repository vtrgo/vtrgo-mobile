export function groupByPrefix(data: Record<string, any>) {
  const result: Record<string, Record<string, any>> = {};
  for (const key in data) {
    const [prefix, rest] = key.split('.', 2);
    if (!result[prefix]) {
      result[prefix] = {};
    }
    result[prefix][rest] = data[key];
  }
  return result;
}

export function printStructuredJson(data: Record<string, any>) {
  if (!data || typeof data !== 'object') {
    console.warn('Invalid or empty JSON data');
    return;
  }

  Object.entries(data).forEach(([section, content]) => {
    if (typeof content === 'object' && content !== null) {
      console.log(`\n📂 ${section}:`);
      Object.entries(content).forEach(([key, value]) => {
        if (typeof value !== 'object') {
          console.log(`   - ${key}: ${value}`);
        } else {
          console.log(`   - ${key}: [nested object]`);
        }
      });
    } else {
      console.log(`- ${section}: ${content}`);
    }
  });
}