import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, Linkedin, AlertCircle } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { contactApi } from '../services/api';

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
  const { siteContent } = useSiteData();
  const contactData = siteContent?.contact || {
    badge: 'Get in Touch',
    headline: 'Initiate a Research Collaboration or Clinical Inquiry',
    subheadline: 'Connect with our team of biomedical engineers, surgeons, and investigators.',
    email: 'biomedical.studio@aau.edu.et',
    phone: '+251 11 123 4567',
    address: 'AAU Institute of Technology (AAiT), King George VI St, Addis Ababa, Ethiopia',
    labLocation: 'Block 4, 3rd Floor, Biomaterials & Prototyping Cleanroom',
    officeHours: 'Mon – Fri: 08:30 – 17:30 EAT',
    socials: [
      { name: 'Linkedin', url: 'https://linkedin.com', icon: 'Linkedin' },
      { name: 'Mail', url: 'mailto:biomedical.studio@aau.edu.et', icon: 'Mail' },
      { name: 'Telegram', url: 'https://t.me', icon: 'Telegram' },
    ],
  };

  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [emailDispatched, setEmailDispatched] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = await contactApi.send({
        name: formData.name,
        email: formData.email,
        subject: formData.subject || 'Website General Inquiry',
        message: formData.message,
      });

      setEmailDispatched(!!res.emailNotified);
      setSubmitted(true);
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.message || err.message || 'Failed to deliver message. Please try again or email us directly.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <section id="contact" className="relative py-20 lg:py-28 bg-[#f8fafc]">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-10">
        {/* Header */}
        <div className="max-w-2xl mb-12">
          <div className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-white border border-slate-200/80 mb-4 shadow-xs">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-800">{contactData.badge || 'Get in Touch'}</p>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-slate-900 tracking-tight mb-4">
            {contactData.headline}
          </h2>
          <p className="text-lg text-slate-500 leading-relaxed">
            {contactData.subheadline}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Form */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl p-8 lg:p-10 bg-white border border-slate-200/80 shadow-xs">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-14 text-center"
                >
                  <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h3 className="font-display font-bold text-2xl text-slate-900 mb-2">Message Dispatched</h3>
                  <p className="text-base text-slate-600 max-w-sm mx-auto mb-2 leading-relaxed">
                    Thank you, {formData.name || 'there'}. Your inquiry has been logged in the studio database and forwarded to our lab administrative email.
                  </p>
                  <p className="text-xs text-slate-400 mb-6">
                    {emailDispatched ? '✓ Direct email notification dispatched' : '✓ Studio admin notified'}
                  </p>
                  <button onClick={handleReset} className="px-7 py-3 rounded-lg bg-slate-900 text-white text-base font-medium hover:bg-slate-800 transition-colors">
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {errorMessage && (
                    <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                      <p>{errorMessage}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="name" className="block text-base font-medium text-slate-700 mb-2">Name *</label>
                      <input
                        type="text" id="name" required placeholder="Your full name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3.5 rounded-lg bg-[#f8fafc] border border-slate-200 text-slate-900 placeholder:text-slate-400 text-base focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all outline-none"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-base font-medium text-slate-700 mb-2">Email *</label>
                      <input
                        type="email" id="email" required placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3.5 rounded-lg bg-[#f8fafc] border border-slate-200 text-slate-900 placeholder:text-slate-400 text-base focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-base font-medium text-slate-700 mb-2">Subject / Field</label>
                    <input
                      type="text" id="subject" placeholder="e.g. Research Partnership / Clinical Trial Inquiry"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3.5 rounded-lg bg-[#f8fafc] border border-slate-200 text-slate-900 placeholder:text-slate-400 text-base focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-base font-medium text-slate-700 mb-2">Message *</label>
                    <textarea
                      id="message" rows={5} required
                      placeholder="Tell us about your project, medical device inquiry, or clinical collaboration..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3.5 rounded-lg bg-[#f8fafc] border border-slate-200 text-slate-900 placeholder:text-slate-400 text-base focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all outline-none resize-y"
                    />
                  </div>

                  <button
                    type="submit" disabled={isSubmitting}
                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-slate-900 text-white text-base font-medium hover:bg-slate-800 transition-all disabled:opacity-50 cursor-pointer shadow-xs"
                  >
                    {isSubmitting ? (
                      <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /><span>Sending Inquiry...</span></>
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
                { icon: Mail, label: 'Email', value: contactData.email, href: `mailto:${contactData.email}`, isLink: true },
                { icon: Phone, label: 'Phone', value: contactData.phone },
                { icon: MapPin, label: 'Location', value: contactData.address, sub: contactData.labLocation },
                { icon: Clock, label: 'Hours', value: contactData.officeHours },
              ].map(({ icon: Icon, label, value, href, isLink, sub }) => (
                <div key={label} className="flex items-start gap-4">
                  <Icon className="w-5 h-5 text-sky-600 mt-1 shrink-0" />
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
            {contactData.socials && contactData.socials.length > 0 && (
              <div className="pt-6 border-t border-slate-200">
                <div className="flex items-center gap-3">
                  {contactData.socials.map((social: any) => {
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
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
