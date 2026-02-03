import { Workflow } from './workflow';

export type ProjectStatus = 'draft' | 'generating' | 'in_progress' | 'completed' | 'archived';

export interface ProjectComponentRef {
  componentId: string;
  model: string;
  addedAtMs: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  requirementsText: string;
  coverImageDataUrl?: string;
  workflow: Workflow;
  components: ProjectComponentRef[];
  status: ProjectStatus;
  createdAtMs: number;
  updatedAtMs: number;
}

export interface ProjectCreateInput {
  name: string;
  description: string;
  requirementsText: string;
  coverImageDataUrl?: string;
  workflow: Workflow;
  components?: ProjectComponentRef[];
}
