export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  source: string;
  image?: string;
  category?: string;
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresIn: number;
}

class NewsService {
  private gnewsApiKey: string;
  private cache = new Map<string, CacheEntry<NewsArticle[]>>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  constructor() {
    this.gnewsApiKey = import.meta.env.VITE_GNEWS_API_KEY;
    
    if (!this.gnewsApiKey) {
      throw new Error('VITE_GNEWS_API_KEY is required. Please add it to your .env file.');
    }
  }

  private getCacheKey(query: string, limit: number): string {
    return `${query}-${limit}`;
  }

  private isValidCache<T>(entry: CacheEntry<T>): boolean {
    return Date.now() - entry.timestamp < entry.expiresIn;
  }

  private setCache<T>(key: string, data: T, expiresIn: number = this.CACHE_DURATION): void {
    this.cache.set(key, {
      data: data as NewsArticle[],
      timestamp: Date.now(),
      expiresIn,
    });
  }

  private getCache(key: string): NewsArticle[] | null {
    const entry = this.cache.get(key);
    if (entry && this.isValidCache(entry)) {
      console.log(`Cache hit for key: ${key}`);
      return entry.data;
    }
    
    if (entry) {
      console.log(`Cache expired for key: ${key}`);
      this.cache.delete(key);
    }
    
    return null;
  }

  clearCache(): void {
    this.cache.clear();
    console.log('News service cache cleared');
  }

  async searchNews(query: string, limit: number = 10): Promise<NewsArticle[]> {
    const cacheKey = this.getCacheKey(`search-${query}`, limit);
    
    // Check cache first
    const cachedData = this.getCache(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    try {
      console.log(`Making API call for: ${query}`);
      
      // Construct GNews API URL
      const gnewsUrl = new URL('https://gnews.io/api/v4/search');
      gnewsUrl.searchParams.set('q', query);
      gnewsUrl.searchParams.set('lang', 'en');
      gnewsUrl.searchParams.set('country', 'us');
      gnewsUrl.searchParams.set('max', Math.min(limit, 10).toString()); // GNews free tier allows max 10
      gnewsUrl.searchParams.set('apikey', this.gnewsApiKey);

      const response = await fetch(gnewsUrl.toString());

      if (!response.ok) {
        const errorText = await response.text();
        console.error('GNews API Error:', errorText);
        throw new Error(`GNews API error (${response.status}): ${errorText}`);
      }

      const result = await response.json();
      
      // Check if the response contains articles
      if (!result.articles || !Array.isArray(result.articles)) {
        console.error('Invalid GNews response:', result);
        throw new Error('Invalid response from news service');
      }

      // Transform GNews articles to our NewsArticle format
      const articles: NewsArticle[] = result.articles.map((article: any) => ({
        title: article.title || 'No title available',
        description: article.description || 'No description available',
        url: article.url || '',
        publishedAt: article.publishedAt || new Date().toISOString(),
        source: article.source?.name || 'Unknown source',
        image: article.image || undefined,
      }));

      // Cache the results
      this.setCache(cacheKey, articles);

      return articles;
    } catch (error) {
      console.error('Error searching news:', error);
      // Return empty array if search fails
      return [];
    }
  }

  async getNewsByCategory(category: string, limit: number = 10): Promise<NewsArticle[]> {
    const cacheKey = this.getCacheKey(`category-${category}`, limit);
    
    // Check cache first
    const cachedData = this.getCache(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    try {
      console.log(`Making API call for category: ${category}`);
      
      if (category === 'all') {
        // For 'all' category, get general news
        return this.searchNews('latest news', limit);
      }

      // Map categories to search terms that work well with GNews
      const categoryQueries: Record<string, string> = {
        technology: 'technology tech AI software',
        science: 'science research discovery',
        business: 'business economy finance market',
        health: 'health medical healthcare',
        sports: 'sports football basketball',
        entertainment: 'entertainment movies music',
        politics: 'politics government election',
        world: 'world international global',
      };

      const query = categoryQueries[category] || category;
      const articles = await this.searchNews(query, limit);
      
      // Add category information to articles
      const categorizedArticles = articles.map(article => ({
        ...article,
        category: category,
      }));

      // Cache the categorized results separately
      this.setCache(cacheKey, categorizedArticles);

      return categorizedArticles;
    } catch (error) {
      console.error(`Error fetching ${category} news:`, error);
      return [];
    }
  }

  // Client-side filtering for better categorization
  filterArticlesByCategory(articles: NewsArticle[], category: string): NewsArticle[] {
    if (category === 'all') return articles;

    const categoryKeywords: Record<string, string[]> = {
      technology: ['tech', 'ai', 'software', 'computer', 'digital', 'internet', 'app', 'startup'],
      science: ['science', 'research', 'study', 'discovery', 'experiment', 'scientist'],
      business: ['business', 'economy', 'market', 'finance', 'company', 'stock', 'trade'],
      health: ['health', 'medical', 'doctor', 'hospital', 'medicine', 'disease', 'treatment'],
      sports: ['sports', 'game', 'team', 'player', 'match', 'championship', 'league'],
      entertainment: ['movie', 'music', 'celebrity', 'film', 'show', 'entertainment', 'actor'],
      politics: ['politics', 'government', 'election', 'president', 'congress', 'policy'],
      world: ['world', 'international', 'global', 'country', 'nation', 'foreign'],
    };

    const keywords = categoryKeywords[category] || [];
    
    return articles.filter(article => {
      const text = `${article.title} ${article.description}`.toLowerCase();
      return keywords.some(keyword => text.includes(keyword));
    });
  }

  // Get trending topics (mock implementation for now)
  async getTrendingTopics(): Promise<string[]> {
    const cacheKey = 'trending-topics';
    const cachedData = this.getCache(cacheKey);
    
    if (cachedData) {
      return cachedData as unknown as string[];
    }

    // This would typically come from a trending topics API
    const topics = [
      'AI Technology',
      'Climate Change',
      'Space Exploration',
      'Cryptocurrency',
      'Healthcare Innovation',
      'Renewable Energy',
      'Global Economy',
      'Sports Championships',
    ];

    // Cache trending topics for longer (30 minutes)
    this.setCache(cacheKey, topics as unknown as NewsArticle[], 30 * 60 * 1000);

    return topics;
  }
}

export const newsService = new NewsService();