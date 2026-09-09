const fs = require('fs');
const file = 'src/components/MarketNewsSection.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/import \{ NEWS_CATEGORIES, INITIAL_MARKET_NEWS, STREAMING_HEADLINES_POOL \} from '\.\.\/data\/newsData';/, `import { NEWS_CATEGORIES } from '../data/newsData';\nimport { safeFetchJson } from '../utils/apiClient';`);

content = content.replace(/const \[newsList, setNewsList\] = useState<MarketNewsItem\[\]>\(\(\) => \{[\s\S]*?\}\);/, `const [newsList, setNewsList] = useState<MarketNewsItem[]>([]);\n  const [isLoading, setIsLoading] = useState(true);`);

content = content.replace(/useEffect\(\(\) => \{[\s\S]*?\}, \[initialNewsProp\]\);[\s\S]*?return \(\) => clearInterval\(interval\);\n  \}, \[isLiveStreaming, streamSpeed\]\);/, `useEffect(() => {
    let mounted = true;
    const fetchNews = async () => {
      setIsLoading(true);
      if (initialNewsProp && initialNewsProp.length > 4) {
        setNewsList(initialNewsProp);
        setIsLoading(false);
        return;
      }
      try {
        const res = await safeFetchJson<{ success: boolean; news: MarketNewsItem[] }>('/api/market/news');
        if (mounted && res && res.news && res.news.length > 0) {
          setNewsList(res.news);
        } else if (mounted) {
           setNewsList([]);
        }
      } catch (err) {
        console.error('Failed to fetch news', err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    fetchNews();
    return () => { mounted = false; };
  }, [initialNewsProp]);`);

fs.writeFileSync(file, content);
