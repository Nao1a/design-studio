import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { newsApi } from '../services/api';
import { Calendar, Clock, ArrowRight, Tag, BookOpen, Search } from 'lucide-react';

interface Article {
  _id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  author?: {
    name: string;
    role: string;
  };
  tags: string[];
  readTimeMinutes: number;
  createdAt: string;
}

export const NewsPage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Research', 'Clinical Trials', 'Studio News', 'Awards & Grants'];

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const data = await newsApi.getAllPublic();
        setArticles(data);
      } catch (err) {
        console.error('Failed to load news articles', err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const filteredArticles = articles.filter((art) => {
    const matchesCat = selectedCategory === 'All' || art.category === selectedCategory;
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 selection:bg-sky-500/20 selection:text-sky-900">
      <Navbar />

      <main className="pt-32 pb-24 max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-white border border-slate-200/80 mb-4 shadow-xs">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-800">Studio Dispatches & Science</p>
          </div>
          <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-slate-900 tracking-tight mb-4">
            News, Research & Breakthroughs
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 leading-relaxed">
            Follow the latest clinical trial milestones, research publications, prototype updates, and community dispatches from our Addis Ababa biomedical cleanrooms.
          </p>
        </div>

        {/* Filter bar & Search */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-200">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search articles, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
            />
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="py-24 text-center">
            <div className="w-10 h-10 border-3 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-500 font-medium">Loading latest dispatches...</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && filteredArticles.length === 0 && (
          <div className="py-20 text-center bg-white rounded-2xl border border-slate-200/80 p-8">
            <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="font-display font-semibold text-xl text-slate-800 mb-1">No articles found</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto">
              We couldn't find any articles matching your search query or filter. Try choosing another category or clearing your search.
            </p>
          </div>
        )}

        {/* Articles Grid */}
        {!loading && filteredArticles.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article, idx) => (
              <motion.article
                key={article._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
                className="group flex flex-col bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md hover:border-sky-300 transition-all"
              >
                {/* Cover Image or Gradient Placeholder */}
                <div className="relative h-48 w-full bg-slate-900 overflow-hidden">
                  {article.coverImage ? (
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-linear-to-br from-slate-900 via-sky-950 to-slate-900 p-6 flex flex-col justify-end">
                      <div className="w-10 h-10 rounded-lg bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400 mb-2">
                        <BookOpen className="w-5 h-5" />
                      </div>
                    </div>
                  )}
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold bg-white/90 text-slate-900 backdrop-blur-md shadow-xs">
                    {article.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Meta Info */}
                    <div className="flex items-center gap-3 text-xs text-slate-400 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(article.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {article.readTimeMinutes || 4} min read
                      </span>
                    </div>

                    <h2 className="font-display font-bold text-xl text-slate-900 group-hover:text-sky-600 transition-colors line-clamp-2 mb-2.5">
                      <Link to={`/news/${article._id}`}>
                        {article.title}
                      </Link>
                    </h2>

                    <p className="text-slate-600 text-sm line-clamp-3 leading-relaxed mb-4">
                      {article.excerpt}
                    </p>
                  </div>

                  <div>
                    {/* Tags */}
                    {article.tags && article.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {article.tags.slice(0, 3).map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600"
                          >
                            <Tag className="w-2.5 h-2.5 text-slate-400" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Bottom Author & Link */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div className="text-xs">
                        <p className="font-semibold text-slate-800">{article.author?.name || 'Studio Research Staff'}</p>
                        <p className="text-slate-400 text-[11px]">{article.author?.role || 'AAU Biomedical'}</p>
                      </div>
                      <Link
                        to={`/news/${article._id}`}
                        className="inline-flex items-center gap-1 text-sm font-semibold text-sky-600 group-hover:text-sky-700 transition-colors"
                      >
                        Read Article
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};
