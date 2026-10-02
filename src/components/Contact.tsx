import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, Linkedin } from 'lucide-react';
import { content } from '../data/content';

const TelegramIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="m20.665 3.717-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42 10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.701h-.002l-.002.001-.314 4.692c.46 0 .663-.211.921-.46l2.211-2.15 4.599 3.397c.848.467 1.457.227 1.668-.785l3.019-14.228c.309-1.239-.473-1.8-1.282-1.434z" />
  </svg>
);

const socialIconMap: Record<string, React.FC<{ className?: string }>> = {
  Linkedin,
  Mail,
  Telegram: TelegramIcon,
};

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => { setIsSubmitting(false); setSubmitted(true); }, 800);
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <section id="contact" className="relative py-20 lg:py-28 bg-[#f8fafc]">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-10">
        {/* Header */}
        <div className="max-w-2xl mb-12">
          <p className="text-base font-medium text-sky-600 mb-3">Get in Touch</p>
          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-slate-900 tracking-tight mb-4">
            {content.contact.headline}
          </h2>
          <p className="text-lg text-slate-500 leading-relaxed">
            {content.contact.subheadline}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Form */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl p-8 lg:p-10 bg-white border border-slate-200/80">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-14 text-center"
                >
                  <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h3 className="font-display font-bold text-2xl text-slate-900 mb-2">Message Sent</h3>
                  <p className="text-base text-slate-500 max-w-sm mx-auto mb-6">
                    Thank you, {formData.name || 'there'}. We'll get back to you within 24–48 hours.
                  </p>
                  <button onClick={handleReset} className="px-7 py-3 rounded-lg bg-slate-900 text-white text-base font-medium hover:bg-slate-800 transition-colors">
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="name" className="block text-base font-medium text-slate-700 mb-2">Name</label>
                      <input
                        type="text" id="name" required placeholder="Your name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3.5 rounded-lg bg-[#f8fafc] border border-slate-200 text-slate-900 placeholder:text-slate-400 text-base focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all outline-none"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-base font-medium text-slate-700 mb-2">Email</label>
                      <input
                        type="email" id="email" required placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3.5 rounded-lg bg-[#f8fafc] border border-slate-200 text-slate-900 placeholder:text-slate-400 text-base focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-base font-medium text-slate-700 mb-2">Message</label>
                    <textarea
                      id="message" rows={5} required
                      placeholder="Tell us about your project or inquiry..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3.5 rounded-lg bg-[#f8fafc] border border-slate-200 text-slate-900 placeholder:text-slate-400 text-base focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all outline-none resize-y"
                    />
                  </div>
                  <button
                    type="submit" disabled={isSubmitting}
                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-slate-900 text-white text-base font-medium hover:bg-slate-800 transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /><span>Sending...</span></>
                    ) : (
                      <><span>Send Message</span><Send className="w-4 h-4 opacity-50" /></>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-6">
              {[
                { icon: Mail, label: 'Email', value: content.contact.email, href: `mailto:${content.contact.email}`, isLink: true },
                { icon: Phone, label: 'Phone', value: content.contact.phone },
                { icon: MapPin, label: 'Location', value: content.contact.address, sub: content.contact.labLocation },
                { icon: Clock, label: 'Hours', value: content.contact.officeHours },
              ].map(({ icon: Icon, label, value, href, isLink, sub }) => (
                <div key={label} className="flex items-start gap-4">
                  <Icon className="w-5 h-5 text-slate-400 mt-1 shrink-0" />
                  <div>
                    <p className="text-sm text-slate-400 uppercase tracking-wide mb-0.5">{label}</p>
                    {isLink ? (
                      <a href={href} className="text-base font-medium text-slate-900 hover:text-sky-600 transition-colors">{value}</a>
                    ) : (
                      <span className="text-base font-medium text-slate-900 block">{value}</span>
                    )}
                    {sub && <span className="text-sm text-slate-500 mt-0.5 block">{sub}</span>}
                  </div>
                </div>
              ))}
            </div>

            {/* Socials */}
            <div className="pt-6 border-t border-slate-200">
              <div className="flex items-center gap-3">
                {content.contact.socials.map((social) => {
                  const Icon = socialIconMap[social.icon] || Mail;
                  return (
                    <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer"
                      className="p-3 rounded-lg bg-white text-slate-500 hover:text-slate-900 border border-slate-200 hover:border-slate-300 transition-colors"
                      aria-label={social.name}
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
