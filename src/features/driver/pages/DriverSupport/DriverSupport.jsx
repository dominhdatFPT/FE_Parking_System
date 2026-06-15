import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { bookingService } from '../../../../services/bookingService';
import PageHeader from '../../components/PageHeader';
import Button from '../../components/Button';

export default function DriverSupport() {
  const { t } = useTranslation();
  const [openFaq, setOpenFaq] = useState(null);
  const [form, setForm] = useState({ subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState('');

  const toggleFaq = (i) => setOpenFaq(openFaq === i ? null : i);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!form.subject.trim()) { setFormError(t('support.subjectRequired')); return; }
    if (!form.message.trim()) { setFormError(t('support.messageRequired')); return; }
    setSubmitting(true);
    const { error } = await bookingService.submitSupport(form);
    setSubmitting(false);
    if (error) { setFormError(t('support.submitError')); return; }
    setSubmitted(true);
    setForm({ subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 3000);
  };

  const faqs = [
    { q: t('support.faq1q'), a: t('support.faq1a') },
    { q: t('support.faq2q'), a: t('support.faq2a') },
    { q: t('support.faq3q'), a: t('support.faq3a') },
    { q: t('support.faq4q'), a: t('support.faq4a') },
    { q: t('support.faq5q'), a: t('support.faq5a') },
    { q: t('support.faq6q'), a: t('support.faq6a') },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title={t('support.title')} subtitle={t('support.subtitle')} icon="help" />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="group rounded-2xl border border-slate-100/80 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-0.5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-cyan-500 text-white shadow-lg shadow-sky-200/50 transition-transform duration-300 group-hover:scale-110">
              <span className="material-symbols-outlined text-[24px]">call</span>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">{t('support.hotline')}</p>
              <p className="text-lg font-extrabold text-sky-600">{t('support.hotlineNumber')}</p>
              <p className="text-xs text-slate-400">{t('support.hotlineDesc')}</p>
            </div>
          </div>
        </div>

        <div className="group rounded-2xl border border-slate-100/80 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-0.5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 text-white shadow-lg shadow-violet-200/50 transition-transform duration-300 group-hover:scale-110">
              <span className="material-symbols-outlined text-[24px]">mail</span>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">{t('support.email')}</p>
              <p className="text-sm font-bold text-violet-600">{t('support.emailAddress')}</p>
              <p className="text-xs text-slate-400">{t('support.emailDesc')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-100/80 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-800">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#0EA5E9] to-[#06B6D4] text-white shadow-sm">
              <span className="material-symbols-outlined text-[16px]">help</span>
            </span>
            {t('support.faq')}
          </h3>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-xl border border-slate-100 transition-all duration-200">
                <button
                  type="button"
                  onClick={() => toggleFaq(i)}
                  className="flex w-full items-center justify-between p-4 text-left"
                >
                  <span className="text-sm font-semibold text-slate-700">{faq.q}</span>
                  <span className={`material-symbols-outlined text-[18px] text-slate-400 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`}>
                    expand_more
                  </span>
                </button>
                <div className={`overflow-hidden transition-all duration-200 ${openFaq === i ? 'max-h-40 pb-4' : 'max-h-0'}`}>
                  <p className="px-4 text-sm leading-relaxed text-slate-500">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100/80 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-800">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#0EA5E9] to-[#06B6D4] text-white shadow-sm">
              <span className="material-symbols-outlined text-[16px]">mail</span>
            </span>
            {t('support.contactForm')}
          </h3>

          {submitted ? (
            <div className="flex flex-col items-center py-8 text-center">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-500">
                <span className="material-symbols-outlined text-[32px]">check_circle</span>
              </div>
              <p className="text-sm font-bold text-slate-800">{t('support.submitSuccess')}</p>
              <p className="mt-1 text-xs text-slate-400">{t('support.submitSuccessDesc')}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-500">{t('support.subject')}</label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
                  placeholder={t('support.subjectPlaceholder')}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none transition-all focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-500">{t('support.message')}</label>
                <textarea
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                  placeholder={t('support.messagePlaceholder')}
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none transition-all focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100"
                />
              </div>
              {formError && (
                <p className="flex items-center gap-1.5 text-xs text-red-500">
                  <span className="material-symbols-outlined text-[14px]">error</span>
                  {formError}
                </p>
              )}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                icon="send"
                loading={submitting}
                disabled={submitting}
                className="w-full justify-center"
              >
                {t('support.submit')}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
