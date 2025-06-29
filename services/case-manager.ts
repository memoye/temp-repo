import { api } from "@/lib/api";
import type { Task, TaskCommentValues, TaskStatus, TaskValues } from "@/types/tasks";
import type { LookupItem, PaginatedRequestParams } from "@/types/common";
import type {
  Case,
  CaseFormValues,
  CaseItem,
  CaseLookups,
  CaseNote,
  CaseNoteValues,
  CustomCaseFieldLookupItem,
} from "@/types/cases";

export class CasesService {
  private readonly config = { service: "cases", requireAuth: true } as const;

  // Main operations
  async getAll(params?: Partial<PaginatedRequestParams>) {
    return api.get<CaseItem[]>("/", {
      ...this.config,
      params,
    });
  }

  async getById(id: Case["id"]) {
    return api.get<Case>(`/${id}`, { ...this.config });
  }

  async create(data: CaseFormValues) {
    return api.post("/", data, { ...this.config });
  }

  async update(data: CaseFormValues) {
    return api.post("/update", data, { ...this.config });
  }

  readonly notes = {
    getAll: (
      id: Case["id"],
      params?: Partial<PaginatedRequestParams & { CaseNumber: string }>,
    ) => api.get<CaseNote[]>(`/${id}/notes`, { ...this.config, params }),

    getById: (caseId: Case["id"], noteId: CaseNote["id"]) =>
      api.get<CaseNote>(`/${caseId}/notes/${noteId}`, {
        ...this.config,
      }),

    create: (caseId: Case["id"], data: CaseNoteValues) =>
      api.post(`/${caseId}/notes`, data, { ...this.config }),

    update: (caseId: Case["id"], data: CaseNoteValues & { id: CaseNote["id"] }) =>
      api.post(`/${caseId}/notes/update`, data, { ...this.config }),
  };

  readonly tasks = {
    getAll: (params?: Partial<PaginatedRequestParams & { CaseNumber: Case["id"] }>) =>
      api.get<Task[]>("/tasks", { ...this.config, params }),

    getById: (taskId: Task["id"], caseId?: Case["id"]) =>
      api.get<Task>(caseId ? `/tasks/${caseId}/${taskId}` : `/tasks/${taskId}`, {
        ...this.config,
      }),

    create: (data: TaskValues) => api.post<Task>("/tasks", data, { ...this.config }),

    createComment: (data: TaskCommentValues) =>
      api.post<Task>(
        "/tasks/add-comment",
        { Id: data.id, Comment: data.comment },
        { ...this.config },
      ),

    update: (data: TaskValues & { id: Task["id"] }) =>
      api.post<boolean>("/tasks/update", data, { ...this.config }),

    updateStatus: (data: { id: Task["id"]; status: TaskStatus }) =>
      api.post<boolean>("/tasks/update-status", data, { ...this.config }),
  };

  readonly lookups = {
    getStatuses: () => api.get<CaseLookups>("/lookups/statuses", { ...this.config }),

    getDocumentCategories: () =>
      api.get<LookupItem[]>("/lookups/document-categories", {
        ...this.config,
      }),

    getLocations: () => api.get<LookupItem[]>("/lookups/locations", { ...this.config }),

    getCourts: (id?: string) =>
      api.get<LookupItem[]>(`/lookups/${id}/courts`, { ...this.config }),

    getCustomFields: () =>
      api.get<CustomCaseFieldLookupItem[]>("/lookups/custom-fields", {
        ...this.config,
      }),
  };
}
export const CasesManager = new CasesService();
