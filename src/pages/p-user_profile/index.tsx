

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './styles.module.css';

interface BasicProfileForm {
  fullName: string;
  email: string;
  company: string;
  position: string;
  bio: string;
}

interface AccountSecurityForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface NotificationPreferencesForm {
  emailProjectUpdates: boolean;
  emailSchemeCompleted: boolean;
  emailSystemUpdates: boolean;
  inappRealtime: boolean;
  inappSound: boolean;
}

type SettingType = 'basic' | 'security' | 'notifications';

const UserProfilePage: React.FC = () => {
  const [activeSetting, setActiveSetting] = useState<SettingType>('basic');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessageText, setSuccessMessageText] = useState('设置已保存');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [basicProfileForm, setBasicProfileForm] = useState<BasicProfileForm>({
    fullName: '张工程师',
    email: 'zhang.engineer@example.com',
    company: '电子科技有限公司',
    position: '硬件工程师',
    bio: '10年硬件开发经验，擅长嵌入式系统设计和PCB布局。在消费电子和工业控制领域有丰富经验。'
  });

  const [accountSecurityForm, setAccountSecurityForm] = useState<AccountSecurityForm>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notificationPreferencesForm, setNotificationPreferencesForm] = useState<NotificationPreferencesForm>({
    emailProjectUpdates: true,
    emailSchemeCompleted: true,
    emailSystemUpdates: false,
    inappRealtime: true,
    inappSound: false
  });

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const originalTitle = document.title;
    document.title = '用户设置 - PCBTool.AI';
    return () => { document.title = originalTitle; };
  }, []);

  const handleSettingChange = (settingType: SettingType) => {
    setActiveSetting(settingType);
  };

  const showSuccessToast = (message: string) => {
    setSuccessMessageText(message);
    setShowSuccessMessage(true);
    
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };

  const handleBasicProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // 模拟保存过程
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    showSuccessToast('基本资料已更新');
  };

  const handleAccountSecuritySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { currentPassword, newPassword, confirmPassword } = accountSecurityForm;
    
    // 简单验证
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert('请填写所有密码字段');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      alert('新密码和确认密码不匹配');
      return;
    }
    
    if (newPassword.length < 8) {
      alert('新密码至少需要8位字符');
      return;
    }
    
    setIsSubmitting(true);
    
    // 模拟保存过程
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setAccountSecurityForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    
    setIsSubmitting(false);
    showSuccessToast('密码已更新');
  };

  const handleNotificationPreferencesSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // 模拟保存过程
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    showSuccessToast('通知偏好已更新');
  };

  const handleBasicProfileCancel = () => {
    setBasicProfileForm({
      fullName: '张工程师',
      email: 'zhang.engineer@example.com',
      company: '电子科技有限公司',
      position: '硬件工程师',
      bio: '10年硬件开发经验，擅长嵌入式系统设计和PCB布局。在消费电子和工业控制领域有丰富经验。'
    });
  };

  const handleAccountSecurityCancel = () => {
    setAccountSecurityForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handleNotificationPreferencesCancel = () => {
    setNotificationPreferencesForm({
      emailProjectUpdates: true,
      emailSchemeCompleted: true,
      emailSystemUpdates: false,
      inappRealtime: true,
      inappSound: false
    });
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const query = searchQuery.trim();
      if (query) {
        console.log('搜索:', query);
        // 这里可以添加搜索逻辑
      }
    }
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
            <button className="relative p-2 text-text-secondary hover:text-primary transition-colors">
              <i className="fas fa-bell text-lg"></i>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-danger rounded-full"></span>
            </button>
            
            {/* 用户头像和下拉菜单 */}
            <div className="relative">
              <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-bg-secondary transition-colors">
                <img 
                  src="https://s.coze.cn/image/Kl7WrING8z8/" 
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
          <Link to="/dashboard" className={`${styles.navItem} flex items-center space-x-3 px-4 py-3 rounded-lg`}>
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
          <Link to="/user-profile" className={`${styles.navItem} ${styles.navItemActive} flex items-center space-x-3 px-4 py-3 rounded-lg`}>
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
              <h2 className="text-3xl font-bold text-text-primary mb-2">用户设置</h2>
              <nav className="text-sm text-text-secondary">
                <span>工作台</span>
                <i className="fas fa-chevron-right mx-2"></i>
                <span>用户设置</span>
              </nav>
            </div>
          </div>
        </div>

        {/* 设置内容区 */}
        <div className="flex gap-6">
          {/* 设置项列表 */}
          <div className="w-64 bg-white rounded-2xl shadow-card p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-6">设置选项</h3>
            <div className="space-y-2">
              <button 
                onClick={() => handleSettingChange('basic')}
                className={`${styles.settingItem} ${activeSetting === 'basic' ? styles.settingItemActive : ''} w-full text-left px-4 py-3 rounded-lg transition-all`}
              >
                <i className="fas fa-user mr-3"></i>
                <span className="font-medium">基本资料</span>
              </button>
              <button 
                onClick={() => handleSettingChange('security')}
                className={`${styles.settingItem} ${activeSetting === 'security' ? styles.settingItemActive : ''} w-full text-left px-4 py-3 rounded-lg transition-all`}
              >
                <i className="fas fa-shield-alt mr-3"></i>
                <span className="font-medium">账号安全</span>
              </button>
              <button 
                onClick={() => handleSettingChange('notifications')}
                className={`${styles.settingItem} ${activeSetting === 'notifications' ? styles.settingItemActive : ''} w-full text-left px-4 py-3 rounded-lg transition-all`}
              >
                <i className="fas fa-bell mr-3"></i>
                <span className="font-medium">通知偏好</span>
              </button>
            </div>
          </div>

          {/* 设置内容显示区 */}
          <div className="flex-1 space-y-6">
            {/* 基本资料设置 */}
            {activeSetting === 'basic' && (
              <div className="bg-white rounded-2xl shadow-card p-8">
                <h3 className="text-xl font-semibold text-text-primary mb-6">基本资料</h3>
                <form onSubmit={handleBasicProfileSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="full-name" className="block text-sm font-medium text-text-primary">姓名</label>
                      <input 
                        type="text" 
                        id="full-name" 
                        name="fullName" 
                        value={basicProfileForm.fullName}
                        onChange={(e) => setBasicProfileForm(prev => ({ ...prev, fullName: e.target.value }))}
                        className={`w-full px-4 py-3 border border-border-primary rounded-lg ${styles.formInputFocus} text-text-primary`}
                        placeholder="请输入您的姓名"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="block text-sm font-medium text-text-primary">邮箱地址</label>
                      <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        value={basicProfileForm.email}
                        onChange={(e) => setBasicProfileForm(prev => ({ ...prev, email: e.target.value }))}
                        className={`w-full px-4 py-3 border border-border-primary rounded-lg ${styles.formInputFocus} text-text-primary`}
                        placeholder="请输入您的邮箱地址"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="company" className="block text-sm font-medium text-text-primary">公司/组织</label>
                    <input 
                      type="text" 
                      id="company" 
                      name="company" 
                      value={basicProfileForm.company}
                      onChange={(e) => setBasicProfileForm(prev => ({ ...prev, company: e.target.value }))}
                      className={`w-full px-4 py-3 border border-border-primary rounded-lg ${styles.formInputFocus} text-text-primary`}
                      placeholder="请输入公司或组织名称"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="position" className="block text-sm font-medium text-text-primary">职位</label>
                    <input 
                      type="text" 
                      id="position" 
                      name="position" 
                      value={basicProfileForm.position}
                      onChange={(e) => setBasicProfileForm(prev => ({ ...prev, position: e.target.value }))}
                      className={`w-full px-4 py-3 border border-border-primary rounded-lg ${styles.formInputFocus} text-text-primary`}
                      placeholder="请输入您的职位"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="bio" className="block text-sm font-medium text-text-primary">个人简介</label>
                    <textarea 
                      id="bio" 
                      name="bio" 
                      rows={4}
                      value={basicProfileForm.bio}
                      onChange={(e) => setBasicProfileForm(prev => ({ ...prev, bio: e.target.value }))}
                      className={`w-full px-4 py-3 border border-border-primary rounded-lg ${styles.formInputFocus} text-text-primary resize-none`}
                      placeholder="简要介绍您的专业背景和技能..."
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-4 pt-4">
                    <button 
                      type="button" 
                      onClick={handleBasicProfileCancel}
                      className="px-6 py-3 border border-border-primary text-text-primary rounded-lg hover:bg-bg-secondary transition-colors"
                    >
                      取消
                    </button>
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="px-6 py-3 bg-gradient-primary text-white rounded-lg hover:shadow-glow transition-all disabled:opacity-50"
                    >
                      {isSubmitting ? '保存中...' : '保存更改'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* 账号安全设置 */}
            {activeSetting === 'security' && (
              <div className="bg-white rounded-2xl shadow-card p-8">
                <h3 className="text-xl font-semibold text-text-primary mb-6">账号安全</h3>
                <form onSubmit={handleAccountSecuritySubmit} className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-text-primary">修改密码</h4>
                    
                    <div className="space-y-2">
                      <label htmlFor="current-password" className="block text-sm font-medium text-text-primary">当前密码</label>
                      <input 
                        type="password" 
                        id="current-password" 
                        name="currentPassword" 
                        value={accountSecurityForm.currentPassword}
                        onChange={(e) => setAccountSecurityForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                        className={`w-full px-4 py-3 border border-border-primary rounded-lg ${styles.formInputFocus} text-text-primary`}
                        placeholder="请输入当前密码"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="new-password" className="block text-sm font-medium text-text-primary">新密码</label>
                      <input 
                        type="password" 
                        id="new-password" 
                        name="newPassword" 
                        value={accountSecurityForm.newPassword}
                        onChange={(e) => setAccountSecurityForm(prev => ({ ...prev, newPassword: e.target.value }))}
                        className={`w-full px-4 py-3 border border-border-primary rounded-lg ${styles.formInputFocus} text-text-primary`}
                        placeholder="请输入新密码（至少8位，包含字母和数字）"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="confirm-password" className="block text-sm font-medium text-text-primary">确认新密码</label>
                      <input 
                        type="password" 
                        id="confirm-password" 
                        name="confirmPassword" 
                        value={accountSecurityForm.confirmPassword}
                        onChange={(e) => setAccountSecurityForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className={`w-full px-4 py-3 border border-border-primary rounded-lg ${styles.formInputFocus} text-text-primary`}
                        placeholder="请再次输入新密码"
                      />
                    </div>
                  </div>
                  
                  <div className="border-t pt-6">
                    <h4 className="font-medium text-text-primary mb-4">登录历史</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between py-2">
                        <div>
                          <p className="text-text-primary font-medium">最近登录</p>
                          <p className="text-sm text-text-secondary">2024-01-15 14:30</p>
                        </div>
                        <span className="text-sm text-success">正常</span>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <div>
                          <p className="text-text-primary font-medium">上次登录</p>
                          <p className="text-sm text-text-secondary">2024-01-14 09:15</p>
                        </div>
                        <span className="text-sm text-success">正常</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-4 pt-4">
                    <button 
                      type="button" 
                      onClick={handleAccountSecurityCancel}
                      className="px-6 py-3 border border-border-primary text-text-primary rounded-lg hover:bg-bg-secondary transition-colors"
                    >
                      取消
                    </button>
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="px-6 py-3 bg-gradient-primary text-white rounded-lg hover:shadow-glow transition-all disabled:opacity-50"
                    >
                      {isSubmitting ? '保存中...' : '保存更改'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* 通知偏好设置 */}
            {activeSetting === 'notifications' && (
              <div className="bg-white rounded-2xl shadow-card p-8">
                <h3 className="text-xl font-semibold text-text-primary mb-6">通知偏好</h3>
                <form onSubmit={handleNotificationPreferencesSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-text-primary">邮件通知</h4>
                    
                    <div className="flex items-center justify-between p-4 bg-bg-secondary rounded-lg">
                      <div>
                        <p className="font-medium text-text-primary">项目状态更新</p>
                        <p className="text-sm text-text-secondary">当项目状态发生变化时通知</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={notificationPreferencesForm.emailProjectUpdates}
                          onChange={(e) => setNotificationPreferencesForm(prev => ({ ...prev, emailProjectUpdates: e.target.checked }))}
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-bg-secondary rounded-lg">
                      <div>
                        <p className="font-medium text-text-primary">方案生成完成</p>
                        <p className="text-sm text-text-secondary">当AI生成电路方案完成时通知</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={notificationPreferencesForm.emailSchemeCompleted}
                          onChange={(e) => setNotificationPreferencesForm(prev => ({ ...prev, emailSchemeCompleted: e.target.checked }))}
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-bg-secondary rounded-lg">
                      <div>
                        <p className="font-medium text-text-primary">系统更新</p>
                        <p className="text-sm text-text-secondary">当系统功能更新时通知</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={notificationPreferencesForm.emailSystemUpdates}
                          onChange={(e) => setNotificationPreferencesForm(prev => ({ ...prev, emailSystemUpdates: e.target.checked }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  </div>
                  
                  <div className="border-t pt-6">
                    <h4 className="font-medium text-text-primary mb-4">站内通知</h4>
                    
                    <div className="flex items-center justify-between p-4 bg-bg-secondary rounded-lg">
                      <div>
                        <p className="font-medium text-text-primary">实时消息</p>
                        <p className="text-sm text-text-secondary">在页面上显示实时通知</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={notificationPreferencesForm.inappRealtime}
                          onChange={(e) => setNotificationPreferencesForm(prev => ({ ...prev, inappRealtime: e.target.checked }))}
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-bg-secondary rounded-lg">
                      <div>
                        <p className="font-medium text-text-primary">声音提醒</p>
                        <p className="text-sm text-text-secondary">收到通知时播放提示音</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={notificationPreferencesForm.inappSound}
                          onChange={(e) => setNotificationPreferencesForm(prev => ({ ...prev, inappSound: e.target.checked }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-4 pt-4">
                    <button 
                      type="button" 
                      onClick={handleNotificationPreferencesCancel}
                      className="px-6 py-3 border border-border-primary text-text-primary rounded-lg hover:bg-bg-secondary transition-colors"
                    >
                      取消
                    </button>
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="px-6 py-3 bg-gradient-primary text-white rounded-lg hover:shadow-glow transition-all disabled:opacity-50"
                    >
                      {isSubmitting ? '保存中...' : '保存更改'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* 成功提示消息 */}
      {showSuccessMessage && (
        <div className={`fixed top-20 right-6 bg-success text-white px-6 py-3 rounded-lg shadow-lg z-50 ${styles.successMessage}`}>
          <div className="flex items-center space-x-2">
            <i className="fas fa-check-circle"></i>
            <span>{successMessageText}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfilePage;

