#!/bin/bash
sed -i -e '/const filteredSearchResults = searchQuery.trim() /c \
  const [remoteSearchResults, setRemoteSearchResults] = useState<StockQuote[]>([]);\
  const [isSearching, setIsSearching] = useState(false);\
  useEffect(() => {\
    if (!searchQuery.trim()) {\
      setRemoteSearchResults([]);\
      setIsSearching(false);\
      return;\
    }\
    const delayDebounceFn = setTimeout(() => {\
      setIsSearching(true);\
      fetch(`/api/market/search?q=${searchQuery.trim()}`)\
        .then(res => res.json())\
        .then(data => {\
          setRemoteSearchResults(data.quotes || []);\
        })\
        .catch(() => setRemoteSearchResults([]))\
        .finally(() => setIsSearching(false));\
    }, 500);\
    return () => clearTimeout(delayDebounceFn);\
  }, [searchQuery]);\
\
  const filteredSearchResults = remoteSearchResults; // We replace local search with remote' src/components/Header.tsx

