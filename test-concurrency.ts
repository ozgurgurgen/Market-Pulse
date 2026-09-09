async function runWithLimit<T, R>(items: T[], limit: number, asyncFn: (item: T) => Promise<R>): Promise<PromiseSettledResult<R>[]> {
  const startTime = Date.now();
  console.log(`[YahooFinance Limiter] Starting batch of ${items.length} items with concurrency limit ${limit}...`);
  const results: Promise<R>[] = [];
  const executing: Promise<void>[] = [];
  
  for (const item of items) {
    const p = asyncFn(item);
    results.push(p);
    
    if (limit <= items.length) {
      const e = p.then(() => { executing.splice(executing.indexOf(e), 1); }).catch(() => { executing.splice(executing.indexOf(e), 1); });
      executing.push(e);
      if (executing.length >= limit) {
        await Promise.race(executing);
      }
    }
  }
  
  const settled = await Promise.allSettled(results);
  const duration = Date.now() - startTime;
  console.log(`[YahooFinance Limiter] Completed batch of ${items.length} items in ${duration}ms.`);
  return settled;
}

async function test() {
  const items = Array.from({length: 40}, (_, i) => i);
  let currentActive = 0;
  let maxActive = 0;
  
  await runWithLimit(items, 5, async (item) => {
    currentActive++;
    if (currentActive > maxActive) maxActive = currentActive;
    await new Promise(r => setTimeout(r, 100)); // mock 100ms request
    currentActive--;
    return item;
  });
  
  console.log(`Max active concurrent tasks: ${maxActive}`);
  console.log(`Expected max active: 5`);
}

test();
