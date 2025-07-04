import { api } from "@/lib/api";

import type { Country, LookupItem, PaginatedRequestParams } from "@/types/common";
import type {
  Firm,
  InviteUserValues,
  OnboardFirmValues,
  OnboardInvitedUserValues,
  User,
  VerifyUserFormValues,
} from "@/types/connect";

const config = { service: "connect", requireAuth: true } as const;

class ConnectService {
  // Main
  async onboardFirm(data: OnboardFirmValues) {
    console.log(config.service, "dddjskdsk");
    return api.post<{ userId: string; emailLink: string }>("/onboarding/onboard-firm", data, {
      ...config,
      requireAuth: false,
    });
  }

  async verifyUser(data: VerifyUserFormValues) {
    return api.post<Country[]>("/onboarding/verify-user", data, {
      ...config,
      requireAuth: false,
    });
  }

  async resendVerificationEmail(data: { email: string }) {
    return api.post("/onboarding/resend-email-link", data, {
      ...config,
      requireAuth: false,
    });
  }

  async onboardInvitedUser(data: OnboardInvitedUserValues) {
    return api.post("/onboarding/complete-user-invitation", data, {
      ...config,
      requireAuth: false,
    });
  }

  async getFirmDetails() {
    return api.post<Firm>("/law-firm/details", { ...config });
  }

  readonly users = {
    getAll: (params?: Partial<PaginatedRequestParams>) =>
      api.get<User[]>("/users", { ...config, params }),

    generateInviteLink: () =>
      api.post<User[]>("/users/generate-invite-link", {}, { ...config }),

    invite: (data: InviteUserValues) =>
      api.post<User[]>("/users/invite-user", data, { ...config }),

    resendInvite: (data: { email: string }) =>
      api.post<User[]>("/users/resend-invite-link", data, { ...config }),
  };

  readonly lookups = {
    getCountries: () =>
      api.get<Country[]>("/lookup/get-countries", { ...config, requireAuth: false }),

    getStates: (country: Country["code"]) =>
      api.get<LookupItem[]>(`/lookup/${country}/get-states`, {
        ...config,
        requireAuth: false,
      }),

    getCities: (state: LookupItem["id"]) =>
      api.get<LookupItem[]>(`/lookup/${state}/get-cities`, {
        ...config,
        requireAuth: false,
      }),

    getPracticeAreas: () =>
      api.get<LookupItem[]>("/lookup/get-practice-areas", {
        ...config,
        requireAuth: false,
      }),

    getFirmSizes: () =>
      api.get<LookupItem[]>("/lookup/get-firm-sizes", { ...config, requireAuth: false }),
  };
}
export const Connect = new ConnectService();
