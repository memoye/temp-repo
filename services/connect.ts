import { api } from "@/lib/api";

import type { Country, LookupItem, PaginatedRequestParams } from "@/types/common";
import type {
  Firm,
  InviteUserValues,
  OnboardFirmValues,
  OnboardInvitedUserValues,
  User,
} from "@/types/connect";

export class ConnectService {
  private readonly config = { service: "connect", requireAuth: false } as const;

  // Main
  async onboardFirm(data: OnboardFirmValues) {
    return api.post<{ userId: string; emailLink: string }>("/onboarding/onboard-firm", data, {
      ...this.config,
    });
  }

  async verifyUser(data: OnboardFirmValues) {
    return api.post<Country[]>("/onboarding/verify-user", data, { ...this.config });
  }

  async resendVerificationEmail(data: { email: string }) {
    return api.post("/onboarding/resend-email-link", data, { ...this.config });
  }

  async onboardInvitedUser(data: OnboardInvitedUserValues) {
    return api.post("/onboarding/complete-user-invitation", data, { ...this.config });
  }

  async getFirmDetails() {
    return api.post<Firm>("/law-firm/details", { ...this.config });
  }

  readonly users = {
    getAll: (params?: Partial<PaginatedRequestParams>) =>
      api.get<User[]>("/users", { ...this.config, params }),

    generateInviteLink: () =>
      api.post<User[]>("/users/generate-invite-link", {}, { ...this.config }),

    invite: (data: InviteUserValues) =>
      api.post<User[]>("/users/invite-user", data, { ...this.config }),

    resendInvite: (data: { email: string }) =>
      api.post<User[]>("/users/resend-invite-link", data, { ...this.config }),
  };

  readonly lookups = {
    getCountries: () => api.get<Country[]>("/lookup/get-countries", { ...this.config }),

    getStates: (country: Country["code"]) =>
      api.get<LookupItem[]>(`/lookup/${country}/get-states`, { ...this.config }),

    getCities: (state: LookupItem["id"]) =>
      api.get<LookupItem[]>(`/lookup/${state}/get-cities`, { ...this.config }),

    getPracticeAreas: () =>
      api.get<LookupItem[]>("/lookup/get-practice-areas", { ...this.config }),

    getFirmSizes: () => api.get<LookupItem[]>("/lookup/get-firm-sizes", { ...this.config }),
  };
}
export const connect = new ConnectService();
