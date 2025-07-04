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

const config = { service: "cases", requireAuth: true } as const;

class CasesService {
  // Main operations
  async getAll(params?: Partial<PaginatedRequestParams>) {
    return api.get<CaseItem[]>("/", {
      ...config,
      params,
    });
  }

  async getById(id: Case["id"]) {
    return api.get<Case>(`/${id}`, { ...config });
  }

  async create(data: CaseFormValues) {
    return api.post("/", data, { ...config });
  }

  async update(data: CaseFormValues) {
    return api.post("/update", data, { ...config });
  }

  readonly notes = {
    getAll: (
      id: Case["id"],
      params?: Partial<PaginatedRequestParams & { CaseNumber: string }>,
    ) => api.get<CaseNote[]>(`/${id}/notes`, { ...config, params }),

    getById: (caseId: Case["id"], noteId: CaseNote["id"]) =>
      api.get<CaseNote>(`/${caseId}/notes/${noteId}`, {
        ...config,
      }),

    create: (caseId: Case["id"], data: CaseNoteValues) =>
      api.post(`/${caseId}/notes`, data, { ...config }),

    update: (caseId: Case["id"], data: CaseNoteValues & { id: CaseNote["id"] }) =>
      api.post(`/${caseId}/notes/update`, data, { ...config }),
  };

  readonly tasks = {
    getAll: (params?: Partial<PaginatedRequestParams & { CaseNumber: Case["id"] }>) =>
      api.get<Task[]>("/tasks", { ...config, params }),

    getById: (taskId: Task["id"], caseId?: Case["id"]) =>
      api.get<Task>(caseId ? `/tasks/${caseId}/${taskId}` : `/tasks/${taskId}`, {
        ...config,
      }),

    create: (data: TaskValues) => api.post<Task>("/tasks", data, { ...config }),

    createComment: (data: TaskCommentValues) =>
      api.post<Task>(
        "/tasks/add-comment",
        { Id: data.id, Comment: data.comment },
        { ...config },
      ),

    update: (data: TaskValues & { id: Task["id"] }) =>
      api.post<boolean>("/tasks/update", data, { ...config }),

    updateStatus: (data: { id: Task["id"]; status: TaskStatus }) =>
      api.post<boolean>("/tasks/update-status", data, { ...config }),
  };

  readonly lookups = {
    getStatuses: () => api.get<CaseLookups>("/lookups/statuses", { ...config }),

    getDocumentCategories: () =>
      api.get<LookupItem[]>("/lookups/document-categories", {
        ...config,
      }),

    getLocations: () => api.get<LookupItem[]>("/lookups/locations", { ...config }),

    getCourts: (id?: string) => api.get<LookupItem[]>(`/lookups/${id}/courts`, { ...config }),

    getCustomFields: () =>
      api.get<CustomCaseFieldLookupItem[]>("/lookups/custom-fields", {
        ...config,
      }),
  };
}
export const CasesManager = new CasesService();
