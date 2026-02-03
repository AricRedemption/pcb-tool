import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../../components/AppShell';
import { Project, ProjectStatus } from '../../domain/project';
import { deleteProject, listProjects } from '../../lib/projectsStore';

type StatusOption = {
  value: ProjectStatus | 'all';
  label: string;
};

const STATUS_OPTIONS: readonly StatusOption[] = [
  { value: 'all', label: '全部状态' },
  { value: 'draft', label: '草稿' },
  { value: 'generating', label: '生成中' },
  { value: 'in_progress', label: '进行中' },
  { value: 'completed', label: '已完成' },
  { value: 'archived', label: '已归档' },
];

function formatDateTime(ms: number): string {
  const date = new Date(ms);
  const yyyy = String(date.getFullYear());
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
}

function getStatusBadge(status: ProjectStatus): { text: string; className: string } {
  switch (status) {
  case 'draft':
    return { text: '草稿', className: 'bg-bg-secondary text-text-secondary' };
  case 'generating':
    return { text: '生成中', className: 'bg-info bg-opacity-10 text-info' };
  case 'in_progress':
    return { text: '进行中', className: 'bg-warning bg-opacity-10 text-warning' };
  case 'completed':
    return { text: '已完成', className: 'bg-success bg-opacity-10 text-success' };
  case 'archived':
    return { text: '已归档', className: 'bg-border-primary text-text-secondary' };
  default:
    return { text: status, className: 'bg-bg-secondary text-text-secondary' };
  }
}

function matchesQuery(project: Project, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) {
    return true;
  }
  return (
    project.name.toLowerCase().includes(q) ||
    project.description.toLowerCase().includes(q) ||
    project.requirementsText.toLowerCase().includes(q)
  );
}

const ProjectListPage: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<ProjectStatus | 'all'>('all');
  const [refreshToken, setRefreshToken] = useState(0);

  const projects = useMemo(() => {
    const all = listProjects();
    return all.filter((p) => (status === 'all' ? true : p.status === status)).filter((p) => matchesQuery(p, query));
  }, [query, refreshToken, status]);

  const handleDelete = (projectId: string) => {
    if (!confirm('确定要删除这个项目吗？此操作不可撤销。')) {
      return;
    }
    deleteProject(projectId);
    setRefreshToken((v) => v + 1);
  };

  return (
    <AppShell pageTitle="项目管理" breadcrumb={['工作台', '项目管理']}>
      <div className="bg-white rounded-2xl shadow-card">
        <div className="p-6 border-b border-border-primary flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative w-full md:w-80">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="搜索项目名称 / 描述 / 需求..."
                className="w-full pl-10 pr-4 py-2 border border-border-primary rounded-lg bg-bg-secondary text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-30"
              />
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary"></i>
            </div>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ProjectStatus | 'all')}
              className="px-3 py-2 border border-border-primary rounded-lg bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-30"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={() => navigate('/project-create')}
            className="bg-gradient-primary text-white px-6 py-3 rounded-lg font-medium hover:shadow-glow transition-all duration-300"
          >
            <i className="fas fa-plus mr-2"></i>
            创建新项目
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="p-10 text-center text-text-secondary">
            <div className="text-4xl mb-3">
              <i className="fas fa-folder-open"></i>
            </div>
            <div className="text-lg font-medium text-text-primary mb-1">暂无项目</div>
            <div className="text-sm">先创建一个项目，或者从模块工作流拼一个系统。</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-bg-secondary">
                <tr>
                  <th className="text-left py-3 px-6 text-text-secondary font-medium">项目</th>
                  <th className="text-left py-3 px-6 text-text-secondary font-medium">工作流</th>
                  <th className="text-left py-3 px-6 text-text-secondary font-medium">状态</th>
                  <th className="text-left py-3 px-6 text-text-secondary font-medium">更新时间</th>
                  <th className="text-right py-3 px-6 text-text-secondary font-medium">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-primary">
                {projects.map((p) => {
                  const badge = getStatusBadge(p.status);
                  return (
                    <tr key={p.id} className="hover:bg-bg-secondary transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-gradient-card rounded-xl flex items-center justify-center flex-shrink-0 border border-border-primary">
                            <i className="fas fa-microchip text-primary"></i>
                          </div>
                          <div className="min-w-0">
                            <button
                              type="button"
                              onClick={() => navigate(`/project-detail?projectId=${p.id}`)}
                              className="text-primary hover:text-secondary font-semibold text-left"
                            >
                              {p.name}
                            </button>
                            <div className="text-sm text-text-secondary truncate max-w-[38rem]">{p.description || '—'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm text-text-secondary">
                        {p.workflow.nodes.length} 模块 / {p.workflow.connections.length} 连接
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${badge.className}`}>
                          {badge.text}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-text-secondary text-sm">{formatDateTime(p.updatedAtMs)}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end space-x-3">
                          <button
                            type="button"
                            onClick={() => navigate(`/project-detail?projectId=${p.id}`)}
                            className="text-primary hover:text-secondary transition-colors"
                            aria-label="查看"
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                          <button
                            type="button"
                            onClick={() => navigate(`/project-create?projectId=${p.id}`)}
                            className="text-text-secondary hover:text-primary transition-colors"
                            aria-label="编辑"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(p.id)}
                            className="text-text-secondary hover:text-danger transition-colors"
                            aria-label="删除"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppShell>
  );
};

export default ProjectListPage;
