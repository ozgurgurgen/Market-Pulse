async function runWithLimit(items, limit, asyncFn) {
  const results = [];
  const executing = [];
  for (const item of items) {
    const p = asyncFn(item);
    results.push(p);
    
    if (limit <= items.length) {
      const e = p.then(() => executing.splice(executing.indexOf(e), 1));
      executing.push(e);
      if (executing.length >= limit) {
        await Promise.race(executing);
      }
    }
  }
  return Promise.allSettled(results);
}
