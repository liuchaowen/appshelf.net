import { useState, useEffect } from 'react';

interface AppItem {
  name: string;
  cate: string;
  hidden_img_src: string;
  coverlink_href: string;
  rating: string;
}

interface ArticleItem {
  url: string;
  image: string;
  title: string;
}

interface SearchResult {
  apps: AppItem[];
  games: AppItem[];
  articles: ArticleItem[];
}

export const useSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult>({
    apps: [],
    games: [],
    articles: []
  });
  const [isSearching, setIsSearching] = useState(false);
  const [allData, setAllData] = useState<{ apps: AppItem[]; games: AppItem[]; articles: ArticleItem[] }>({
    apps: [],
    games: [],
    articles: []
  });
  const [dataLoaded, setDataLoaded] = useState(false);

  // 加载所有静态数据
  useEffect(() => {
    const loadData = async () => {
      try {
        const [homeData, articleData] = await Promise.all([
          fetch('/assets/data/json/home.json').then(res => res.json()),
          fetch('/assets/data/json/article.json').then(res => res.json())
        ]);

        // 处理 home.json 数据，区分 apps 和 games
        const apps: AppItem[] = [];
        const games: AppItem[] = [];
        
        homeData.forEach((section: any) => {
          if (section.items && Array.isArray(section.items)) {
            const items = section.items as AppItem[];
            
            // 根据 section_title 判断是 games 还是 apps
            if (section.section_title && section.section_title.includes('Games')) {
              games.push(...items);
            } else {
              apps.push(...items);
            }
          }
        });

        setAllData({
          apps: apps,
          games: games,
          articles: articleData
        });
        setDataLoaded(true);
      } catch (error) {
        console.error('Failed to load search data:', error);
        setDataLoaded(true);
      }
    };

    loadData();
  }, []);

  // 执行搜索
  const search = (searchQuery: string) => {
    if (!dataLoaded) return;
    
    setIsSearching(true);
    const q = searchQuery.toLowerCase().trim();
    if (!q) {
      setResults({ apps: [], games: [], articles: [] });
      setIsSearching(false);
      return;
    }

    // 搜索 apps
    const matchedApps = allData.apps.filter(app =>
      app.name.toLowerCase().includes(q) ||
      app.cate.toLowerCase().includes(q)
    );

    // 搜索 games (数据结构与 apps 相同)
    const matchedGames = allData.games.filter(game =>
      game.name.toLowerCase().includes(q) ||
      game.cate.toLowerCase().includes(q)
    );

    // 搜索 articles
    const matchedArticles = allData.articles.filter(article =>
      article.title.toLowerCase().includes(q)
    );
    setResults({
      apps: matchedApps,
      games: matchedGames,
      articles: matchedArticles
    });

    setIsSearching(false);
  };

  return {
    query,
    setQuery,
    results,
    isSearching,
    search,
    dataLoaded
  };
};