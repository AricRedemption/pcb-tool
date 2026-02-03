

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import styles from './styles.module.css';

interface ProjectFormData {
  projectName: string;
  projectDescription: string;
  textRequirements: string;
}

const ProjectCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState<ProjectFormData>({
    projectName: '',
    projectDescription: '',
    textRequirements: ''
  });
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [showUploadPreview, setShowUploadPreview] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '创建新项目 - PCBTool.AI';
    return () => { document.title = originalTitle; };
  }, []);

  // 检查是否为编辑模式并加载数据
  useEffect(() => {
    const projectId = searchParams.get('projectId');
    if (projectId) {
      setIsEditMode(true);
      loadProjectData(projectId);
    }
  }, [searchParams]);

  // 响应式侧边栏处理
  useEffect(() => {
    const handleResize = () => {
      const sidebar = document.querySelector('#sidebar');
      const mainContent = document.querySelector('#main-content');
      
      if (window.innerWidth < 768) {
        sidebar?.classList.add('-translate-x-full');
        mainContent?.classList.remove('ml-64');
        mainContent?.classList.add('ml-0');
      } else {
        sidebar?.classList.remove('-translate-x-full');
        mainContent?.classList.add('ml-64');
        mainContent?.classList.remove('ml-0');
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const loadProjectData = (projectId: string) => {
    // 模拟加载项目数据
    const mockProjectData: Record<string, ProjectFormData> = {
      'proj1': {
        projectName: '智能家居控制板',
        projectDescription: '基于ESP32的智能家居中央控制器，支持WiFi和蓝牙连接',
        textRequirements: '需要一个智能家居控制板，主要功能包括：\n1. WiFi和蓝牙双模通信\n2. 支持控制灯光、窗帘、空调等设备\n3. 电源输入5V/2A\n4. 尺寸尽量小巧\n5. 成本控制在50元以内'
      }
    };
    
    const projectData = mockProjectData[projectId];
    if (projectData) {
      setFormData(projectData);
    }
  };

  const validateForm = (): boolean => {
    if (!formData.projectName.trim()) {
      alert('请输入项目名称');
      return false;
    }
    
    if (!formData.textRequirements.trim()) {
      alert('请输入电路设计需求');
      return false;
    }
    
    return true;
  };

  const handleInputChange = (field: keyof ProjectFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      alert('文件大小不能超过5MB');
      return;
    }

    setUploadedFile(file);
    setShowUploadPreview(true);
  };

  const handleUploadAreaClick = () => {
    if (!showUploadPreview && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFileUpload(file);
    }
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setUploadedFile(null);
    setShowUploadPreview(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCancel = () => {
    if (confirm('确定要取消吗？未保存的内容将丢失。')) {
      navigate('/project-list');
    }
  };

  const handleSaveDraft = async () => {
    if (!validateForm()) return;
    
    setIsSavingDraft(true);
    
    const draftData = {
      ...formData,
      hasImage: showUploadPreview
    };
    
    console.log('保存草稿:', draftData);
    
    // 模拟保存延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSavingDraft(false);
    alert('草稿保存成功！');
  };

  const handleStartGenerate = () => {
    if (!validateForm()) return;
    
    const projectData = {
      ...formData,
      hasImage: showUploadPreview
    };
    
    console.log('开始生成方案:', projectData);
    
    // 生成项目ID
    const projectId = 'proj_' + Date.now();
    
    // 跳转到项目详情页
    navigate(`/project-detail?projectId=${projectId}&action=generate`);
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const query = (e.target as HTMLInputElement).value.trim();
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
                className={`w-full pl-10 pr-4 py-2 border border-border-primary rounded-lg ${styles.searchFocus} bg-bg-secondary text-text-primary placeholder-text-secondary`}
                onKeyPress={handleSearchKeyPress}
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
                  src="https://s.coze.cn/image/Avx_HBfX8Yk/" 
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
      <aside id="sidebar" className={`fixed left-0 top-16 bottom-0 w-64 bg-gradient-sidebar text-sidebar-text ${styles.sidebarTransition} z-40`}>
        <nav className="p-4 space-y-2">
          {/* 工作台 */}
          <Link to="/dashboard" className={`${styles.navItem} flex items-center space-x-3 px-4 py-3 rounded-lg`}>
            <i className="fas fa-tachometer-alt text-lg"></i>
            <span className="font-medium">工作台</span>
          </Link>
          
          {/* 项目管理 */}
          <Link to="/project-list" className={`${styles.navItem} ${styles.navItemActive} flex items-center space-x-3 px-4 py-3 rounded-lg`}>
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
      <main id="main-content" className="ml-64 mt-16 p-6 min-h-screen">
        {/* 页面头部 */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-text-primary mb-2">
                {isEditMode ? '编辑项目' : '创建新项目'}
              </h2>
              <nav className="text-sm text-text-secondary">
                <span>工作台</span>
                <i className="fas fa-chevron-right mx-2"></i>
                <span>项目管理</span>
                <i className="fas fa-chevron-right mx-2"></i>
                <span className="text-primary">
                  {isEditMode ? '编辑项目' : '创建新项目'}
                </span>
              </nav>
            </div>
          </div>
        </div>

        {/* 项目创建表单 */}
        <div className="bg-white rounded-2xl shadow-card">
          <form className="p-8 space-y-8">
            {/* 项目基本信息 */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-text-primary border-b border-border-primary pb-3">项目基本信息</h3>
              
              {/* 项目名称 */}
              <div className="space-y-2">
                <label htmlFor="project-name" className="block text-sm font-medium text-text-primary">
                  项目名称 <span className="text-danger">*</span>
                </label>
                <input 
                  type="text" 
                  id="project-name" 
                  name="project-name" 
                  className={`w-full px-4 py-3 border border-border-primary rounded-lg ${styles.formInputFocus} bg-white text-text-primary placeholder-text-secondary`}
                  placeholder="请输入项目名称，如：智能家居控制板"
                  value={formData.projectName}
                  onChange={(e) => handleInputChange('projectName', e.target.value)}
                  required
                />
                <p className="text-xs text-text-secondary">建议包含项目的主要功能或应用场景</p>
              </div>
              
              {/* 项目描述 */}
              <div className="space-y-2">
                <label htmlFor="project-description" className="block text-sm font-medium text-text-primary">
                  项目描述
                </label>
                <textarea 
                  id="project-description" 
                  name="project-description" 
                  rows={4}
                  className={`w-full px-4 py-3 border border-border-primary rounded-lg ${styles.formInputFocus} bg-white text-text-primary placeholder-text-secondary resize-none`}
                  placeholder="简要描述项目的背景、目标和应用场景..."
                  value={formData.projectDescription}
                  onChange={(e) => handleInputChange('projectDescription', e.target.value)}
                />
                <p className="text-xs text-text-secondary">帮助AI更好地理解您的项目需求</p>
              </div>
            </div>

            {/* 需求输入区 */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-text-primary border-b border-border-primary pb-3">电路设计需求</h3>
              
              {/* 文本需求输入 */}
              <div className="space-y-2">
                <label htmlFor="text-requirements" className="block text-sm font-medium text-text-primary">
                  详细需求描述 <span className="text-danger">*</span>
                </label>
                <textarea 
                  id="text-requirements" 
                  name="text-requirements" 
                  rows={6}
                  className={`w-full px-4 py-3 border border-border-primary rounded-lg ${styles.formInputFocus} bg-white text-text-primary placeholder-text-secondary resize-none`}
                  placeholder={`请详细描述您的电路设计需求，包括：
• 主要功能和性能要求
• 使用的主控芯片类型（如Arduino、ESP32、STM32等）
• 需要的传感器和执行器
• 电源要求和功耗限制
• 尺寸和封装要求
• 其他特殊要求...`}
                  value={formData.textRequirements}
                  onChange={(e) => handleInputChange('textRequirements', e.target.value)}
                  required
                />
                <p className="text-xs text-text-secondary">描述越详细，AI生成的方案越精准</p>
              </div>
              
              {/* 图像上传 */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-text-primary">
                  上传参考图像 <span className="text-text-secondary">(可选)</span>
                </label>
                <div 
                  className={`${styles.uploadArea} ${isDragOver ? styles.uploadAreaDragover : ''} rounded-lg p-8 text-center cursor-pointer`}
                  onClick={handleUploadAreaClick}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    accept="image/*" 
                    className="hidden"
                    onChange={handleFileInputChange}
                  />
                  {!showUploadPreview ? (
                    <div>
                      <i className="fas fa-cloud-upload-alt text-4xl text-text-secondary mb-4"></i>
                      <p className="text-text-primary font-medium mb-2">点击上传或拖拽图像到此处</p>
                      <p className="text-text-secondary text-sm">支持JPG、PNG格式，最大5MB</p>
                      <p className="text-text-secondary text-xs mt-2">可上传电路草图、参考设计图等</p>
                    </div>
                  ) : (
                    <div>
                      {uploadedFile && (
                        <img 
                          src={URL.createObjectURL(uploadedFile)} 
                          alt="预览图" 
                          className="max-w-full max-h-48 mx-auto rounded-lg"
                        />
                      )}
                      <p className="text-text-primary font-medium mt-2">
                        {uploadedFile?.name || ''}
                      </p>
                      <button 
                        type="button" 
                        onClick={handleRemoveImage}
                        className="text-danger hover:text-danger-dark mt-2 text-sm"
                      >
                        <i className="fas fa-trash mr-1"></i>移除图像
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 操作按钮区 */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-border-primary">
              <button 
                type="button" 
                onClick={handleCancel}
                className={`px-6 py-3 ${styles.btnSecondary} rounded-lg font-medium`}
              >
                <i className="fas fa-times mr-2"></i>
                取消
              </button>
              <button 
                type="button" 
                onClick={handleSaveDraft}
                disabled={isSavingDraft}
                className="px-6 py-3 bg-warning text-white rounded-lg font-medium hover:bg-warning-dark transition-all duration-300 disabled:opacity-50"
              >
                <i className={`fas ${isSavingDraft ? 'fa-check' : 'fa-save'} mr-2`}></i>
                {isSavingDraft ? '已保存' : '保存草稿'}
              </button>
              <button 
                type="button" 
                onClick={handleStartGenerate}
                className={`px-8 py-3 ${styles.btnPrimary} text-white rounded-lg font-medium`}
              >
                <i className="fas fa-magic mr-2"></i>
                开始生成方案
              </button>
            </div>
          </form>
        </div>

        {/* 提示信息 */}
        <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
              <i className="fas fa-lightbulb text-white"></i>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-text-primary">温馨提示</h4>
              <ul className="text-sm text-text-secondary space-y-1">
                <li>• 需求描述越详细，AI生成的电路方案质量越高</li>
                <li>• 建议明确主控芯片类型、电源要求等关键参数</li>
                <li>• 上传清晰的参考图像可以显著提升方案准确性</li>
                <li>• 系统将生成3-5个备选方案供您选择和优化</li>
                <li>• 生成过程通常需要30秒到2分钟，请耐心等待</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProjectCreatePage;

