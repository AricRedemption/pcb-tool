

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const originalTitle = document.title;
    document.title = '工作台 - PCBTool.AI';
    return () => { document.title = originalTitle; };
  }, []);

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const query = searchQuery.trim();
      if (query) {
        console.log('搜索:', query);
        // 实际应用中这里会实现搜索功能
      }
    }
  };

  const handleNotificationClick = () => {
    console.log('查看通知');
    // 实际应用中这里会显示通知列表
  };

  const handleQuickActionCreate = () => {
    navigate('/project-create');
  };

  const handleQuickActionHistory = () => {
    navigate('/project-list');
  };

  const handleQuickActionKnowledge = () => {
    navigate('/knowledge-base');
  };

  const handleQuickActionComponents = () => {
    navigate('/component-db');
  };

  const handleCreateProjectClick = () => {
    navigate('/project-create');
  };

  const handleProjectView = (projectId: string) => {
    navigate(`/project-detail?projectId=${projectId}`);
  };

  const handleProjectEdit = (projectId: string) => {
    navigate(`/project-create?projectId=${projectId}`);
  };

  const handleProjectDownload = (projectId: string) => {
    console.log('下载项目文件:', projectId);
    // 实际应用中这里会调用下载API
  };

  const handleProjectStatus = (projectId: string) => {
    navigate(`/project-detail?projectId=${projectId}`);
  };

  const handleUserProfileClick = () => {
    navigate('/user-profile');
  };

  return (
    <div className={styles.pageWrapper}>
      {/* 顶部导航栏 */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-border-primary h-16 z-50 shadow-sm">
        <div className="flex items-center justify-between h-full px-6">
          {/* Logo和品牌 */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <i className="fas fa-microchip text-white text-lg"></i>
              </div>
              <h1 className={`text-xl font-bold ${styles.gradientText}`}>PCBTool.AI</h1>
            </div>
          </div>
          
          {/* 全局搜索 */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <input 
                type="text" 
                placeholder="搜索项目、元器件、案例..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearchKeyPress}
                className={`w-full pl-10 pr-4 py-2 border border-border-primary rounded-lg ${styles.searchFocus} bg-bg-secondary text-text-primary placeholder-text-secondary`}
              />
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary"></i>
            </div>
          </div>
          
          {/* 右侧操作区 */}
          <div className="flex items-center space-x-4">
            {/* 消息通知 */}
            <button 
              onClick={handleNotificationClick}
              className="relative p-2 text-text-secondary hover:text-primary transition-colors"
            >
              <i className="fas fa-bell text-lg"></i>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-danger rounded-full"></span>
            </button>
            
            {/* 用户头像和下拉菜单 */}
            <div className="relative">
              <button 
                onClick={handleUserProfileClick}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-bg-secondary transition-colors"
              >
                <img 
                  src="https://s.coze.cn/image/ZIbLDVaKweA/" 
                  alt="用户头像" 
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-text-primary font-medium">张工程师</span>
                <i className="fas fa-chevron-down text-text-secondary text-sm"></i>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 左侧菜单 */}
      <aside className={`fixed left-0 top-16 bottom-0 w-64 bg-gradient-sidebar text-sidebar-text ${styles.sidebarTransition} z-40`}>
        <nav className="p-4 space-y-2">
          {/* 工作台 */}
          <Link to="/dashboard" className={`${styles.navItem} ${styles.navItemActive} flex items-center space-x-3 px-4 py-3 rounded-lg`}>
            <i className="fas fa-tachometer-alt text-lg"></i>
            <span className="font-medium">工作台</span>
          </Link>
          
          {/* 项目管理 */}
          <Link to="/project-list" className={`${styles.navItem} flex items-center space-x-3 px-4 py-3 rounded-lg`}>
            <i className="fas fa-folder-open text-lg"></i>
            <span className="font-medium">项目管理</span>
          </Link>
          
          {/* 知识库 */}
          <Link to="/knowledge-base" className={`${styles.navItem} flex items-center space-x-3 px-4 py-3 rounded-lg`}>
            <i className="fas fa-book text-lg"></i>
            <span className="font-medium">知识库</span>
          </Link>
          
          {/* 用户设置 */}
          <Link to="/user-profile" className={`${styles.navItem} flex items-center space-x-3 px-4 py-3 rounded-lg`}>
            <i className="fas fa-cog text-lg"></i>
            <span className="font-medium">用户设置</span>
          </Link>
        </nav>
      </aside>

      {/* 主内容区 */}
      <main className="ml-64 mt-16 p-6 min-h-screen">
        {/* 页面头部 */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-text-primary mb-2">欢迎回来，张工程师</h2>
              <nav className="text-sm text-text-secondary">
                <span>首页</span>
              </nav>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={handleCreateProjectClick}
                className="bg-gradient-primary text-white px-6 py-3 rounded-lg font-medium hover:shadow-glow transition-all duration-300"
              >
                <i className="fas fa-plus mr-2"></i>
                创建新项目
              </button>
            </div>
          </div>
        </div>

        {/* 快速入口区 */}
        <section className="mb-8">
          <h3 className="text-xl font-semibold text-text-primary mb-4">快速入口</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 创建新项目 */}
            <div 
              onClick={handleQuickActionCreate}
              className={`bg-gradient-card rounded-2xl p-6 shadow-card ${styles.cardHover} cursor-pointer`}
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                  <i className="fas fa-plus text-white text-xl"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-text-primary">创建新项目</h4>
                  <p className="text-sm text-text-secondary">开始新的电路设计项目</p>
                </div>
              </div>
            </div>
            
            {/* 查看历史项目 */}
            <div 
              onClick={handleQuickActionHistory}
              className={`bg-gradient-card rounded-2xl p-6 shadow-card ${styles.cardHover} cursor-pointer`}
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-secondary rounded-xl flex items-center justify-center">
                  <i className="fas fa-history text-white text-xl"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-text-primary">查看历史项目</h4>
                  <p className="text-sm text-text-secondary">管理和查看已有的项目</p>
                </div>
              </div>
            </div>
            
            {/* 浏览知识库 */}
            <div 
              onClick={handleQuickActionKnowledge}
              className={`bg-gradient-card rounded-2xl p-6 shadow-card ${styles.cardHover} cursor-pointer`}
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-warning rounded-xl flex items-center justify-center">
                  <i className="fas fa-book text-white text-xl"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-text-primary">浏览知识库</h4>
                  <p className="text-sm text-text-secondary">探索元器件和电路案例</p>
                </div>
              </div>
            </div>
            
            {/* 元器件查询 */}
            <div 
              onClick={handleQuickActionComponents}
              className={`bg-gradient-card rounded-2xl p-6 shadow-card ${styles.cardHover} cursor-pointer`}
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-tertiary rounded-xl flex items-center justify-center">
                  <i className="fas fa-search text-white text-xl"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-text-primary">元器件查询</h4>
                  <p className="text-sm text-text-secondary">搜索和查看元器件信息</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 项目概览区 */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-text-primary">项目概览</h3>
            <Link to="/project-list" className="text-primary hover:text-secondary transition-colors font-medium">
              查看全部 <i className="fas fa-arrow-right ml-1"></i>
            </Link>
          </div>
          
          {/* 统计卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-2xl p-6 shadow-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-secondary text-sm">总项目数</p>
                  <p className="text-3xl font-bold text-text-primary mt-1">24</p>
                </div>
                <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-xl flex items-center justify-center">
                  <i className="fas fa-folder text-primary text-xl"></i>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-secondary text-sm">进行中</p>
                  <p className="text-3xl font-bold text-warning mt-1">8</p>
                </div>
                <div className="w-12 h-12 bg-warning bg-opacity-10 rounded-xl flex items-center justify-center">
                  <i className="fas fa-play text-warning text-xl"></i>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-secondary text-sm">已完成</p>
                  <p className="text-3xl font-bold text-success mt-1">16</p>
                </div>
                <div className="w-12 h-12 bg-success bg-opacity-10 rounded-xl flex items-center justify-center">
                  <i className="fas fa-check text-success text-xl"></i>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-secondary text-sm">AI生成方案</p>
                  <p className="text-3xl font-bold text-secondary mt-1">156</p>
                </div>
                <div className="w-12 h-12 bg-secondary bg-opacity-10 rounded-xl flex items-center justify-center">
                  <i className="fas fa-robot text-secondary text-xl"></i>
                </div>
              </div>
            </div>
          </div>
          
          {/* 最近项目列表 */}
          <div className="bg-white rounded-2xl shadow-card">
            <div className="p-6 border-b border-border-primary">
              <h4 className="font-semibold text-text-primary">最近项目</h4>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-bg-secondary">
                  <tr>
                    <th className="text-left py-3 px-6 text-text-secondary font-medium">项目名称</th>
                    <th className="text-left py-3 px-6 text-text-secondary font-medium">状态</th>
                    <th className="text-left py-3 px-6 text-text-secondary font-medium">创建时间</th>
                    <th className="text-left py-3 px-6 text-text-secondary font-medium">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-primary">
                  <tr className="hover:bg-bg-secondary transition-colors">
                    <td className="py-4 px-6">
                      <button 
                        onClick={() => handleProjectView('proj_001')}
                        className="text-primary hover:text-secondary font-medium"
                      >
                        智能家居控制板
                      </button>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 bg-warning bg-opacity-10 text-warning rounded-full text-sm font-medium">进行中</span>
                    </td>
                    <td className="py-4 px-6 text-text-secondary">2024-01-15 14:30</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleProjectView('proj_001')}
                          className="text-primary hover:text-secondary transition-colors"
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                        <button 
                          onClick={() => handleProjectEdit('proj_001')}
                          className="text-text-secondary hover:text-primary transition-colors"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr className="hover:bg-bg-secondary transition-colors">
                    <td className="py-4 px-6">
                      <button 
                        onClick={() => handleProjectView('proj_002')}
                        className="text-primary hover:text-secondary font-medium"
                      >
                        环境监测传感器
                      </button>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 bg-success bg-opacity-10 text-success rounded-full text-sm font-medium">已完成</span>
                    </td>
                    <td className="py-4 px-6 text-text-secondary">2024-01-12 09:15</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleProjectView('proj_002')}
                          className="text-primary hover:text-secondary transition-colors"
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                        <button 
                          onClick={() => handleProjectDownload('proj_002')}
                          className="text-text-secondary hover:text-primary transition-colors"
                        >
                          <i className="fas fa-download"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr className="hover:bg-bg-secondary transition-colors">
                    <td className="py-4 px-6">
                      <button 
                        onClick={() => handleProjectView('proj_003')}
                        className="text-primary hover:text-secondary font-medium"
                      >
                        物联网网关
                      </button>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 bg-info bg-opacity-10 text-info rounded-full text-sm font-medium">方案生成中</span>
                    </td>
                    <td className="py-4 px-6 text-text-secondary">2024-01-10 16:45</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleProjectView('proj_003')}
                          className="text-primary hover:text-secondary transition-colors"
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                        <button 
                          onClick={() => handleProjectStatus('proj_003')}
                          className="text-text-secondary hover:text-primary transition-colors"
                        >
                          <i className="fas fa-clock"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* 系统状态区 */}
        <section className="mb-8">
          <h3 className="text-xl font-semibold text-text-primary mb-4">系统状态</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* AI模型状态 */}
            <div className="bg-white rounded-2xl p-6 shadow-card">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-text-primary">AI模型状态</h4>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 bg-success rounded-full ${styles.statusIndicator}`}></div>
                  <span className="text-success font-medium text-sm">正常</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">模型版本</span>
                  <span className="text-text-primary font-medium">v2.1.0</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">响应时间</span>
                  <span className="text-success font-medium">1.2s</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">今日处理</span>
                  <span className="text-text-primary font-medium">1,247 次</span>
                </div>
              </div>
            </div>
            
            {/* 知识库状态 */}
            <div className="bg-white rounded-2xl p-6 shadow-card">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-text-primary">知识库状态</h4>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 bg-success rounded-full ${styles.statusIndicator}`}></div>
                  <span className="text-success font-medium text-sm">正常</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">元器件数量</span>
                  <span className="text-text-primary font-medium">1,245,678</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">电路案例</span>
                  <span className="text-text-primary font-medium">12,345</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">最后更新</span>
                  <span className="text-text-primary font-medium">2024-01-15</span>
                </div>
              </div>
            </div>
            
            {/* 系统性能 */}
            <div className="bg-white rounded-2xl p-6 shadow-card">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-text-primary">系统性能</h4>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 bg-success rounded-full ${styles.statusIndicator}`}></div>
                  <span className="text-success font-medium text-sm">正常</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">CPU使用率</span>
                  <span className="text-text-primary font-medium">45%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">内存使用</span>
                  <span className="text-text-primary font-medium">68%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">在线用户</span>
                  <span className="text-text-primary font-medium">234</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;

