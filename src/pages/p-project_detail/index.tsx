

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import styles from './styles.module.css';

interface SchemeData {
  id: string;
  name: string;
  description: string;
  cost: number;
  performance: number;
  reliability: number;
  complexity: string;
  components: Array<{
    icon: string;
    name: string;
  }>;
  isSelected: boolean;
}

const ProjectDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId') || 'project-1';

  // 状态管理
  const [selectedSchemeId, setSelectedSchemeId] = useState<string>('scheme-1');
  const [activeOptimizationTab, setActiveOptimizationTab] = useState<string>('components');
  const [activeFileTab, setActiveFileTab] = useState<string>('schematic');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [voltageValue, setVoltageValue] = useState<number>(12);
  const [controllerType, setControllerType] = useState<string>('esp32-wroom');
  const [sensorType, setSensorType] = useState<string>('dht22');
  const [isCodeCopied, setIsCodeCopied] = useState<boolean>(false);

  // 方案数据
  const [schemesData, setSchemesData] = useState<SchemeData[]>([
    {
      id: 'scheme-1',
      name: '基础版方案',
      description: '经济实惠，满足基本功能需求',
      cost: 85,
      performance: 8.2,
      reliability: 9.0,
      complexity: '简单',
      components: [
        { icon: 'fas fa-microchip', name: 'ESP32-WROOM-32' },
        { icon: 'fas fa-thermometer-half', name: 'DHT22 温湿度传感器' },
        { icon: 'fas fa-wifi', name: 'WiFi 模块' }
      ],
      isSelected: true
    },
    {
      id: 'scheme-2',
      name: '增强版方案',
      description: '功能更强大，支持更多设备',
      cost: 120,
      performance: 9.1,
      reliability: 8.8,
      complexity: '中等',
      components: [
        { icon: 'fas fa-microchip', name: 'ESP32-S3-DevKitC' },
        { icon: 'fas fa-thermometer-half', name: 'BME280 环境传感器' },
        { icon: 'fas fa-wifi', name: 'WiFi + BLE 双模' }
      ],
      isSelected: false
    },
    {
      id: 'scheme-3',
      name: '专业版方案',
      description: '工业级可靠性，支持复杂场景',
      cost: 180,
      performance: 9.6,
      reliability: 9.5,
      complexity: '复杂',
      components: [
        { icon: 'fas fa-microchip', name: 'ESP32-PICO-KIT' },
        { icon: 'fas fa-thermometer-half', name: 'SHT31 高精度传感器' },
        { icon: 'fas fa-wifi', name: 'WiFi + 以太网' }
      ],
      isSelected: false
    }
  ]);

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '项目详情 - PCBTool.AI';
    return () => {
      document.title = originalTitle;
    };
  }, []);

  // 响应式侧边栏处理
  useEffect(() => {
    const handleResize = () => {
      const sidebar = document.querySelector('#sidebar');
      const mainContent = document.querySelector('#main-content');
      
      if (window.innerWidth < 768 && sidebar && mainContent) {
        sidebar.classList.add('-translate-x-full');
        mainContent.classList.remove('ml-64');
        mainContent.classList.add('ml-0');
      } else if (sidebar && mainContent) {
        sidebar.classList.remove('-translate-x-full');
        mainContent.classList.add('ml-64');
        mainContent.classList.remove('ml-0');
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // 事件处理函数
  const handleEditProject = () => {
    navigate(`/project-create?projectId=${projectId}`);
  };

  const handleDeleteProject = () => {
    if (confirm('确定要删除这个项目吗？此操作不可撤销。')) {
      console.log('删除项目');
      navigate('/project-list');
    }
  };

  const handleGenerateMoreSchemes = () => {
    console.log('生成更多方案');
  };

  const handleSchemeSelect = (schemeId: string) => {
    setSelectedSchemeId(schemeId);
    setSchemesData(prevSchemes =>
      prevSchemes.map(scheme => ({
        ...scheme,
        isSelected: scheme.id === schemeId
      }))
    );
  };

  const handleOptimizeScheme = () => {
    console.log('执行智能优化');
  };

  const handleCopyCode = async () => {
    const codeContent = `
#include <WiFi.h>
#include <DHT.h>

// WiFi配置
const char* ssid = "your_ssid";
const char* password = "your_password";

// DHT传感器配置
#define DHTPIN 4
#define DHTTYPE DHT22
DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(115200);
  dht.begin();
  
  // 连接WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("WiFi connected");
}

void loop() {
  // 读取温湿度
  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature();
  
  if (isnan(humidity) || isnan(temperature)) {
    Serial.println("Failed to read from DHT sensor!");
    return;
  }
  
  // 打印数据
  Serial.print("Humidity: ");
  Serial.print(humidity);
  Serial.print("%  Temperature: ");
  Serial.print(temperature);
  Serial.println("°C");
  
  delay(2000);
}
    `;

    try {
      await navigator.clipboard.writeText(codeContent.trim());
      setIsCodeCopied(true);
      setTimeout(() => {
        setIsCodeCopied(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      // 降级方案
      const textArea = document.createElement('textarea');
      textArea.value = codeContent.trim();
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setIsCodeCopied(true);
      setTimeout(() => {
        setIsCodeCopied(false);
      }, 2000);
    }
  };

  const handleExportAllFiles = () => {
    console.log('导出全部工程文件');
  };

  const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const query = searchQuery.trim();
      if (query) {
        console.log('搜索:', query);
      }
    }
  };

  const handleVoltageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVoltageValue(parseFloat(e.target.value));
  };

  const selectedScheme = schemesData.find(scheme => scheme.id === selectedSchemeId);

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
                onKeyPress={handleSearchSubmit}
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
                  src="https://s.coze.cn/image/YrLZt2gNM94/" 
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
              <h2 className="text-3xl font-bold text-text-primary mb-2">智能家居控制板</h2>
              <nav className="text-sm text-text-secondary">
                <span>工作台</span>
                <i className="fas fa-chevron-right mx-2"></i>
                <span>项目管理</span>
                <i className="fas fa-chevron-right mx-2"></i>
                <span className="text-primary">智能家居控制板</span>
              </nav>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={handleEditProject}
                className="px-4 py-2 border border-border-primary text-text-primary rounded-lg hover:bg-bg-secondary transition-colors"
              >
                <i className="fas fa-edit mr-2"></i>
                编辑项目
              </button>
              <button 
                onClick={handleDeleteProject}
                className="px-4 py-2 bg-danger text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <i className="fas fa-trash mr-2"></i>
                删除项目
              </button>
            </div>
          </div>
        </div>

        {/* 需求展示区 */}
        <section className="mb-8">
          <h3 className="text-xl font-semibold text-text-primary mb-4">项目需求</h3>
          <div className="bg-white rounded-2xl shadow-card">
            <div className="p-6 border-b border-border-primary">
              <h4 className="font-semibold text-text-primary mb-3">原始需求</h4>
              <div className="bg-bg-secondary rounded-lg p-4">
                <p className="text-text-primary">
                  设计一个智能家居控制板，需要支持WiFi连接，能够控制灯光、窗帘、空调等设备。要求使用ESP32作为主控芯片，包含温度传感器、湿度传感器，支持手机APP远程控制，电源使用12V直流供电。
                </p>
              </div>
            </div>
            <div className="p-6">
              <h4 className="font-semibold text-text-primary mb-3">结构化需求</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-bg-secondary rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-text-secondary text-sm">主控类型</span>
                  </div>
                  <span className="text-text-primary font-medium">ESP32</span>
                </div>
                <div className="bg-bg-secondary rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-text-secondary text-sm">连接方式</span>
                  </div>
                  <span className="text-text-primary font-medium">WiFi</span>
                </div>
                <div className="bg-bg-secondary rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-text-secondary text-sm">传感器需求</span>
                  </div>
                  <span className="text-text-primary font-medium">温度传感器、湿度传感器</span>
                </div>
                <div className="bg-bg-secondary rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-text-secondary text-sm">电源要求</span>
                  </div>
                  <span className="text-text-primary font-medium">12V直流供电</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 方案生成进度区 */}
        <section className="mb-8">
          <h3 className="text-xl font-semibold text-text-primary mb-4">方案生成进度</h3>
          <div className="bg-white rounded-2xl shadow-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 bg-success rounded-full ${styles.statusIndicator}`}></div>
                <span className="text-success font-medium">生成完成</span>
              </div>
              <span className="text-text-secondary text-sm">3个方案已生成</span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">需求解析</span>
                <span className="text-success">已完成</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">方案设计</span>
                <span className="text-success">已完成</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">元器件选型</span>
                <span className="text-success">已完成</span>
              </div>
            </div>
          </div>
        </section>

        {/* 方案对比与选择区 */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-text-primary">方案对比</h3>
            <button 
              onClick={handleGenerateMoreSchemes}
              className="px-4 py-2 bg-gradient-primary text-white rounded-lg hover:shadow-glow transition-all duration-300"
            >
              <i className="fas fa-plus mr-2"></i>
              生成更多方案
            </button>
          </div>
          
          {/* 方案卡片网格 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {schemesData.map((scheme) => (
              <div 
                key={scheme.id}
                onClick={() => handleSchemeSelect(scheme.id)}
                className={`bg-white rounded-2xl shadow-card ${styles.cardHover} cursor-pointer ${scheme.isSelected ? styles.schemeCardSelected : ''}`}
              >
                <div className="p-6 border-b border-border-primary">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-text-primary">{scheme.name}</h4>
                    {scheme.isSelected && (
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-success rounded-full"></div>
                        <span className="text-success text-sm font-medium">已选中</span>
                      </div>
                    )}
                  </div>
                  <p className="text-text-secondary text-sm mb-4">{scheme.description}</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center">
                      <div className="text-lg font-bold text-primary">¥{scheme.cost}</div>
                      <div className="text-xs text-text-secondary">成本估算</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-warning">{scheme.performance}</div>
                      <div className="text-xs text-text-secondary">性能评分</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-success">{scheme.reliability}</div>
                      <div className="text-xs text-text-secondary">可靠性</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-secondary">{scheme.complexity}</div>
                      <div className="text-xs text-text-secondary">复杂度</div>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-2 mb-4">
                    {scheme.components.map((component, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm">
                        <i className={`${component.icon} text-primary w-4`}></i>
                        <span className="text-text-primary">{component.name}</span>
                      </div>
                    ))}
                  </div>
                  <button className="w-full py-2 bg-gradient-primary text-white rounded-lg font-medium">
                    选择此方案
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 交互式设计优化区 */}
        <section className="mb-8">
          <h3 className="text-xl font-semibold text-text-primary mb-4">设计优化</h3>
          <div className="bg-white rounded-2xl shadow-card">
            <div className="p-6 border-b border-border-primary">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-text-primary">当前方案：{selectedScheme?.name}</h4>
                <button 
                  onClick={handleOptimizeScheme}
                  className="px-4 py-2 bg-gradient-secondary text-white rounded-lg hover:shadow-glow-secondary transition-all duration-300"
                >
                  <i className="fas fa-magic mr-2"></i>
                  智能优化
                </button>
              </div>
            </div>
            
            {/* 优化选项卡 */}
            <div className="p-6">
              <div className="flex space-x-4 mb-4" role="tablist">
                <button 
                  onClick={() => setActiveOptimizationTab('components')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg focus:outline-none ${activeOptimizationTab === 'components' ? styles.tabActive : styles.tabInactive}`}
                  role="tab"
                >
                  元器件替换
                </button>
                <button 
                  onClick={() => setActiveOptimizationTab('parameters')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg focus:outline-none ${activeOptimizationTab === 'parameters' ? styles.tabActive : styles.tabInactive}`}
                  role="tab"
                >
                  参数调整
                </button>
                <button 
                  onClick={() => setActiveOptimizationTab('cost')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg focus:outline-none ${activeOptimizationTab === 'cost' ? styles.tabActive : styles.tabInactive}`}
                  role="tab"
                >
                  成本优化
                </button>
              </div>
              
              {/* 元器件替换内容 */}
              {activeOptimizationTab === 'components' && (
                <div className="tab-content">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h5 className="font-medium text-text-primary">主控芯片</h5>
                      <div className="space-y-2">
                        <label className={`flex items-center space-x-3 p-3 border border-border-primary rounded-lg cursor-pointer ${controllerType === 'esp32-wroom' ? 'bg-primary bg-opacity-10 border-primary' : 'hover:bg-bg-secondary'}`}>
                          <input 
                            type="radio" 
                            name="controller" 
                            value="esp32-wroom" 
                            checked={controllerType === 'esp32-wroom'}
                            onChange={(e) => setControllerType(e.target.value)}
                            className="text-primary"
                          />
                          <div>
                            <div className="font-medium text-text-primary">ESP32-WROOM-32</div>
                            <div className="text-sm text-text-secondary">¥25.00</div>
                          </div>
                        </label>
                        <label className={`flex items-center space-x-3 p-3 border border-border-primary rounded-lg cursor-pointer ${controllerType === 'esp32-s3' ? 'bg-primary bg-opacity-10 border-primary' : 'hover:bg-bg-secondary'}`}>
                          <input 
                            type="radio" 
                            name="controller" 
                            value="esp32-s3" 
                            checked={controllerType === 'esp32-s3'}
                            onChange={(e) => setControllerType(e.target.value)}
                            className="text-primary"
                          />
                          <div>
                            <div className="font-medium text-text-primary">ESP32-S3-DevKitC</div>
                            <div className="text-sm text-text-secondary">¥35.00</div>
                          </div>
                        </label>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h5 className="font-medium text-text-primary">传感器</h5>
                      <div className="space-y-2">
                        <label className={`flex items-center space-x-3 p-3 border border-border-primary rounded-lg cursor-pointer ${sensorType === 'dht22' ? 'bg-primary bg-opacity-10 border-primary' : 'hover:bg-bg-secondary'}`}>
                          <input 
                            type="radio" 
                            name="sensor" 
                            value="dht22" 
                            checked={sensorType === 'dht22'}
                            onChange={(e) => setSensorType(e.target.value)}
                            className="text-primary"
                          />
                          <div>
                            <div className="font-medium text-text-primary">DHT22 温湿度传感器</div>
                            <div className="text-sm text-text-secondary">¥8.50</div>
                          </div>
                        </label>
                        <label className={`flex items-center space-x-3 p-3 border border-border-primary rounded-lg cursor-pointer ${sensorType === 'bme280' ? 'bg-primary bg-opacity-10 border-primary' : 'hover:bg-bg-secondary'}`}>
                          <input 
                            type="radio" 
                            name="sensor" 
                            value="bme280" 
                            checked={sensorType === 'bme280'}
                            onChange={(e) => setSensorType(e.target.value)}
                            className="text-primary"
                          />
                          <div>
                            <div className="font-medium text-text-primary">BME280 环境传感器</div>
                            <div className="text-sm text-text-secondary">¥12.00</div>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* 参数调整内容 */}
              {activeOptimizationTab === 'parameters' && (
                <div className="tab-content">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">工作电压</label>
                        <input 
                          type="range" 
                          min="3.3" 
                          max="12" 
                          step="0.1" 
                          value={voltageValue}
                          onChange={handleVoltageChange}
                          className="w-full"
                        />
                        <div className="flex justify-between text-sm text-text-secondary mt-1">
                          <span>3.3V</span>
                          <span>{voltageValue}V</span>
                          <span>12V</span>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">通信速率</label>
                        <select className="w-full p-2 border border-border-primary rounded-lg">
                          <option value="9600">9600 bps</option>
                          <option value="19200">19200 bps</option>
                          <option value="115200">115200 bps</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* 成本优化内容 */}
              {activeOptimizationTab === 'cost' && (
                <div className="tab-content">
                  <div className="space-y-4">
                    <div className="bg-bg-secondary rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-text-secondary">当前成本</span>
                        <span className="font-semibold text-text-primary">¥85.00</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-text-secondary">优化后成本</span>
                        <span className="font-semibold text-success">¥78.50</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-success bg-opacity-10 rounded-lg">
                        <div>
                          <div className="font-medium text-text-primary">电源模块替换</div>
                          <div className="text-sm text-text-secondary">使用更经济的电源方案</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-success">-¥6.50</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 工程文件预览与导出区 */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-text-primary">工程文件</h3>
            <button 
              onClick={handleExportAllFiles}
              className="px-4 py-2 bg-gradient-primary text-white rounded-lg hover:shadow-glow transition-all duration-300"
            >
              <i className="fas fa-download mr-2"></i>
              导出全部文件
            </button>
          </div>
          
          {/* 工程文件选项卡 */}
          <div className="bg-white rounded-2xl shadow-card">
            <div className="p-6 border-b border-border-primary">
              <div className="flex space-x-4" role="tablist">
                <button 
                  onClick={() => setActiveFileTab('schematic')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg focus:outline-none ${activeFileTab === 'schematic' ? styles.tabActive : styles.tabInactive}`}
                  role="tab"
                >
                  原理图
                </button>
                <button 
                  onClick={() => setActiveFileTab('pcb')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg focus:outline-none ${activeFileTab === 'pcb' ? styles.tabActive : styles.tabInactive}`}
                  role="tab"
                >
                  PCB布局
                </button>
                <button 
                  onClick={() => setActiveFileTab('code')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg focus:outline-none ${activeFileTab === 'code' ? styles.tabActive : styles.tabInactive}`}
                  role="tab"
                >
                  嵌入式代码
                </button>
                <button 
                  onClick={() => setActiveFileTab('docs')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg focus:outline-none ${activeFileTab === 'docs' ? styles.tabActive : styles.tabInactive}`}
                  role="tab"
                >
                  工程文档
                </button>
              </div>
            </div>
            
            {/* 原理图内容 */}
            {activeFileTab === 'schematic' && (
              <div className="tab-content p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-text-primary">电路原理图</h4>
                  <button className="px-4 py-2 border border-border-primary text-text-primary rounded-lg hover:bg-bg-secondary transition-colors">
                    <i className="fas fa-download mr-2"></i>
                    下载原理图
                  </button>
                </div>
                <div className="bg-bg-secondary rounded-lg p-4">
                  <img 
                    src="https://s.coze.cn/image/Wb5oBSpzjM0/" 
                    alt="智能家居控制板电路原理图" 
                    className="w-full rounded-lg shadow-sm"
                  />
                </div>
              </div>
            )}
            
            {/* PCB布局内容 */}
            {activeFileTab === 'pcb' && (
              <div className="tab-content p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-text-primary">PCB布局设计</h4>
                  <button className="px-4 py-2 border border-border-primary text-text-primary rounded-lg hover:bg-bg-secondary transition-colors">
                    <i className="fas fa-download mr-2"></i>
                    下载PCB文件
                  </button>
                </div>
                <div className="bg-bg-secondary rounded-lg p-4">
                  <img 
                    src="https://s.coze.cn/image/nCF-naFd-Zs/" 
                    alt="智能家居控制板PCB布局图" 
                    className="w-full rounded-lg shadow-sm"
                  />
                </div>
              </div>
            )}
            
            {/* 嵌入式代码内容 */}
            {activeFileTab === 'code' && (
              <div className="tab-content p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-text-primary">嵌入式代码</h4>
                  <div className="flex space-x-2">
                    <button 
                      onClick={handleCopyCode}
                      className="px-4 py-2 border border-border-primary text-text-primary rounded-lg hover:bg-bg-secondary transition-colors"
                    >
                      <i className={`fas ${isCodeCopied ? 'fa-check' : 'fa-copy'} mr-2`}></i>
                      {isCodeCopied ? '已复制' : '复制代码'}
                    </button>
                    <button className="px-4 py-2 border border-border-primary text-text-primary rounded-lg hover:bg-bg-secondary transition-colors">
                      <i className="fas fa-download mr-2"></i>
                      下载代码
                    </button>
                  </div>
                </div>
                <div className={styles.codeBlock}>
                  <pre><code className="language-cpp">
{`
#include <WiFi.h>
#include <DHT.h>

// WiFi配置
const char* ssid = "your_ssid";
const char* password = "your_password";

// DHT传感器配置
#define DHTPIN 4
#define DHTTYPE DHT22
DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(115200);
  dht.begin();
  
  // 连接WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("WiFi connected");
}

void loop() {
  // 读取温湿度
  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature();
  
  if (isnan(humidity) || isnan(temperature)) {
    Serial.println("Failed to read from DHT sensor!");
    return;
  }
  
  // 打印数据
  Serial.print("Humidity: ");
  Serial.print(humidity);
  Serial.print("%  Temperature: ");
  Serial.print(temperature);
  Serial.println("°C");
  
  delay(2000);
}
`}
                  </code></pre>
                </div>
              </div>
            )}
            
            {/* 工程文档内容 */}
            {activeFileTab === 'docs' && (
              <div className="tab-content p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-text-primary">工程文档</h4>
                  <button className="px-4 py-2 border border-border-primary text-text-primary rounded-lg hover:bg-bg-secondary transition-colors">
                    <i className="fas fa-download mr-2"></i>
                    下载文档包
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-bg-secondary rounded-lg">
                    <div className="flex items-center space-x-3">
                      <i className="fas fa-file-pdf text-danger text-lg"></i>
                      <div>
                        <div className="font-medium text-text-primary">设计说明书.pdf</div>
                        <div className="text-sm text-text-secondary">详细的设计说明和实现方案</div>
                      </div>
                    </div>
                    <button className="text-primary hover:text-secondary">
                      <i className="fas fa-download"></i>
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-bg-secondary rounded-lg">
                    <div className="flex items-center space-x-3">
                      <i className="fas fa-file-excel text-success text-lg"></i>
                      <div>
                        <div className="font-medium text-text-primary">BOM清单.xlsx</div>
                        <div className="text-sm text-text-secondary">元器件物料清单</div>
                      </div>
                    </div>
                    <button className="text-primary hover:text-secondary">
                      <i className="fas fa-download"></i>
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-bg-secondary rounded-lg">
                    <div className="flex items-center space-x-3">
                      <i className="fas fa-file-word text-info text-lg"></i>
                      <div>
                        <div className="font-medium text-text-primary">测试报告.docx</div>
                        <div className="text-sm text-text-secondary">功能测试和性能评估</div>
                      </div>
                    </div>
                    <button className="text-primary hover:text-secondary">
                      <i className="fas fa-download"></i>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ProjectDetailPage;

