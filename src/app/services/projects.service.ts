import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { ProjectPostBody, Project, ProjectPatchBody, ProjectSearchCriteria } from '../../model/Project';
import { Page } from 'src/model/util/Page';
import { TranslationPutBody, Translation, TranslationPatchBody, TranslationPostBody } from '../../model/Translation';
import { toQueryParams } from 'src/model/helpers';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  constructor(
    private api: ApiService,
  ) { }

  async getProjects(search: ProjectSearchCriteria) {
    const params = toQueryParams(search);
    const result = await this.api.get(`projects?${params.join('&')}`);
    return new Page<Project>(result, Project);
  }

  async getProject(name: string) {
    const result = await this.api.get(`projects/${name}`);
    return Project.deserialize(result);
  }

  async createProject(p: ProjectPostBody): Promise<Project> {
    const result = await this.api.post('projects', p);
    return Project.deserialize(result);
  }

  async updateProject(p: ProjectPatchBody): Promise<Project> {
    const result = await this.api.patch('projects', p);
    return Project.deserialize(result);
  }

  async deleteProject(p: Project): Promise<Project> {
    const result = await this.api.delete(`projects/${p.id}`);
    return Project.deserialize(result);
  }

  async createTranslation(t: TranslationPostBody): Promise<Translation> {
    const result = await this.api.post('translations', t);
    return Translation.deserialize(result);
  }

  async updateTranslation(data: TranslationPatchBody) {
    const result = await this.api.patch('translations', data);
    return Translation.deserialize(result);
  }

  async replaceTranslation(data: TranslationPutBody) {
    const result = await this.api.put('translations', data);
    return Translation.deserialize(result);
  }

  async deleteTranslation(t: Translation): Promise<Translation> {
    const result = await this.api.delete(`translations/${t.id}`);
    return Translation.deserialize(result);
  }
}
