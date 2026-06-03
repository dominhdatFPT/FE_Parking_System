import { cloneElement, useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import Icon from './Icon';
import { ROUTES } from '../constants/routes';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
export default function SettingsDropdown({ trigger } = {}) {
    const { user, role } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [open, setOpen] = useState(false);
    const containerRef = useRef(null);
    const buttonRef = useRef(null);
    const listRef = useRef(null);
    const [focusIndex, setFocusIndex] = useState(-1);
    const triggerNode = trigger
        ? cloneElement(trigger, {
            ref: buttonRef,
            'aria-haspopup': 'menu',
            'aria-controls': 'settings-menu',
            'aria-expanded': open,
            onClick(event) {
                const existingOnClick = trigger.props.onClick;
                if (typeof existingOnClick === 'function') {
                    existingOnClick(event);
                }
                setOpen((value) => !value);
            },
        })
        : (<button ref={buttonRef} type="button" aria-haspopup="menu" aria-controls="settings-menu" aria-expanded={open} aria-label="Cài đặt" className="icon-button settings-button" onClick={() => setOpen((v) => !v)}>
          <Icon name="settings"/>
        </button>);
    const profileInfo = {
        name: user.fullName,
        email: user.email,
        role: role === 'admin' ? 'ADMIN' : 'STAFF',
        avatarUrl: user.avatarUrl,
    };
    function handleLogout() {
        setOpen(false);
        window.alert('Đăng xuất tạm thời — bạn có thể triển khai logic thật sau.');
    }
    function handleDeleteAccount() {
        setOpen(false);
        window.alert('Xóa tài khoản tạm thời — vui lòng triển khai luồng xác nhận thực tế.');
    }
    const menuSections = [
        {
            id: 'settings-section-account',
            title: 'Tài khoản',
            subtitle: 'Quản lý hồ sơ, thông tin cá nhân và cài đặt hiển thị.',
            items: [
                {
                    id: 'account-profile',
                    label: 'Quản lý tài khoản',
                    icon: 'person_outline',
                    to: ROUTES.SETTINGS.BASE,
                    description: 'Chỉnh sửa profile, avatar, số điện thoại và ngôn ngữ.',
                },
                {
                    id: 'appearance-customization',
                    label: 'Giao diện & tùy chỉnh',
                    icon: 'palette',
                    to: '#',
                    description: 'Theme, font size và tùy chọn bố cục dashboard.',
                },
            ],
        },
        {
            id: 'settings-section-security',
            title: 'Bảo mật',
            subtitle: 'Kiểm soát quyền truy cập, thiết bị và quyền riêng tư.',
            items: [
                {
                    id: 'password-security',
                    label: 'Mật khẩu & bảo mật',
                    icon: 'shield',
                    to: '#',
                    description: 'Đổi mật khẩu, 2FA và quản lý phiên đăng nhập.',
                },
                {
                    id: 'privacy-settings',
                    label: 'Quyền riêng tư',
                    icon: 'lock_clock',
                    to: '#',
                    description: 'Cài đặt quyền riêng tư, dữ liệu và hiển thị tài khoản.',
                },
            ],
        },
        {
            id: 'settings-section-notifications',
            title: 'Thông báo',
            subtitle: 'Thiết lập và xem lịch sử cảnh báo hệ thống.',
            items: [
                {
                    id: 'system-notifications',
                    label: 'Thông báo hệ thống',
                    icon: 'notifications_none',
                    to: '#',
                    description: 'Email, push, bảo mật và cảnh báo thanh toán.',
                },
                {
                    id: 'notification-history',
                    label: 'Lịch sử thông báo',
                    icon: 'history',
                    to: '#',
                    description: 'Xem trạng thái đọc, timestamp và nhóm thông báo.',
                },
            ],
        },
        {
            id: 'settings-section-system',
            title: 'Hệ thống',
            subtitle: 'Trợ giúp tổng quan, điều khoản và các hành động quan trọng.',
            items: [
                {
                    id: 'help-center',
                    label: 'Help center',
                    icon: 'support_agent',
                    to: '#',
                    description: 'Tìm trợ giúp nhanh, FAQ và tài nguyên.',
                },
                {
                    id: 'terms-policies',
                    label: 'Terms & policies',
                    icon: 'gavel',
                    to: '#',
                    description: 'Xem điều khoản sử dụng và chính sách bảo mật.',
                },
                {
                    id: 'feedback',
                    label: 'Feedback',
                    icon: 'feedback',
                    to: '#',
                    description: 'Gửi ý kiến để cải thiện trải nghiệm của bạn.',
                },
                {
                    id: 'logout',
                    label: 'Đăng xuất',
                    icon: 'logout',
                    action: handleLogout,
                    description: 'Thoát khỏi phiên làm việc hiện tại.',
                },
                {
                    id: 'delete-account',
                    label: 'Xóa tài khoản',
                    icon: 'delete_forever',
                    action: handleDeleteAccount,
                    variant: 'danger',
                    description: 'Xóa toàn bộ dữ liệu và đăng nhập.',
                },
            ],
        },
    ];
    useEffect(() => {
        function handleClickOutside(e) {
            if (open && containerRef.current && !containerRef.current.contains(e.target)) {
                setOpen(false);
                setFocusIndex(-1);
            }
        }
        window.addEventListener('mousedown', handleClickOutside);
        return () => window.removeEventListener('mousedown', handleClickOutside);
    }, [open]);
    useEffect(() => {
        if (open && listRef.current) {
            const first = listRef.current.querySelector('[data-index="0"]');
            first?.focus();
            setFocusIndex(0);
        }
        if (!open) {
            buttonRef.current?.focus();
        }
    }, [open]);
    const allItems = menuSections.flatMap((section) => section.items);
    const onKeyDown = useCallback((e) => {
        if (!open)
            return;
        if (e.key === 'Escape') {
            setOpen(false);
            setFocusIndex(-1);
            return;
        }
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setFocusIndex((idx) => {
                const next = Math.min((idx === -1 ? 0 : idx) + 1, allItems.length - 1);
                const el = listRef.current?.querySelector(`[data-index="${next}"]`);
                el?.focus();
                return next;
            });
        }
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            setFocusIndex((idx) => {
                const prev = Math.max((idx === -1 ? 0 : idx) - 1, 0);
                const el = listRef.current?.querySelector(`[data-index="${prev}"]`);
                el?.focus();
                return prev;
            });
        }
        if (e.key === 'Home') {
            e.preventDefault();
            const first = listRef.current?.querySelector('[data-index="0"]');
            first?.focus();
            setFocusIndex(0);
        }
        if (e.key === 'End') {
            e.preventDefault();
            const last = listRef.current?.querySelector(`[data-index="${allItems.length - 1}"]`);
            last?.focus();
            setFocusIndex(allItems.length - 1);
        }
    }, [open, allItems.length]);
    return (<div ref={containerRef} className="settings-dropdown" data-focus-index={focusIndex}>
      {triggerNode}

      {open ? (<div id="settings-menu" className="settings-panel" role="menu" aria-orientation="vertical" onKeyDown={onKeyDown} tabIndex={-1}>
          <div className="settings-panel-top">
            <Link to={ROUTES.SETTINGS.PROFILE} className="settings-profile-card profile-link" onClick={() => setOpen(false)} aria-label="Xem hồ sơ cá nhân">
              <div className="settings-avatar-wrapper">
                <img src={profileInfo.avatarUrl} alt={profileInfo.name} className="settings-avatar-img"/>
              </div>
              <div className="settings-profile-copy">
                <div className="settings-profile-row">
                  <h3 className="settings-profile-name">{profileInfo.name}</h3>
                  <span className="settings-profile-role">{profileInfo.role}</span>
                </div>
              </div>
            </Link>

            <button type="button" className="settings-theme-icon-btn" onClick={toggleTheme} aria-label={theme === 'light' ? 'Enable dark mode' : 'Enable light mode'} title={theme === 'light' ? 'Chuyển tối' : 'Chuyển sáng'}>
              <Icon name={theme === 'light' ? 'dark_mode' : 'light_mode'}/>
            </button>
          </div>

          <div ref={listRef} className="settings-menu-list" tabIndex={-1}>
            {menuSections.map((section, sectionIndex) => (<div key={section.id} className="settings-section">
                <div className="settings-section-heading">
                  <div className="settings-section-title">{section.title}</div>
                  <p className="settings-section-copy">{section.subtitle}</p>
                </div>
                <div className="settings-section-items">
                  {section.items.map((item) => {
                    const index = allItems.findIndex((menuItem) => menuItem.id === item.id);
                    const itemClasses = `settings-card${item.variant === 'danger' ? ' danger' : ''}`;
                    const content = (<>
                        <span className="settings-card-icon" aria-hidden="true">
                          <Icon name={item.icon}/>
                        </span>
                        <span className="settings-card-body">
                          <span className="settings-card-title">{item.label}</span>
                          <span className="settings-card-copy">{item.description}</span>
                        </span>
                      </>);
                    return item.to ? (<Link key={item.id} to={item.to} className={itemClasses} data-index={index} role="menuitem" title={item.label} onClick={() => setOpen(false)}>
                        {content}
                      </Link>) : (<button key={item.id} type="button" className={itemClasses} data-index={index} role="menuitem" title={item.label} onClick={() => {
                            item.action?.();
                            setOpen(false);
                        }}>
                        {content}
                      </button>);
                })}
                </div>
                {sectionIndex < menuSections.length - 1 && (<div className="settings-divider" aria-hidden="true"/>)}
              </div>))}
          </div>
        </div>) : null}
    </div>);
}
