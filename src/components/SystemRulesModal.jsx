import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const systemRules = [
  {
    title: 'Đăng ký thông tin chính xác',
    description:
      'Người dùng phải cung cấp đầy đủ và chính xác các thông tin cá nhân cũng như phương tiện khi đăng ký tài khoản.',
  },
  {
    title: 'Bảo mật tài khoản',
    description:
      'Không chia sẻ tài khoản hoặc mật khẩu cho người khác. Người dùng chịu trách nhiệm đối với mọi hoạt động phát sinh từ tài khoản của mình.',
  },
  {
    title: 'Sử dụng đúng phương tiện đã đăng ký',
    description:
      'Chỉ sử dụng phương tiện đã được đăng ký trên hệ thống khi vào bãi xe. Nếu thay đổi phương tiện, vui lòng cập nhật thông tin trước khi sử dụng.',
  },
  {
    title: 'Tuân thủ hướng dẫn của nhân viên',
    description:
      'Người dùng cần thực hiện theo hướng dẫn của nhân viên hoặc hệ thống khi ra vào bãi xe nhằm đảm bảo an toàn và tránh ùn tắc.',
  },
  {
    title: 'Thanh toán đúng hạn',
    description:
      'Các khoản phí gửi xe phải được thanh toán đầy đủ theo quy định trước khi rời bãi xe.',
  },
  {
    title: 'Không thực hiện hành vi gian lận',
    description:
      'Nghiêm cấm các hành vi giả mạo tài khoản, sử dụng mã QR của người khác hoặc cố ý gây ảnh hưởng đến hệ thống.',
  },
  {
    title: 'Bảo vệ tài sản cá nhân',
    description:
      'Ban quản lý hỗ trợ quản lý phương tiện nhưng không chịu trách nhiệm đối với tài sản có giá trị để trong xe nếu không có quy định riêng.',
  },
  {
    title: 'Báo cáo sự cố',
    description:
      'Nếu phát hiện lỗi hệ thống hoặc gặp sự cố, vui lòng gửi phản hồi qua mục Hỗ trợ.',
  },
  {
    title: 'Quyền cập nhật nội quy',
    description:
      'Ban quản trị có quyền cập nhật hoặc bổ sung nội quy để nâng cao chất lượng dịch vụ.',
  },
  {
    title: 'Đồng ý sử dụng',
    description:
      'Việc tiếp tục sử dụng hệ thống đồng nghĩa với việc người dùng đã đọc và hiểu các nội quy trên.',
  },
];

function RuleCheckIcon() {
  return (
    <svg aria-hidden="true" className="h-3.5 w-3.5" fill="none" viewBox="0 0 20 20">
      <path
        d="m5.25 10.25 3 3 6.5-7"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

export default function SystemRulesModal({ open, onClose }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.requestAnimationFrame(() => dialogRef.current?.focus());

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center overflow-hidden bg-slate-950/55 p-3 backdrop-blur-sm sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
        >
          <motion.section
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="system-rules-title"
            aria-describedby="system-rules-description"
            tabIndex={-1}
            className="flex max-h-[calc(100dvh-1.5rem)] w-full max-w-4xl flex-col overflow-hidden rounded-[30px] bg-slate-100/90 p-1.5 shadow-[0_36px_100px_rgba(2,6,23,0.34)] ring-1 ring-white/30 outline-none sm:max-h-[calc(100dvh-3rem)] sm:rounded-[34px] sm:p-2 dark:bg-slate-800/90"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ duration: 0.36, ease: [0.32, 0.72, 0, 1] }}
          >
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[24px] bg-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)] sm:rounded-[27px] dark:bg-slate-950">
              <header className="relative overflow-hidden bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.24),transparent_42%),linear-gradient(135deg,#f0f9ff_0%,#ffffff_55%,#f8fafc_100%)] px-5 pb-5 pt-5 sm:px-7 sm:pb-6 sm:pt-6 dark:bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.20),transparent_42%),linear-gradient(135deg,#0f172a_0%,#020617_65%)]">
                <div className="absolute -right-10 -top-12 h-32 w-32 rounded-full bg-sky-300/20 blur-2xl" aria-hidden="true" />
                <div className="relative flex items-start gap-3.5 pr-10 sm:gap-4">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-sky-500 text-2xl shadow-[0_14px_30px_rgba(14,165,233,0.24)] ring-4 ring-sky-100 dark:ring-sky-950">
                    <span aria-hidden="true">📋</span>
                  </div>
                  <div className="min-w-0 pt-0.5">
                    <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400">
                      Smart Parking · Hướng dẫn sử dụng
                    </p>
                    <h2 id="system-rules-title" className="text-lg font-bold leading-snug tracking-[-0.02em] text-slate-950 sm:text-xl dark:text-white">
                      NỘI QUY SỬ DỤNG HỆ THỐNG SMART PARKING
                    </h2>
                    <p id="system-rules-description" className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                      Để đảm bảo hệ thống hoạt động ổn định và an toàn, vui lòng dành ít phút đọc các nội quy dưới đây.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Đóng nội quy"
                  className="group absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-white/75 text-slate-500 shadow-[0_8px_22px_rgba(15,23,42,0.08)] ring-1 ring-slate-900/5 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:rotate-90 hover:bg-white hover:text-slate-950 active:scale-90 dark:bg-white/10 dark:text-slate-300 dark:ring-white/10 dark:hover:bg-white/15 dark:hover:text-white sm:right-5 sm:top-5"
                >
                  <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 20 20">
                    <path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
                  </svg>
                </button>
              </header>

              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6 sm:py-5">
                <ol className="grid gap-2.5 sm:gap-3">
                  {systemRules.map((rule, index) => (
                    <li
                      key={rule.title}
                      className="group flex gap-3 rounded-[18px] bg-slate-50/90 px-3.5 py-3 ring-1 ring-slate-900/[0.045] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:bg-sky-50/70 hover:ring-sky-200/80 dark:bg-white/[0.035] dark:ring-white/[0.07] dark:hover:bg-sky-950/30 dark:hover:ring-sky-800/60 sm:px-4"
                    >
                      <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-600 ring-4 ring-emerald-50 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105 dark:bg-emerald-400/15 dark:text-emerald-300 dark:ring-emerald-950/40">
                        <RuleCheckIcon />
                      </span>
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold leading-5 text-slate-800 dark:text-slate-100">
                          <span className="mr-1.5 text-sky-600 dark:text-sky-400">{index + 1}.</span>
                          {rule.title}
                        </h3>
                        <p className="mt-0.5 text-[13px] leading-5 text-slate-600 dark:text-slate-400">
                          {rule.description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              <footer className="bg-white px-4 pb-4 pt-3 shadow-[0_-12px_32px_rgba(15,23,42,0.04)] ring-1 ring-slate-900/[0.04] dark:bg-slate-950 dark:ring-white/[0.06] sm:px-6 sm:pb-5">
                <div className="grid grid-cols-2 gap-2.5 sm:flex sm:justify-end sm:gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="min-h-11 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold !text-slate-700 shadow-[0_6px_18px_rgba(15,23,42,0.06)] transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:border-sky-200 hover:bg-sky-50 hover:!text-sky-700 hover:shadow-[0_10px_24px_rgba(14,165,233,0.10)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300/30 active:scale-[0.98] dark:border-slate-600 dark:bg-slate-800 dark:!text-slate-100 dark:shadow-[0_8px_22px_rgba(0,0,0,0.22)] dark:hover:border-sky-500/60 dark:hover:bg-slate-700 dark:hover:!text-white sm:min-w-28"
                  >
                    Bỏ qua
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="group min-h-11 rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-bold !text-white shadow-[0_12px_26px_rgba(14,165,233,0.24)] transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:bg-sky-600 hover:shadow-[0_16px_34px_rgba(14,165,233,0.30)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300/40 active:scale-[0.98] sm:min-w-28"
                  >
                    Đồng ý
                  </button>
                </div>
              </footer>
            </div>
          </motion.section>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
