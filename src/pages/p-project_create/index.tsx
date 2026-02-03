

import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AppShell from '../../components/AppShell';
import { MODULE_CATALOG } from '../../domain/moduleCatalog';
import {
  Workflow,
  WorkflowConnection,
  WorkflowNode,
  createEmptyWorkflow,
  createId,
  getModuleById,
  validateWorkflow,
} from '../../domain/workflow';
import WorkflowGraph from '../../components/WorkflowGraph';
import { getProjectById, setProjectStatus, upsertProjectFromCreateInput } from '../../lib/projectsStore';
import styles from './styles.module.css';

interface ProjectFormData {
  projectName: string;
  projectDescription: string;
  textRequirements: string;
}

const ProjectCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectIdFromQuery = searchParams.get('projectId') ?? undefined;
  const [formData, setFormData] = useState<ProjectFormData>({
    projectName: '',
    projectDescription: '',
    textRequirements: ''
  });
  const [coverImageDataUrl, setCoverImageDataUrl] = useState<string | undefined>(undefined);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [workflow, setWorkflow] = useState<Workflow>(() => createEmptyWorkflow());
  const [moduleToAdd, setModuleToAdd] = useState<string>(MODULE_CATALOG[0]?.id ?? '');
  const [pendingConnection, setPendingConnection] = useState<{
    fromNodeId: string;
    fromPortId: string;
    toNodeId: string;
    toPortId: string;
  }>({ fromNodeId: '', fromPortId: '', toNodeId: '', toPortId: '' });

  // 校验当前正在选择的连接是否有效
  const pendingConnectionIssues = useMemo(() => {
    if (!pendingConnection.fromNodeId || !pendingConnection.fromPortId || !pendingConnection.toNodeId || !pendingConnection.toPortId) {
      return [];
    }
    // 构造一个临时的连接对象进行校验
    const tempConnection: WorkflowConnection = {
      id: 'temp',
      from: { nodeId: pendingConnection.fromNodeId, portId: pendingConnection.fromPortId },
      to: { nodeId: pendingConnection.toNodeId, portId: pendingConnection.toPortId },
    };
    // 这里我们复用 validateWorkflow，但只针对这个临时连接
    // 更好的做法是将 validateWorkflow 中的单条连接校验逻辑抽取出来，这里为了 MVP 简单起见，我们直接构造一个包含该连接的临时 workflow
    const tempWorkflow: Workflow = {
      nodes: workflow.nodes,
      connections: [tempConnection]
    };
    const issues = validateWorkflow(tempWorkflow, MODULE_CATALOG);
    return issues.filter(i => i.connectionId === 'temp');
  }, [pendingConnection, workflow.nodes]);

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '创建新项目 - PCBTool.AI';
    return () => { document.title = originalTitle; };
  }, []);

  // 检查是否为编辑模式并加载数据
  useEffect(() => {
    if (!projectIdFromQuery) {
      setIsEditMode(false);
      return;
    }
    const project = getProjectById(projectIdFromQuery);
    if (!project) {
      setIsEditMode(false);
      return;
    }
    setIsEditMode(true);
    setFormData({
      projectName: project.name,
      projectDescription: project.description,
      textRequirements: project.requirementsText,
    });
    setCoverImageDataUrl(project.coverImageDataUrl);
    setWorkflow(project.workflow);
  }, [projectIdFromQuery]);

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

  const handleFileUpload = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      alert('文件大小不能超过5MB');
      return;
    }

    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result ?? ''));
      reader.onerror = () => reject(new Error('读取文件失败'));
      reader.readAsDataURL(file);
    });
    setCoverImageDataUrl(dataUrl);
  };

  const handleUploadAreaClick = () => {
    if (!coverImageDataUrl && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleFileUpload(file);
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

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      await handleFileUpload(file);
    }
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCoverImageDataUrl(undefined);
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

    const project = upsertProjectFromCreateInput(
      {
        name: formData.projectName,
        description: formData.projectDescription,
        requirementsText: formData.textRequirements,
        coverImageDataUrl,
        workflow,
      },
      projectIdFromQuery,
    );
    setProjectStatus(project.id, 'draft');

    await new Promise((resolve) => setTimeout(resolve, 300));
    setIsSavingDraft(false);
    alert('草稿保存成功！');
  };

  const handleStartGenerate = () => {
    if (!validateForm()) return;

    const project = upsertProjectFromCreateInput(
      {
        name: formData.projectName,
        description: formData.projectDescription,
        requirementsText: formData.textRequirements,
        coverImageDataUrl,
        workflow,
      },
      projectIdFromQuery,
    );
    setProjectStatus(project.id, 'generating');
    navigate(`/project-detail?projectId=${project.id}&action=generate`);
  };

  const workflowIssues = useMemo(() => validateWorkflow(workflow, MODULE_CATALOG), [workflow]);
  const hasWorkflowErrors = workflowIssues.some((i) => i.severity === 'error');

  return (
    <AppShell
      pageTitle={isEditMode ? '编辑项目' : '创建新项目'}
      breadcrumb={['工作台', '项目管理', isEditMode ? '编辑项目' : '创建新项目']}
    >
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
                {!coverImageDataUrl ? (
                  <div>
                    <i className="fas fa-cloud-upload-alt text-4xl text-text-secondary mb-4"></i>
                    <p className="text-text-primary font-medium mb-2">点击上传或拖拽图像到此处</p>
                    <p className="text-text-secondary text-sm">支持JPG、PNG格式，最大5MB</p>
                    <p className="text-text-secondary text-xs mt-2">可上传电路草图、参考设计图等</p>
                  </div>
                ) : (
                  <div>
                    <img src={coverImageDataUrl} alt="预览图" className="max-w-full max-h-48 mx-auto rounded-lg" />
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

          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-text-primary border-b border-border-primary pb-3">
                模块拼接工作流 <span className="text-text-secondary text-sm font-normal">(可选)</span>
            </h3>

            {/* 可视化预览图 */}
            <div className="border border-border-primary rounded-lg overflow-hidden h-[500px] bg-gray-50">
               {workflow.nodes.length > 0 ? (
                 <WorkflowGraph workflow={workflow} />
               ) : (
                 <div className="h-full flex flex-col items-center justify-center text-text-secondary">
                   <i className="fas fa-project-diagram text-4xl mb-4 opacity-30"></i>
                   <p>添加模块后此处将显示连接图</p>
                 </div>
               )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-text-primary">添加模块</label>
                  <div className="flex space-x-2">
                    <select
                      value={moduleToAdd}
                      onChange={(e) => setModuleToAdd(e.target.value)}
                      className="flex-1 px-3 py-2 border border-border-primary rounded-lg bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-30"
                    >
                      {MODULE_CATALOG.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => {
                        const moduleDefinition = getModuleById(MODULE_CATALOG, moduleToAdd);
                        if (!moduleDefinition) {
                          return;
                        }
                        setWorkflow((prev) => {
                          const nextIndex =
                              prev.nodes.filter((n) => n.moduleId === moduleDefinition.id).length + 1;
                          const node: WorkflowNode = {
                            id: createId('node'),
                            moduleId: moduleDefinition.id,
                            label: `${moduleDefinition.name} #${nextIndex}`,
                          };
                          return { ...prev, nodes: [...prev.nodes, node] };
                        });
                      }}
                      className="px-4 py-2 bg-gradient-primary text-white rounded-lg font-medium hover:shadow-glow transition-all duration-300"
                    >
                      <i className="fas fa-plus mr-2"></i>添加
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-text-primary">已添加模块</span>
                    <span className="text-xs text-text-secondary">{workflow.nodes.length} 个</span>
                  </div>
                  <div className="border border-border-primary rounded-lg overflow-hidden">
                    {workflow.nodes.length === 0 ? (
                      <div className="p-4 text-sm text-text-secondary">还没有模块，先从上方添加。</div>
                    ) : (
                      <ul className="divide-y divide-border-primary">
                        {workflow.nodes.map((node) => {
                          const moduleDefinition = getModuleById(MODULE_CATALOG, node.moduleId);
                          return (
                            <li key={node.id} className="p-3 flex items-center justify-between">
                              <div className="min-w-0">
                                <div className="text-sm font-medium text-text-primary truncate">{node.label}</div>
                                <div className="text-xs text-text-secondary truncate">{moduleDefinition?.category ?? ''}</div>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setWorkflow((prev) => ({
                                    nodes: prev.nodes.filter((n) => n.id !== node.id),
                                    connections: prev.connections.filter(
                                      (c) => c.from.nodeId !== node.id && c.to.nodeId !== node.id,
                                    ),
                                  }));
                                  setPendingConnection({ fromNodeId: '', fromPortId: '', toNodeId: '', toPortId: '' });
                                }}
                                className="p-2 text-text-secondary hover:text-danger transition-colors"
                                aria-label="移除模块"
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-text-primary">添加连接</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <div className="text-xs text-text-secondary">来源</div>
                      <select
                        value={pendingConnection.fromNodeId}
                        onChange={(e) =>
                          setPendingConnection((prev) => ({
                            ...prev,
                            fromNodeId: e.target.value,
                            fromPortId: '',
                          }))
                        }
                        className="w-full px-3 py-2 border border-border-primary rounded-lg bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-30"
                      >
                        <option value="">选择模块</option>
                        {workflow.nodes.map((n) => (
                          <option key={n.id} value={n.id}>
                            {n.label}
                          </option>
                        ))}
                      </select>
                      <select
                        value={pendingConnection.fromPortId}
                        onChange={(e) => setPendingConnection((prev) => ({ ...prev, fromPortId: e.target.value }))}
                        className="w-full px-3 py-2 border border-border-primary rounded-lg bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-30"
                        disabled={!pendingConnection.fromNodeId}
                      >
                        <option value="">选择端口</option>
                        {(() => {
                          const node = workflow.nodes.find((n) => n.id === pendingConnection.fromNodeId);
                          const moduleDefinition = node ? getModuleById(MODULE_CATALOG, node.moduleId) : undefined;
                          return (moduleDefinition?.ports ?? []).map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name}
                            </option>
                          ));
                        })()}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <div className="text-xs text-text-secondary">目标</div>
                      <select
                        value={pendingConnection.toNodeId}
                        onChange={(e) =>
                          setPendingConnection((prev) => ({
                            ...prev,
                            toNodeId: e.target.value,
                            toPortId: '',
                          }))
                        }
                        className="w-full px-3 py-2 border border-border-primary rounded-lg bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-30"
                      >
                        <option value="">选择模块</option>
                        {workflow.nodes.map((n) => (
                          <option key={n.id} value={n.id}>
                            {n.label}
                          </option>
                        ))}
                      </select>
                      <select
                        value={pendingConnection.toPortId}
                        onChange={(e) => setPendingConnection((prev) => ({ ...prev, toPortId: e.target.value }))}
                        className="w-full px-3 py-2 border border-border-primary rounded-lg bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-30"
                        disabled={!pendingConnection.toNodeId}
                      >
                        <option value="">选择端口</option>
                        {(() => {
                          const node = workflow.nodes.find((n) => n.id === pendingConnection.toNodeId);
                          const moduleDefinition = node ? getModuleById(MODULE_CATALOG, node.moduleId) : undefined;
                          return (moduleDefinition?.ports ?? []).map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name}
                            </option>
                          ));
                        })()}
                      </select>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-text-secondary">
                        {pendingConnectionIssues.length > 0 ? (
                          <span className="text-danger">
                            <i className="fas fa-exclamation-circle mr-1"></i>
                            {pendingConnectionIssues[0].message}
                          </span>
                        ) : (
                          <span>支持电源/总线类型匹配与基础风险提示。</span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const { fromNodeId, fromPortId, toNodeId, toPortId } = pendingConnection;
                          if (!fromNodeId || !fromPortId || !toNodeId || !toPortId) {
                            return;
                          }
                          const connection: WorkflowConnection = {
                            id: createId('conn'),
                            from: { nodeId: fromNodeId, portId: fromPortId },
                            to: { nodeId: toNodeId, portId: toPortId },
                          };
                          setWorkflow((prev) => ({ ...prev, connections: [...prev.connections, connection] }));
                          setPendingConnection({ fromNodeId: '', fromPortId: '', toNodeId: '', toPortId: '' });
                        }}
                        className={`px-4 py-2 border border-border-primary rounded-lg font-medium transition-colors ${
                          pendingConnectionIssues.some(i => i.severity === 'error') 
                            ? 'bg-bg-secondary text-text-secondary cursor-not-allowed opacity-50' 
                            : 'bg-white text-text-primary hover:bg-bg-secondary'
                        }`}
                        disabled={
                          !pendingConnection.fromNodeId ||
                            !pendingConnection.fromPortId ||
                            !pendingConnection.toNodeId ||
                            !pendingConnection.toPortId ||
                            pendingConnectionIssues.some(i => i.severity === 'error')
                        }
                      >
                        <i className="fas fa-link mr-2"></i>添加连接
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-text-primary">连接列表</span>
                    <span className="text-xs text-text-secondary">{workflow.connections.length} 条</span>
                  </div>
                  <div className="border border-border-primary rounded-lg overflow-hidden">
                    {workflow.connections.length === 0 ? (
                      <div className="p-4 text-sm text-text-secondary">还没有连接，先从上方添加。</div>
                    ) : (
                      <ul className="divide-y divide-border-primary">
                        {workflow.connections.map((c) => (
                          <li key={c.id} className="p-3 flex items-center justify-between">
                            <div className="text-sm text-text-primary">
                              {c.from.nodeId.slice(0, 6)}:{c.from.portId} → {c.to.nodeId.slice(0, 6)}:{c.to.portId}
                            </div>
                            <button
                              type="button"
                              onClick={() => setWorkflow((prev) => ({ ...prev, connections: prev.connections.filter((x) => x.id !== c.id) }))}
                              className="p-2 text-text-secondary hover:text-danger transition-colors"
                              aria-label="移除连接"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-text-primary">校验结果</span>
                    <span className="text-xs text-text-secondary">{workflowIssues.length} 条</span>
                  </div>
                  <div className="border border-border-primary rounded-lg overflow-hidden">
                    {workflowIssues.length === 0 ? (
                      <div className="p-4 text-sm text-success">暂无问题</div>
                    ) : (
                      <ul className="divide-y divide-border-primary">
                        {workflowIssues.map((issue) => (
                          <li key={issue.id} className="p-3 flex items-start space-x-3">
                            <span
                              className={[
                                'mt-0.5 inline-flex items-center justify-center w-5 h-5 rounded-full text-xs text-white flex-shrink-0',
                                issue.severity === 'error' ? 'bg-danger' : issue.severity === 'warning' ? 'bg-warning' : 'bg-info',
                              ].join(' ')}
                            >
                              {issue.severity === 'error' ? '!' : issue.severity === 'warning' ? '⚠' : 'i'}
                            </span>
                            <div className="text-sm text-text-primary">{issue.message}</div>
                            {issue.id === 'i2c-pullup-missing' && (
                              <button
                                type="button"
                                onClick={() => {
                                  const moduleDefinition = getModuleById(MODULE_CATALOG, 'glue_i2c_pullup');
                                  if (!moduleDefinition) {
                                    return;
                                  }
                                  setWorkflow((prev) => {
                                    const nextIndex =
                                        prev.nodes.filter((n) => n.moduleId === moduleDefinition.id).length + 1;
                                    const node: WorkflowNode = {
                                      id: createId('node'),
                                      moduleId: moduleDefinition.id,
                                      label: `${moduleDefinition.name} #${nextIndex}`,
                                    };
                                    return { ...prev, nodes: [...prev.nodes, node] };
                                  });
                                }}
                                className="ml-auto px-3 py-1 bg-bg-secondary text-text-primary border border-border-primary rounded-lg text-xs hover:bg-white transition-colors"
                              >
                                  一键添加
                              </button>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
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
              className={`px-8 py-3 ${styles.btnPrimary} text-white rounded-lg font-medium ${hasWorkflowErrors ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={hasWorkflowErrors}
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
    </AppShell>
  );
};

export default ProjectCreatePage;
