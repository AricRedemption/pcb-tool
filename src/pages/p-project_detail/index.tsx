import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AppShell from '../../components/AppShell';
import { MODULE_CATALOG } from '../../domain/moduleCatalog';
import { Project } from '../../domain/project';
import { validateWorkflow } from '../../domain/workflow';
import WorkflowGraph from '../../components/WorkflowGraph';
import { deleteProject, getProjectById, setProjectStatus } from '../../lib/projectsStore';

type TabKey = 'workflow' | 'requirements' | 'schemes';

function formatDateTime(ms: number): string {
  const date = new Date(ms);
  const yyyy = String(date.getFullYear());
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
}

function TabButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'px-4 py-2 rounded-lg font-medium transition-colors',
        active ? 'bg-bg-secondary text-text-primary' : 'text-text-secondary hover:bg-bg-secondary',
      ].join(' ')}
    >
      {children}
    </button>
  );
}

function ProjectNotFound({ onBack }: { onBack: () => void }) {
  return (
    <div className="bg-white rounded-2xl shadow-card p-10 text-center">
      <div className="text-4xl mb-3 text-text-secondary">
        <i className="fas fa-exclamation-triangle"></i>
      </div>
      <div className="text-lg font-semibold text-text-primary mb-1">项目不存在或已被删除</div>
      <div className="text-sm text-text-secondary mb-6">你可以返回项目列表，或者新建一个项目。</div>
      <button
        type="button"
        onClick={onBack}
        className="bg-gradient-primary text-white px-6 py-3 rounded-lg font-medium hover:shadow-glow transition-all duration-300"
      >
        返回项目列表
      </button>
    </div>
  );
}

function WorkflowSummary({ project }: { project: Project }) {
  const issues = useMemo(() => validateWorkflow(project.workflow, MODULE_CATALOG), [project.workflow]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-card p-6">
          <div className="text-sm text-text-secondary">模块数</div>
          <div className="text-3xl font-bold text-text-primary mt-1">{project.workflow.nodes.length}</div>
        </div>
        <div className="bg-white rounded-2xl shadow-card p-6">
          <div className="text-sm text-text-secondary">连接数</div>
          <div className="text-3xl font-bold text-text-primary mt-1">{project.workflow.connections.length}</div>
        </div>
        <div className="bg-white rounded-2xl shadow-card p-6">
          <div className="text-sm text-text-secondary">校验问题</div>
          <div className="text-3xl font-bold text-text-primary mt-1">{issues.length}</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-card overflow-hidden h-[600px] border border-border-primary">
         <div className="p-4 border-b border-border-primary bg-gray-50 font-semibold text-text-primary">
            系统连接图
         </div>
         <WorkflowGraph workflow={project.workflow} />
      </div>

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="p-6 border-b border-border-primary flex items-center justify-between">
          <div className="font-semibold text-text-primary">模块列表</div>
        </div>
        {project.workflow.nodes.length === 0 ? (
          <div className="p-6 text-text-secondary text-sm">还没有工作流模块，可以去“编辑项目”开始拼接。</div>
        ) : (
          <ul className="divide-y divide-border-primary">
            {project.workflow.nodes.map((node) => {
              const moduleDef = MODULE_CATALOG.find((m) => m.id === node.moduleId);
              return (
                <li key={node.id} className="p-6 flex items-center justify-between">
                  <div>
                    <div className="text-text-primary font-medium">{node.label}</div>
                    <div className="text-sm text-text-secondary">{moduleDef?.name ?? node.moduleId}</div>
                  </div>
                  <span className="text-xs text-text-secondary">{moduleDef?.category ?? 'other'}</span>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="p-6 border-b border-border-primary flex items-center justify-between">
          <div className="font-semibold text-text-primary">校验结果</div>
        </div>
        {issues.length === 0 ? (
          <div className="p-6 text-sm text-success">暂无问题</div>
        ) : (
          <ul className="divide-y divide-border-primary">
            {issues.map((issue) => (
              <li key={issue.id} className="p-6 flex items-start space-x-3">
                <span
                  className={[
                    'mt-0.5 inline-flex items-center justify-center w-5 h-5 rounded-full text-xs text-white flex-shrink-0',
                    issue.severity === 'error' ? 'bg-danger' : issue.severity === 'warning' ? 'bg-warning' : 'bg-info',
                  ].join(' ')}
                >
                  {issue.severity === 'error' ? '!' : issue.severity === 'warning' ? '⚠' : 'i'}
                </span>
                <div className="text-sm text-text-primary">{issue.message}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

const ProjectDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId') ?? '';
  const [activeTab, setActiveTab] = useState<TabKey>('workflow');
  const [refreshToken, setRefreshToken] = useState(0);

  const project = useMemo(() => getProjectById(projectId), [projectId, refreshToken]);

  const handleDelete = () => {
    if (!project) {
      return;
    }
    if (!confirm('确定要删除这个项目吗？此操作不可撤销。')) {
      return;
    }
    deleteProject(project.id);
    navigate('/project-list');
  };

  const handleSetStatus = (nextStatus: Project['status']) => {
    if (!project) {
      return;
    }
    setProjectStatus(project.id, nextStatus);
    setRefreshToken((v) => v + 1);
  };

  return (
    <AppShell pageTitle="项目详情" breadcrumb={['工作台', '项目管理', '项目详情']}>
      {!project ? (
        <ProjectNotFound onBack={() => navigate('/project-list')} />
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-card p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="min-w-0">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-card rounded-xl flex items-center justify-center border border-border-primary">
                    <i className="fas fa-microchip text-primary text-xl"></i>
                  </div>
                  <div className="min-w-0">
                    <div className="text-2xl font-bold text-text-primary truncate">{project.name}</div>
                    <div className="text-sm text-text-secondary truncate">{project.description || '—'}</div>
                  </div>
                </div>
                <div className="mt-4 text-sm text-text-secondary">
                  创建：{formatDateTime(project.createdAtMs)} · 更新：{formatDateTime(project.updatedAtMs)}
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => navigate(`/project-create?projectId=${project.id}`)}
                  className="px-4 py-2 bg-white border border-border-primary rounded-lg font-medium text-text-primary hover:bg-bg-secondary transition-colors"
                >
                  <i className="fas fa-edit mr-2"></i>编辑项目
                </button>
                <button
                  type="button"
                  onClick={() => handleSetStatus('in_progress')}
                  className="px-4 py-2 bg-warning bg-opacity-10 text-warning border border-warning border-opacity-20 rounded-lg font-medium hover:bg-opacity-20 transition-colors"
                >
                  标记进行中
                </button>
                <button
                  type="button"
                  onClick={() => handleSetStatus('completed')}
                  className="px-4 py-2 bg-success bg-opacity-10 text-success border border-success border-opacity-20 rounded-lg font-medium hover:bg-opacity-20 transition-colors"
                >
                  标记已完成
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-4 py-2 bg-white border border-border-primary rounded-lg font-medium text-danger hover:bg-bg-secondary transition-colors"
                >
                  <i className="fas fa-trash mr-2"></i>删除
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <TabButton active={activeTab === 'workflow'} onClick={() => setActiveTab('workflow')}>
              模块工作流
            </TabButton>
            <TabButton active={activeTab === 'requirements'} onClick={() => setActiveTab('requirements')}>
              文本需求
            </TabButton>
            <TabButton active={activeTab === 'schemes'} onClick={() => setActiveTab('schemes')}>
              方案输出
            </TabButton>
          </div>

          {activeTab === 'workflow' && <WorkflowSummary project={project} />}

          {activeTab === 'requirements' && (
            <div className="bg-white rounded-2xl shadow-card p-6">
              <div className="font-semibold text-text-primary mb-3">需求描述</div>
              <pre className="whitespace-pre-wrap text-sm text-text-primary bg-bg-secondary rounded-lg p-4 border border-border-primary">
                {project.requirementsText || '—'}
              </pre>
            </div>
          )}

          {activeTab === 'schemes' && (
            <div className="bg-white rounded-2xl shadow-card p-6">
              <div className="font-semibold text-text-primary mb-2">方案输出</div>
              <div className="text-sm text-text-secondary">
                MVP 阶段先把“模块拼接 + 校验 + 作品化”跑通。下一步在这里接入 AI 方案生成、BOM/成本估算、导出文件等。
              </div>
            </div>
          )}
        </div>
      )}
    </AppShell>
  );
};

export default ProjectDetailPage;
