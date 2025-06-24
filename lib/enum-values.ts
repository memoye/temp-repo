export const CustomCaseFieldTypes = {
  Text: 1,
  Number: 2,
  Boolean: 3,
  SingleSelect: 4,
  MultiSelect: 5,
  Radio: 6,
  Link: 7,
  Date: 8,
} as const;

export const CaseStatuses = {
  Active: 1,
  Closed: 2,
} as const;

export const PermissionUserTypes = {
  SuperAdmin: 1,
  Admin: 2,
  Regular: 3,
} as const;
