

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  statusClass: string;
  createTime: string;
  createTimestamp: number;
}

const ProjectListPage: React.FC = () => {
  const navigate = useNavigate();
  
  // 模拟项目数据
  const mockProjects: Project[] = [
    {
      id: 'proj1',
      name: '智能家居控制板',
      description: '基于ESP32的智能家居中央控制器，支持WiFi、蓝牙和Zigbee协议',
      status: '进行中',
      statusClass: 'warning',
      createTime: '2024-01-15 14:30',
      createTimestamp: new Date('2024-01-15 14:30').getTime()
    },
    {
      id: 'proj2',
      name: '环境监测传感器',
      description: '集成温湿度、PM2.5、甲醛检测的多功能环境监测设备',
      status: '已完成',
      statusClass: 'success',
      createTime: '2024-01-12 09:15',
      createTimestamp: new Date('2024-01-12 09:15').getTime()
    },
    {
      id: 'proj3',
      name: '物联网网关',
      description: '工业级物联网数据采集网关，支持多种工业总线协议',
      status: '方案生成中',
      statusClass: 'info',
      createTime: '2024-01-10 16:45',
      createTimestamp: new Date('2024-01-10 16:45').getTime()
    },
    {
      id: 'proj4',
      name: '智能照明控制系统',
      description: '基于DALI协议的智能照明控制模块，支持场景模式切换',
      status: '已完成',
      statusClass: 'success',
      createTime: '2024-01-08 11:20',
      createTimestamp: new Date('2024-01-08 11:20').getTime()
    },
    {
      id: 'proj5',
      name: '电池管理系统',
      description: '锂电池保护和充放电管理系统，适用于电动工具',
      status: '进行中',
      statusClass: 'warning',
      createTime: '2024-01-05 13:10',
      createTimestamp: new Date('2024-01-05 13:10').getTime()
    },
    {
      id: 'proj6',
      name: '水质检测模块',
      description: '便携式水质检测传感器模块，支持多种参数检测',
      status: '已归档',
      statusClass: 'text-secondary',
      createTime: '2023-12-28 15:30',
      createTimestamp: new Date('2023-12-28 15:30').getTime()
    },
    {
      id: 'proj7',
      name: '智能门锁控制板',
      description: '支持指纹、密码、NFC的多功能智能门锁控制模块',
      status: '方案生成中',
      statusClass: 'info',
      createTime: '2023-12-25 10:45',
      createTimestamp: new Date('2023-12-25 10:45').getTime()
    },
    {
      id: 'proj8',
      name: '农业灌溉控制器',
      description: '基于土壤湿度传感器的智能灌溉控制系统',
      status: '已完成',
      statusClass: 'success',
      createTime: '2023-12-20 14:20',
      createTimestamp: new Date('2023-12-20 14:20').getTime()
    }
  ];

  // 状态管理
  const [currentProjects, setCurrentProjects] = useState<Project[]>([...mockProjects]);
  const [selectedProjects, setSelectedProjects] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [projectSearch, setProjectSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [timeFilter, setTimeFilter] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '项目管理 - PCBTool.AI';
    return () => { document.title = originalTitle; };
  }, []);

  // 筛选项目
  const filterProjects = () => {
    let filteredProjects = [...mockProjects];

    // 搜索筛选
    if (projectSearch) {
      const searchTerm = projectSearch.toLowerCase();
      filteredProjects = filteredProjects.filter(project =>
        project.name.toLowerCase().includes(searchTerm) ||
        project.description.toLowerCase().includes(searchTerm)
      );
    }

    // 状态筛选
    if (statusFilter) {
      filteredProjects = filteredProjects.filter(project => project.status === statusFilter);
    }

    // 时间筛选
    if (timeFilter) {
      filteredProjects = filteredProjects.filter(project => checkTimeFilter(project, timeFilter));
    }

    setCurrentProjects(filteredProjects);
    setCurrentPage(1);
    setSelectedProjects(new Set());
  };

  // 时间筛选检查
  const checkTimeFilter = (project: Project, filter: string): boolean => {
    const projectDate = new Date(project.createTime);
    const now = new Date();

    switch (filter) {
      case 'today':
        return projectDate.toDateString() === now.toDateString();
      case 'week':
        return projectDate >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case 'month':
        return projectDate >= new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      case 'quarter':
        return projectDate >= new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      default:
        return true;
    }
  };

  // 排序项目
  const sortProjects = () => {
    if (!sortField) return;

    const sortedProjects = [...currentProjects].sort((a, b) => {
      let aValue: string | number, bValue: string | number;

      switch (sortField) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'date':
          aValue = a.createTimestamp;
          bValue = b.createTimestamp;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    setCurrentProjects(sortedProjects);
  };

  // 处理排序
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // 处理全选
  const handleSelectAll = (checked: boolean) => {
    const currentPageProjects = getCurrentPageProjects();
    if (checked) {
      setSelectedProjects(new Set(currentPageProjects.map(project => project.id)));
    } else {
      setSelectedProjects(new Set());
    }
  };

  // 处理项目选择
  const handleProjectSelect = (projectId: string, checked: boolean) => {
    const newSelectedProjects = new Set(selectedProjects);
    if (checked) {
      newSelectedProjects.add(projectId);
    } else {
      newSelectedProjects.delete(projectId);
    }
    setSelectedProjects(newSelectedProjects);
  };

  // 获取当前页项目
  const getCurrentPageProjects = (): Project[] => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, currentProjects.length);
    return currentProjects.slice(startIndex, endIndex);
  };

  // 检查是否全选
  const isAllSelected = (): boolean => {
    const currentPageProjects = getCurrentPageProjects();
    return currentPageProjects.length > 0 && currentPageProjects.every(project => selectedProjects.has(project.id));
  };

  // 检查是否部分选中
  const isIndeterminate = (): boolean => {
    const currentPageProjects = getCurrentPageProjects();
    const selectedCount = currentPageProjects.filter(project => selectedProjects.has(project.id)).length;
    return selectedCount > 0 && selectedCount < currentPageProjects.length;
  };

  // 处理分页
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // 处理页面大小变更
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  // 项目操作
  const viewProject = (projectId: string) => {
    navigate(`/project-detail?projectId=${projectId}`);
  };

  const editProject = (projectId: string) => {
    navigate(`/project-create?projectId=${projectId}`);
  };

  const deleteProject = (projectId: string) => {
    setSelectedProjects(new Set([projectId]));
    setShowDeleteModal(true);
  };

  const archiveProject = (projectId: string) => {
    const project = mockProjects.find(p => p.id === projectId);
    if (project && project.status !== '已归档') {
      project.status = '已归档';
      project.statusClass = 'text-secondary';
      filterProjects();
      console.log(`项目 ${project.name} 已归档`);
    }
  };

  // 批量操作
  const batchDeleteProjects = () => {
    const projectNames = Array.from(selectedProjects).map(id => {
      const project = mockProjects.find(p => p.id === id);
      return project ? project.name : '';
    }).filter(name => name).join(', ');

    console.log(`批量删除项目: ${projectNames}`);

    // 从模拟数据中移除项目
    Array.from(selectedProjects).forEach(id => {
      const index = mockProjects.findIndex(p => p.id === id);
      if (index > -1) {
        mockProjects.splice(index, 1);
      }
    });

    setSelectedProjects(new Set());
    filterProjects();
    setShowDeleteModal(false);
  };

  const batchArchiveProjects = () => {
    const projectNames = Array.from(selectedProjects).map(id => {
      const project = mockProjects.find(p => p.id === id);
      return project ? project.name : '';
    }).filter(name => name).join(', ');

    console.log(`批量归档项目: ${projectNames}`);

    // 更新项目状态
    Array.from(selectedProjects).forEach(id => {
      const project = mockProjects.find(p => p.id === id);
      if (project && project.status !== '已归档') {
        project.status = '已归档';
        project.statusClass = 'text-secondary';
      }
    });

    setSelectedProjects(new Set());
    filterProjects();
  };

  // 全局搜索
  const handleGlobalSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const query = globalSearchQuery.trim();
      if (query) {
        console.log('全局搜索:', query);
      }
    }
  };

  // 生成页码
  const generatePageNumbers = () => {
    const totalPages = Math.ceil(currentProjects.length / pageSize);
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  // 筛选和排序效果
  useEffect(() => {
    filterProjects();
  }, [projectSearch, statusFilter, timeFilter]);

  useEffect(() => {
    sortProjects();
  }, [sortField, sortDirection]);

  const currentPageProjects = getCurrentPageProjects();
  const totalPages = Math.ceil(currentProjects.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, currentProjects.length);

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
                value={globalSearchQuery}
                onChange={(e) => setGlobalSearchQuery(e.target.value)}
                onKeyPress={handleGlobalSearch}
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
                  src="https://s.coze.cn/image/PnKnyXdgKi4/"
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
      <main className="ml-64 mt-16 p-6 min-h-screen">
        {/* 页面头部 */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-text-primary mb-2">项目管理</h2>
              <nav className="text-sm text-text-secondary">
                <span>工作台</span>
                <i className="fas fa-chevron-right mx-2"></i>
                <span>项目管理</span>
              </nav>
            </div>
            <div className="flex items-center space-x-3">
              <Link to="/project-create" className={`${styles.btnPrimary} px-6 py-3 rounded-lg font-medium`}>
                <i className="fas fa-plus mr-2"></i>
                创建新项目
              </Link>
            </div>
          </div>
        </div>

        {/* 工具栏区域 */}
        <section className="bg-white rounded-2xl shadow-card p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* 搜索和筛选 */}
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 flex-1">
              {/* 搜索框 */}
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="搜索项目名称或描述..."
                  value={projectSearch}
                  onChange={(e) => setProjectSearch(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 border border-border-primary rounded-lg ${styles.searchFocus} text-text-primary placeholder-text-secondary`}
                />
                <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary"></i>
              </div>

              {/* 状态筛选 */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={`px-4 py-2 border border-border-primary rounded-lg ${styles.searchFocus} text-text-primary bg-white`}
              >
                <option value="">全部状态</option>
                <option value="进行中">进行中</option>
                <option value="已完成">已完成</option>
                <option value="方案生成中">方案生成中</option>
                <option value="已归档">已归档</option>
              </select>

              {/* 时间筛选 */}
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className={`px-4 py-2 border border-border-primary rounded-lg ${styles.searchFocus} text-text-primary bg-white`}
              >
                <option value="">全部时间</option>
                <option value="today">今天</option>
                <option value="week">最近一周</option>
                <option value="month">最近一月</option>
                <option value="quarter">最近三月</option>
              </select>
            </div>

            {/* 批量操作 */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowDeleteModal(true)}
                disabled={selectedProjects.size === 0}
                className={`${styles.btnDanger} px-4 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <i className="fas fa-trash mr-2"></i>
                批量删除
              </button>
              <button
                onClick={batchArchiveProjects}
                disabled={selectedProjects.size === 0}
                className={`${styles.btnSecondary} px-4 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <i className="fas fa-archive mr-2"></i>
                批量归档
              </button>
            </div>
          </div>
        </section>

        {/* 项目列表 */}
        <section className="bg-white rounded-2xl shadow-card mb-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-bg-secondary">
                <tr>
                  <th className="text-left py-4 px-6 w-12">
                    <input
                      type="checkbox"
                      checked={isAllSelected()}
                      ref={(input) => {
                        if (input) input.indeterminate = isIndeterminate();
                      }}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-border-primary text-primary focus:ring-primary"
                    />
                  </th>
                  <th
                    className="text-left py-4 px-6 text-text-secondary font-medium cursor-pointer hover:text-primary transition-colors"
                    onClick={() => handleSort('name')}
                  >
                    项目名称
                    <i className={`fas ${sortField === 'name' ? (sortDirection === 'asc' ? 'fa-sort-up' : 'fa-sort-down') : 'fa-sort'} ml-1`}></i>
                  </th>
                  <th className="text-left py-4 px-6 text-text-secondary font-medium">描述</th>
                  <th
                    className="text-left py-4 px-6 text-text-secondary font-medium cursor-pointer hover:text-primary transition-colors"
                    onClick={() => handleSort('status')}
                  >
                    状态
                    <i className={`fas ${sortField === 'status' ? (sortDirection === 'asc' ? 'fa-sort-up' : 'fa-sort-down') : 'fa-sort'} ml-1`}></i>
                  </th>
                  <th
                    className="text-left py-4 px-6 text-text-secondary font-medium cursor-pointer hover:text-primary transition-colors"
                    onClick={() => handleSort('date')}
                  >
                    创建时间
                    <i className={`fas ${sortField === 'date' ? (sortDirection === 'asc' ? 'fa-sort-up' : 'fa-sort-down') : 'fa-sort'} ml-1`}></i>
                  </th>
                  <th className="text-left py-4 px-6 text-text-secondary font-medium">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-primary">
                {currentPageProjects.map(project => (
                  <tr key={project.id} className={styles.tableRow}>
                    <td className="py-4 px-6">
                      <input
                        type="checkbox"
                        checked={selectedProjects.has(project.id)}
                        onChange={(e) => handleProjectSelect(project.id, e.target.checked)}
                        className="rounded border-border-primary text-primary focus:ring-primary"
                      />
                    </td>
                    <td className="py-4 px-6">
                      <Link
                        to={`/project-detail?projectId=${project.id}`}
                        className="text-primary hover:text-secondary font-medium transition-colors"
                      >
                        {project.name}
                      </Link>
                    </td>
                    <td className="py-4 px-6 text-text-secondary">
                      {project.description.length > 50 ? project.description.substring(0, 50) + '...' : project.description}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 bg-${project.statusClass} bg-opacity-10 text-${project.statusClass} rounded-full text-sm font-medium`}>
                        {project.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-text-secondary">
                      {project.createTime}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => viewProject(project.id)}
                          className="text-primary hover:text-secondary transition-colors"
                          title="查看"
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                        <button
                          onClick={() => editProject(project.id)}
                          className="text-text-secondary hover:text-primary transition-colors"
                          title="编辑"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          onClick={() => deleteProject(project.id)}
                          className="text-danger hover:text-red-700 transition-colors"
                          title="删除"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                        <button
                          onClick={() => archiveProject(project.id)}
                          className="text-text-secondary hover:text-primary transition-colors"
                          title="归档"
                        >
                          <i className="fas fa-archive"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 空状态 */}
          {currentProjects.length === 0 && (
            <div className="p-12 text-center">
              <div className="w-24 h-24 bg-bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-folder-open text-3xl text-text-secondary"></i>
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">暂无项目</h3>
              <p className="text-text-secondary mb-6">创建您的第一个电路设计项目</p>
              <Link to="/project-create" className={`${styles.btnPrimary} px-6 py-3 rounded-lg font-medium`}>
                <i className="fas fa-plus mr-2"></i>
                创建新项目
              </Link>
            </div>
          )}
        </section>

        {/* 分页区域 */}
        <section className="flex items-center justify-between">
          <div className="text-sm text-text-secondary">
            显示 <span>{currentProjects.length > 0 ? startIndex : 0}</span> - <span>{endIndex}</span> 条，共 <span>{currentProjects.length}</span> 条记录
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className={`${styles.paginationItem} rounded-lg disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <i className="fas fa-chevron-left"></i>
            </button>

            <div className="flex space-x-1">
              {generatePageNumbers().map(page => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`${styles.paginationItem} rounded-lg ${currentPage === page ? styles.paginationItemActive : ''}`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className={`${styles.paginationItem} rounded-lg disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>

          <div className="flex items-center space-x-2 text-sm text-text-secondary">
            <span>每页显示</span>
            <select
              value={pageSize}
              onChange={(e) => handlePageSizeChange(parseInt(e.target.value))}
              className="px-2 py-1 border border-border-primary rounded text-text-primary bg-white"
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
            <span>条</span>
          </div>
        </section>
      </main>

      {/* 确认删除模态框 */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-danger bg-opacity-10 rounded-xl flex items-center justify-center mr-4">
                <i className="fas fa-exclamation-triangle text-danger text-xl"></i>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text-primary">确认删除</h3>
                <p className="text-sm text-text-secondary">此操作不可撤销</p>
              </div>
            </div>
            <p className="text-text-secondary mb-6">
              {selectedProjects.size > 1
                ? `您确定要删除选中的 ${selectedProjects.size} 个项目吗？`
                : '您确定要删除这个项目吗？'
              }
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className={`${styles.btnSecondary} px-4 py-2 rounded-lg font-medium`}
              >
                取消
              </button>
              <button
                onClick={batchDeleteProjects}
                className={`${styles.btnDanger} px-4 py-2 rounded-lg font-medium`}
              >
                删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectListPage;

