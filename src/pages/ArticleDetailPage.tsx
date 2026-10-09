import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { newsApi } from '../services/api';
import { Calendar, Clock, ArrowLeft, Tag, Share2, Check, User } from 'lucide-react';

export const ArticleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await newsApi.getOne(id);
        setArticle(data);
      } catch (err) {
        console.error('Failed to load article', err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 selection:bg-sky-500/20 selection:text-sky-900">
      <Navbar />

      <main className="pt-32 pb-24 max-w-4xl mx-auto px-6 sm:px-8">
        {/* Back Link */}
        <button
          onClick={() => navigate('/news')}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to News & Articles
        </button>

        {loading && (
          <div className="py-28 text-center">
            <div className="w-10 h-10 border-3 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-500 font-medium">Loading dispatch content...</p>
          </div>
        )}

        {!loading && !article && (
          <div className="py-20 text-center bg-white rounded-2xl border border-slate-200 p-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Article Not Found</h2>
            <p className="text-slate-500 text-sm mb-6">The publication you are requesting might have been unlisted or moved.</p>
            <Link to="/news" className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-medium">
              Return to Dispatches
            </Link>
          </div>
        )}

        {!loading && article && (
          <article className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 shadow-xs">
            {/* Category & Date Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
                  {article.category}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(article.createdAt).toLocaleDateString(undefined, {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Clock className="w-3.5 h-3.5" />
                  {article.readTimeMinutes || 4} min read
                </span>
              </div>

              <button
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-slate-500" />}
                {copied ? 'Link Copied' : 'Share'}
              </button>
            </div>

            {/* Title & Excerpt */}
            <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-slate-900 tracking-tight leading-tight mb-6">
              {article.title}
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed font-normal mb-8 pb-8 border-b border-slate-100">
              {article.excerpt}
            </p>

            {/* Cover Image if available */}
            {article.coverImage && (
              <div className="mb-10 rounded-2xl overflow-hidden border border-slate-200">
                <img src={article.coverImage} alt={article.title} className="w-full h-auto max-h-[460px] object-cover" />
              </div>
            )}

            {/* Author Profile */}
            <div className="flex items-center gap-3.5 p-4 rounded-xl bg-slate-50 border border-slate-100 mb-10">
              <div className="w-11 h-11 rounded-full bg-sky-100 border border-sky-200 flex items-center justify-center text-sky-700 font-semibold">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-slate-900 text-sm">{article.author?.name || 'AAU Biomedical Research Team'}</p>
                <p className="text-slate-500 text-xs">{article.author?.role || 'Addis Ababa University & Tikur Anbessa Hospital'}</p>
              </div>
            </div>

            {/* Body Content */}
            <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-4 text-base sm:text-lg">
              {article.content.split('\n\n').map((paragraph: string, idx: number) => {
                if (paragraph.startsWith('## ')) {
                  return <h2 key={idx} className="font-display font-bold text-2xl text-slate-900 mt-8 mb-4">{paragraph.replace('## ', '')}</h2>;
                }
                if (paragraph.startsWith('### ')) {
                  return <h3 key={idx} className="font-display font-semibold text-xl text-slate-900 mt-6 mb-3">{paragraph.replace('### ', '')}</h3>;
                }
                if (paragraph.startsWith('- ')) {
                  const points = paragraph.split('\n').map((p) => p.replace(/^- /, ''));
                  return (
                    <ul key={idx} className="list-disc pl-5 space-y-1 my-3">
                      {points.map((pt, pIdx) => (
                        <li key={pIdx} className="text-slate-700 text-base">{pt}</li>
                      ))}
                    </ul>
                  );
                }
                return (
                  <p key={idx} className="leading-relaxed">
                    {paragraph}
                  </p>
                );
              })}
            </div>

            {/* Tags footer */}
            {article.tags && article.tags.length > 0 && (
              <div className="mt-12 pt-6 border-t border-slate-100 flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-2">Tags:</span>
                {article.tags.map((tag: string, tIdx: number) => (
                  <span
                    key={tIdx}
                    className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700"
                  >
                    <Tag className="w-3 h-3 text-slate-400" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </article>
        )}
      </main>

      <Footer />
    </div>
  );
};
