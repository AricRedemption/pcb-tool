import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AiConfig, loadAiConfig } from '../lib/storage';

type NavItem = {
  to: string;
  label: string;
  iconClass: string;
};

const NAV_ITEMS: readonly NavItem[] = [
  { to: '/dashboard', label: '工作台', iconClass: 'fas fa-tachometer-alt' },
  { to: '/project-list', label: '项目管理', iconClass: 'fas fa-folder-open' },
  { to: '/knowledge-base', label: '知识库', iconClass: 'fas fa-book' },
  { to: '/component-db', label: '元器件库', iconClass: 'fas fa-search' },
  { to: '/circuit-cases', label: '电路案例', iconClass: 'fas fa-layer-group' },
  { to: '/user-profile', label: '用户设置', iconClass: 'fas fa-cog' },
];

export type AppShellProps = {
  pageTitle: string;
  breadcrumb?: readonly string[];
  children: React.ReactNode;
};

function isActivePath(currentPathname: string, itemTo: string): boolean {
  if (itemTo === '/dashboard') {
    return currentPathname === '/dashboard';
  }
  return currentPathname.startsWith(itemTo);
}

export default function AppShell({ pageTitle, breadcrumb, children }: AppShellProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpenOnMobile, setIsSidebarOpenOnMobile] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [aiConfig, setAiConfig] = useState<AiConfig | undefined>(() => loadAiConfig());

  const breadcrumbItems = useMemo(() => breadcrumb ?? ['工作台', pageTitle], [breadcrumb, pageTitle]);

  useEffect(() => {
    setAiConfig(loadAiConfig());
  }, [location.pathname]);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === 'pcbtool.aiConfig.v1') {
        setAiConfig(loadAiConfig());
      }
    };
    const handleAiConfigUpdated = () => {
      setAiConfig(loadAiConfig());
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener('ai-config-updated', handleAiConfigUpdated);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('ai-config-updated', handleAiConfigUpdated);
    };
  }, []);

  const handleGlobalSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') {
      return;
    }
    const query = globalSearch.trim();
    if (!query) {
      return;
    }
    console.log('搜索:', query);
  };

  const handleAvatarClick = () => {
    navigate('/user-profile');
  };

  const isAiConfigured = Boolean(aiConfig?.baseUrl && aiConfig?.apiKey && aiConfig?.model);
  const isAiConnected = Boolean(isAiConfigured && aiConfig?.lastTestOk);
  const aiStatusText = !isAiConfigured
    ? 'AI 未配置'
    : isAiConnected
      ? 'AI 连接正常'
      : 'AI 未连接';
  const aiDotClass = isAiConnected ? 'bg-success' : 'bg-danger';

  return (
    <div className="min-h-screen bg-bg-primary">
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-border-primary h-16 z-50 shadow-sm">
        <div className="flex items-center justify-between h-full px-6">
          <div className="flex items-center space-x-4">
            <button
              type="button"
              className="md:hidden p-2 text-text-secondary hover:text-primary transition-colors"
              onClick={() => setIsSidebarOpenOnMobile((v) => !v)}
              aria-label="切换侧边栏"
            >
              <i className="fas fa-bars text-lg"></i>
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <i className="fas fa-microchip text-white text-lg"></i>
              </div>
              <h1 className="text-xl font-bold text-text-primary">PCBTool.AI</h1>
            </div>
          </div>

          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="搜索项目、元器件、案例..."
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                onKeyDown={handleGlobalSearchKeyDown}
                className="w-full pl-10 pr-4 py-2 border border-border-primary rounded-lg bg-bg-secondary text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-30"
              />
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary"></i>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={() => navigate('/user-profile')}
              className="flex items-center space-x-2 px-2 py-1 rounded-full hover:bg-bg-secondary transition-colors"
              aria-label={aiStatusText}
            >
              <span className={`w-3 h-3 rounded-full animate-pulse ${aiDotClass}`}></span>
              <span className="text-xs text-text-secondary">
                {isAiConfigured ? aiConfig?.model : '未设置模型'}
              </span>
            </button>
            <button
              type="button"
              className="relative p-2 text-text-secondary hover:text-primary transition-colors"
              aria-label="通知"
            >
              <i className="fas fa-bell text-lg"></i>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-danger rounded-full"></span>
            </button>
            <button
              type="button"
              onClick={handleAvatarClick}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-bg-secondary transition-colors"
              aria-label="用户设置"
            >
              <img
                src="https://s.coze.cn/image/ZIbLDVaKweA/"
                alt="用户头像"
                className="w-8 h-8 rounded-full"
              />
              <span className="hidden sm:inline text-text-primary font-medium">张工程师</span>
              <i className="fas fa-chevron-down text-text-secondary text-sm"></i>
            </button>
          </div>
        </div>
      </header>

      <aside
        className={[
          'fixed left-0 top-16 bottom-0 w-64 bg-gradient-sidebar text-sidebar-text z-40 transition-transform duration-300 ease-in-out',
          'md:translate-x-0',
          isSidebarOpenOnMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        ].join(' ')}
      >
        <nav className="p-4 space-y-2">
          {NAV_ITEMS.map((item) => {
            const active = isActivePath(location.pathname, item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setIsSidebarOpenOnMobile(false)}
                className={[
                  'flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors',
                  active ? 'bg-sidebar-hover text-sidebar-text-active' : 'hover:bg-sidebar-hover',
                ].join(' ')}
              >
                <i className={`${item.iconClass} text-lg`}></i>
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      <main className="pt-16 md:ml-64 p-6 min-h-screen">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-text-primary mb-2">{pageTitle}</h2>
          <nav className="text-sm text-text-secondary">
            {breadcrumbItems.map((item, index) => (
              <span key={`${item}-${index}`}>
                {index > 0 && <i className="fas fa-chevron-right mx-2"></i>}
                <span className={index === breadcrumbItems.length - 1 ? 'text-primary' : undefined}>
                  {item}
                </span>
              </span>
            ))}
          </nav>
        </div>

        {children}
      </main>
    </div>
  );
}
