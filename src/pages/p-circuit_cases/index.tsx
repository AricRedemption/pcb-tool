

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';
import { CaseData, CaseDatabase } from './types';

const CircuitCasesPage: React.FC = () => {
  const navigate = useNavigate();
  
  // 状态管理
  const [globalSearchValue, setGlobalSearchValue] = useState('');
  const [caseSearchValue, setCaseSearchValue] = useState('');
  const [applicationFilter, setApplicationFilter] = useState('');
  const [complexityFilter, setComplexityFilter] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCaseData, setSelectedCaseData] = useState<CaseData | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '电路案例库 - PCBTool.AI';
    return () => { document.title = originalTitle; };
  }, []);

  // 案例数据库
  const caseDatabase: CaseDatabase = {
    'case-001': {
      id: 'case-001',
      name: 'Arduino智能家居控制板',
      application: '物联网',
      complexity: '简单',
      description: '基于Arduino Uno的智能家居控制解决方案，支持灯光控制、窗帘控制、温度监测和远程控制功能。该方案采用模块化设计，易于扩展和维护，适合初学者和DIY爱好者使用。',
      image: 'https://s.coze.cn/image/RRDWKbOoqjk/',
      date: '2024-01-15',
      views: '1,234',
      components: [
        { name: 'Arduino Uno', type: '主控芯片' },
        { name: 'ESP8266', type: 'WiFi模块' },
        { name: '继电器模块', type: '执行器' },
        { name: 'DHT11', type: '温湿度传感器' }
      ],
      files: [
        { name: '原理图.pdf', size: '2.3 MB' },
        { name: 'PCB布局文件.kicad_pcb', size: '1.8 MB' },
        { name: '源代码.ino', size: '15 KB' },
        { name: 'BOM清单.xlsx', size: '8 KB' }
      ]
    },
    'case-002': {
      id: 'case-002',
      name: 'STM32工业控制模块',
      application: '工业控制',
      complexity: '中等',
      description: '高性能工业控制解决方案，基于STM32F4系列微控制器，支持多种传感器接口和通信协议。该模块设计用于恶劣工业环境，具有高可靠性和稳定性。',
      image: 'https://s.coze.cn/image/5p-8fubtpbU/',
      date: '2024-01-12',
      views: '856',
      components: [
        { name: 'STM32F407', type: '主控芯片' },
        { name: 'RS485模块', type: '通信接口' },
        { name: 'ADC模块', type: '模拟输入' },
        { name: 'DAC模块', type: '模拟输出' }
      ],
      files: [
        { name: '原理图.pdf', size: '4.1 MB' },
        { name: 'PCB布局文件.altium', size: '3.2 MB' },
        { name: '固件源代码.zip', size: '120 KB' },
        { name: '用户手册.pdf', size: '1.5 MB' }
      ]
    },
    'case-003': {
      id: 'case-003',
      name: 'ESP32环境监测节点',
      application: '物联网',
      complexity: '简单',
      description: '低功耗物联网环境监测设备，支持温湿度、PM2.5、光照等多种传感器',
      image: 'https://s.coze.cn/image/oM1GUrRi33Q/',
      date: '2024-01-10',
      views: '678',
      components: [
        { name: 'ESP32', type: '主控芯片' },
        { name: 'BME280', type: '温湿度传感器' },
        { name: 'PMS5003', type: 'PM2.5传感器' },
        { name: 'BH1750', type: '光照传感器' }
      ],
      files: [
        { name: '原理图.pdf', size: '1.8 MB' },
        { name: 'PCB布局文件.kicad_pcb', size: '1.5 MB' },
        { name: '源代码.zip', size: '25 KB' },
        { name: 'BOM清单.xlsx', size: '7 KB' }
      ]
    },
    'case-004': {
      id: 'case-004',
      name: '锂电池充电管理',
      application: '电源管理',
      complexity: '简单',
      description: '安全可靠的锂电池充电解决方案，支持多种电池类型和保护功能',
      image: 'https://s.coze.cn/image/2iFNEpdW_Xw/',
      date: '2024-01-08',
      views: '456',
      components: [
        { name: 'TP4056', type: '充电管理芯片' },
        { name: 'DW01', type: '保护芯片' },
        { name: 'FS8205A', type: 'MOS管' },
        { name: 'LED指示灯', type: '状态指示' }
      ],
      files: [
        { name: '原理图.pdf', size: '1.2 MB' },
        { name: 'PCB布局文件.kicad_pcb', size: '950 KB' },
        { name: 'BOM清单.xlsx', size: '5 KB' }
      ]
    },
    'case-005': {
      id: 'case-005',
      name: '汽车CAN总线通信模块',
      application: '汽车电子',
      complexity: '复杂',
      description: '符合汽车级标准的CAN总线通信解决方案，支持高可靠性数据传输',
      image: 'https://s.coze.cn/image/8y0nYPPQxNo/',
      date: '2024-01-05',
      views: '923',
      components: [
        { name: 'STM32F103', type: '主控芯片' },
        { name: 'MCP2551', type: 'CAN收发器' },
        { name: 'TJA1050', type: 'CAN控制器' },
        { name: 'TVS二极管', type: '保护器件' }
      ],
      files: [
        { name: '原理图.pdf', size: '3.5 MB' },
        { name: 'PCB布局文件.altium', size: '2.8 MB' },
        { name: '固件源代码.zip', size: '85 KB' },
        { name: '测试报告.pdf', size: '2.1 MB' }
      ]
    },
    'case-006': {
      id: 'case-006',
      name: '心率监测医疗设备',
      application: '医疗电子',
      complexity: '中等',
      description: '高精度医疗级心率监测解决方案，符合相关医疗认证标准',
      image: 'https://s.coze.cn/image/bcwJhe-QiNo/',
      date: '2024-01-03',
      views: '745',
      components: [
        { name: 'MAX30102', type: '心率传感器' },
        { name: 'nRF52832', type: '蓝牙MCU' },
        { name: 'LIS2DH12', type: '加速度传感器' },
        { name: 'CR2032', type: '电池' }
      ],
      files: [
        { name: '原理图.pdf', size: '2.7 MB' },
        { name: 'PCB布局文件.kicad_pcb', size: '2.1 MB' },
        { name: '固件源代码.zip', size: '65 KB' },
        { name: '医疗认证报告.pdf', size: '4.2 MB' }
      ]
    },
    'case-007': {
      id: 'case-007',
      name: '蓝牙音响功放电路',
      application: '消费电子',
      complexity: '简单',
      description: '高保真蓝牙音响解决方案，支持多种音频格式和音效处理',
      image: 'https://s.coze.cn/image/JOHE_y8-OLg/',
      date: '2024-01-01',
      views: '1,123',
      components: [
        { name: 'CSR8675', type: '蓝牙芯片' },
        { name: 'TPA3116D2', type: '功放芯片' },
        { name: 'NE5532', type: '运放芯片' },
        { name: 'RC滤波器', type: '音频处理' }
      ],
      files: [
        { name: '原理图.pdf', size: '2.2 MB' },
        { name: 'PCB布局文件.altium', size: '1.8 MB' },
        { name: '固件源代码.zip', size: '45 KB' },
        { name: 'BOM清单.xlsx', size: '6 KB' }
      ]
    },
    'case-008': {
      id: 'case-008',
      name: 'PLC控制模块',
      application: '工业控制',
      complexity: '复杂',
      description: '工业级PLC控制解决方案，支持多种输入输出接口和通信协议',
      image: 'https://s.coze.cn/image/BHLiWf1QxIk/',
      date: '2023-12-28',
      views: '654',
      components: [
        { name: 'S7-1200', type: 'PLC控制器' },
        { name: 'SM 1223', type: '数字量I/O模块' },
        { name: 'SM 1231', type: '模拟量输入模块' },
        { name: 'SM 1232', type: '模拟量输出模块' }
      ],
      files: [
        { name: '系统配置图.pdf', size: '3.8 MB' },
        { name: '梯形图程序.zip', size: '120 KB' },
        { name: '用户手册.pdf', size: '2.5 MB' },
        { name: '接线图.pdf', size: '1.8 MB' }
      ]
    }
  };

  // 获取应用领域样式类
  const getApplicationClass = (application: string): string => {
    const classes: { [key: string]: string } = {
      '物联网': 'px-2 py-1 bg-primary bg-opacity-10 text-primary rounded-full text-xs font-medium',
      '工业控制': 'px-2 py-1 bg-warning bg-opacity-10 text-warning rounded-full text-xs font-medium',
      '汽车电子': 'px-2 py-1 bg-danger bg-opacity-10 text-danger rounded-full text-xs font-medium',
      '医疗电子': 'px-2 py-1 bg-secondary bg-opacity-10 text-secondary rounded-full text-xs font-medium',
      '消费电子': 'px-2 py-1 bg-info bg-opacity-10 text-info rounded-full text-xs font-medium',
      '电源管理': 'px-2 py-1 bg-tertiary bg-opacity-10 text-tertiary rounded-full text-xs font-medium'
    };
    return classes[application] || 'px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium';
  };

  // 获取复杂度样式类
  const getComplexityClass = (complexity: string): string => {
    const classes: { [key: string]: string } = {
      '简单': 'px-2 py-1 bg-success bg-opacity-10 text-success rounded-full text-xs font-medium',
      '中等': 'px-2 py-1 bg-warning bg-opacity-10 text-warning rounded-full text-xs font-medium',
      '复杂': 'px-2 py-1 bg-danger bg-opacity-10 text-danger rounded-full text-xs font-medium'
    };
    return classes[complexity] || 'px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium';
  };

  // 全局搜索处理
  const handleGlobalSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const query = globalSearchValue.trim();
      if (query) {
        console.log('全局搜索:', query);
        // 这里可以添加全局搜索逻辑
      }
    }
  };

  // 案例搜索处理
  const handleCaseSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      performSearch();
    }
  };

  const performSearch = () => {
    const searchTerm = caseSearchValue.trim();
    
    console.log('搜索案例:', {
      searchTerm,
      applicationFilter,
      complexityFilter
    });
    
    setIsSearching(true);
    
    setTimeout(() => {
      setIsSearching(false);
    }, 1000);
  };

  // 案例卡片点击处理
  const handleCaseCardClick = (caseId: string) => {
    const caseData = caseDatabase[caseId];
    if (caseData) {
      setSelectedCaseData(caseData);
      setIsModalVisible(true);
    }
  };

  // 关闭模态弹窗
  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedCaseData(null);
  };

  // 应用案例到项目
  const handleUseCase = () => {
    console.log('应用案例到项目');
    alert('案例已成功应用到新项目！');
    handleCloseModal();
  };

  // 分页处理
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  };

  // 渲染案例卡片
  const renderCaseCard = (caseData: CaseData) => (
    <div
      key={caseData.id}
      className={`${styles.caseCard} bg-gradient-card rounded-xl p-6 shadow-card`}
      onClick={() => handleCaseCardClick(caseData.id)}
    >
      <div className="mb-4">
        <img
          src={caseData.image}
          alt={caseData.name}
          className="w-full h-32 object-cover rounded-lg"
          loading="lazy"
        />
      </div>
      <h4 className="font-semibold text-text-primary mb-2">{caseData.name}</h4>
      <p className="text-sm text-text-secondary mb-3 line-clamp-2">{caseData.description}</p>
      <div className="flex items-center justify-between mb-3">
        <span className={getApplicationClass(caseData.application)}>{caseData.application}</span>
        <span className={getComplexityClass(caseData.complexity)}>{caseData.complexity}</span>
      </div>
      <div className="flex items-center justify-between text-xs text-text-secondary">
        <span><i className="fas fa-calendar mr-1"></i>{caseData.date}</span>
        <span><i className="fas fa-eye mr-1"></i>{caseData.views} 次浏览</span>
      </div>
    </div>
  );

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
                value={globalSearchValue}
                onChange={(e) => setGlobalSearchValue(e.target.value)}
                onKeyPress={handleGlobalSearchKeyPress}
                placeholder="搜索项目、元器件、案例..."
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
                  src="https://s.coze.cn/image/jZ1ms1fMX3s/"
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
          <Link to="/knowledge-base" className={`${styles.navItem} ${styles.navItemActive} flex items-center space-x-3 px-4 py-3 rounded-lg`}>
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
              <h2 className="text-3xl font-bold text-text-primary mb-2">电路案例库</h2>
              <nav className="text-sm text-text-secondary">
                <span>工作台</span>
                <i className="fas fa-chevron-right mx-2"></i>
                <span>知识库</span>
                <i className="fas fa-chevron-right mx-2"></i>
                <span className="text-primary">电路案例库</span>
              </nav>
            </div>
          </div>
        </div>

        {/* 工具栏区域 */}
        <section className="mb-6">
          <div className="bg-white rounded-2xl shadow-card p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* 搜索框 */}
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <input
                    type="text"
                    value={caseSearchValue}
                    onChange={(e) => setCaseSearchValue(e.target.value)}
                    onKeyPress={handleCaseSearchKeyPress}
                    placeholder="搜索案例名称、关键词..."
                    className={`w-full pl-10 pr-4 py-3 border border-border-primary rounded-lg ${styles.searchFocus} text-text-primary placeholder-text-secondary`}
                  />
                  <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary"></i>
                </div>
              </div>
              
              {/* 筛选条件 */}
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                {/* 应用领域筛选 */}
                <div className="relative">
                  <select
                    value={applicationFilter}
                    onChange={(e) => setApplicationFilter(e.target.value)}
                    className={`appearance-none bg-white border border-border-primary rounded-lg px-4 py-3 pr-10 ${styles.filterFocus} text-text-primary`}
                  >
                    <option value="">全部领域</option>
                    <option value="consumer">消费电子</option>
                    <option value="industrial">工业控制</option>
                    <option value="automotive">汽车电子</option>
                    <option value="medical">医疗电子</option>
                    <option value="iot">物联网</option>
                    <option value="power">电源管理</option>
                  </select>
                  <i className="fas fa-chevron-down absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary pointer-events-none"></i>
                </div>
                
                {/* 复杂度筛选 */}
                <div className="relative">
                  <select
                    value={complexityFilter}
                    onChange={(e) => setComplexityFilter(e.target.value)}
                    className={`appearance-none bg-white border border-border-primary rounded-lg px-4 py-3 pr-10 ${styles.filterFocus} text-text-primary`}
                  >
                    <option value="">全部复杂度</option>
                    <option value="simple">简单</option>
                    <option value="medium">中等</option>
                    <option value="complex">复杂</option>
                  </select>
                  <i className="fas fa-chevron-down absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary pointer-events-none"></i>
                </div>
                
                {/* 搜索按钮 */}
                <button
                  onClick={performSearch}
                  disabled={isSearching}
                  className="bg-gradient-primary text-white px-6 py-3 rounded-lg font-medium hover:shadow-glow transition-all duration-300 disabled:opacity-50"
                >
                  <i className={`fas ${isSearching ? 'fa-spinner fa-spin' : 'fa-search'} mr-2`}></i>
                  {isSearching ? '搜索中...' : '搜索'}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 案例列表区域 */}
        <section className="mb-8">
          <div className="bg-white rounded-2xl shadow-card">
            {/* 案例统计 */}
            <div className="p-6 border-b border-border-primary">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-text-primary">电路案例</h3>
                <div className="text-sm text-text-secondary">
                  共 <span className="font-medium text-primary">12,345</span> 个案例
                </div>
              </div>
            </div>
            
            {/* 案例卡片网格 */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Object.values(caseDatabase).map(renderCaseCard)}
              </div>
            </div>
            
            {/* 分页区域 */}
            <div className="p-6 border-t border-border-primary">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                {/* 显示信息 */}
                <div className="text-sm text-text-secondary">
                  显示第 <span className="font-medium text-text-primary">1-8</span> 条，共 <span className="font-medium text-text-primary">12,345</span> 条记录
                </div>
                
                {/* 分页控件 */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`${styles.paginationButton} px-3 py-2 border border-border-primary rounded-lg text-text-secondary ${currentPage === 1 ? 'disabled' : ''}`}
                  >
                    <i className="fas fa-chevron-left"></i>
                  </button>
                  
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handlePageChange(1)}
                      className={`${styles.paginationButton} px-3 py-2 border border-border-primary rounded-lg text-text-primary ${currentPage === 1 ? 'active' : ''}`}
                    >
                      1
                    </button>
                    <button
                      onClick={() => handlePageChange(2)}
                      className={`${styles.paginationButton} px-3 py-2 border border-border-primary rounded-lg text-text-secondary ${currentPage === 2 ? 'active' : ''}`}
                    >
                      2
                    </button>
                    <button
                      onClick={() => handlePageChange(3)}
                      className={`${styles.paginationButton} px-3 py-2 border border-border-primary rounded-lg text-text-secondary ${currentPage === 3 ? 'active' : ''}`}
                    >
                      3
                    </button>
                    <span className="px-3 py-2 text-text-secondary">...</span>
                    <button
                      onClick={() => handlePageChange(1544)}
                      className={`${styles.paginationButton} px-3 py-2 border border-border-primary rounded-lg text-text-secondary ${currentPage === 1544 ? 'active' : ''}`}
                    >
                      1544
                    </button>
                  </div>
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    className={`${styles.paginationButton} px-3 py-2 border border-border-primary rounded-lg text-text-secondary`}
                  >
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </div>
                
                {/* 每页条数选择 */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-text-secondary">每页显示</span>
                  <select
                    value={pageSize}
                    onChange={handlePageSizeChange}
                    className={`appearance-none bg-white border border-border-primary rounded-lg px-3 py-2 pr-8 ${styles.filterFocus} text-text-primary text-sm`}
                  >
                    <option value="8">8</option>
                    <option value="16">16</option>
                    <option value="32">32</option>
                    <option value="64">64</option>
                  </select>
                  <i className="fas fa-chevron-down absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary pointer-events-none"></i>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 案例详情模态弹窗 */}
      {isModalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={handleCloseModal}>
          <div className="flex items-center justify-center min-h-screen p-4">
            <div
              className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 模态弹窗头部 */}
              <div className="flex items-center justify-between p-6 border-b border-border-primary">
                <h3 className="text-xl font-semibold text-text-primary">案例详情</h3>
                <button onClick={handleCloseModal} className="text-text-secondary hover:text-text-primary transition-colors">
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
              
              {/* 模态弹窗内容 */}
              <div className="p-6">
                {selectedCaseData ? (
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-text-primary mb-2">案例名称</h4>
                      <p className="text-text-secondary">{selectedCaseData.name}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-text-primary mb-2">应用领域</h4>
                      <span className={getApplicationClass(selectedCaseData.application)}>{selectedCaseData.application}</span>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-text-primary mb-2">复杂度</h4>
                      <span className={getComplexityClass(selectedCaseData.complexity)}>{selectedCaseData.complexity}</span>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-text-primary mb-2">案例描述</h4>
                      <p className="text-text-secondary leading-relaxed">{selectedCaseData.description}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-text-primary mb-2">主要元器件</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {selectedCaseData.components.map((component, index) => (
                          <div key={index} className="flex items-center space-x-3 p-3 bg-bg-secondary rounded-lg">
                            <i className="fas fa-microchip text-primary"></i>
                            <div>
                              <div className="font-medium text-text-primary">{component.name}</div>
                              <div className="text-sm text-text-secondary">{component.type}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-text-primary mb-2">相关文件</h4>
                      <div className="space-y-2">
                        {selectedCaseData.files.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border border-border-primary rounded-lg">
                            <div className="flex items-center space-x-3">
                              <i className="fas fa-file-alt text-primary"></i>
                              <div>
                                <div className="font-medium text-text-primary">{file.name}</div>
                                <div className="text-sm text-text-secondary">{file.size}</div>
                              </div>
                            </div>
                            <button className="text-primary hover:text-secondary transition-colors">
                              <i className="fas fa-download"></i>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <i className="fas fa-spinner fa-spin text-4xl text-primary mb-4"></i>
                    <p className="text-text-secondary">加载中...</p>
                  </div>
                )}
              </div>
              
              {/* 模态弹窗底部 */}
              <div className="flex items-center justify-end space-x-3 p-6 border-t border-border-primary">
                <button
                  onClick={handleCloseModal}
                  className="px-6 py-2 border border-border-primary rounded-lg text-text-secondary hover:bg-bg-secondary transition-colors"
                >
                  关闭
                </button>
                <button
                  onClick={handleUseCase}
                  className="bg-gradient-primary text-white px-6 py-2 rounded-lg font-medium hover:shadow-glow transition-all duration-300"
                >
                  <i className="fas fa-plus mr-2"></i>
                  应用到项目
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CircuitCasesPage;

