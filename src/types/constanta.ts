export enum StatusBookEnum {
  AVAILABLE = "AVAILABLE",
  NOT_AVAILABLE = "NOT_AVAILABLE",
}

export enum StatusMemberEnum {
  SUSPEND = "SUSPEND",
  ACTIVE = "ACTIVE",
}

export enum LendingEnum {
  BORROW = "BORROW",
  RETURN = "RETURN",
  LATE = "LATE",
}

export enum DurationEnum {
  _3DAY = "3DAY",
  _1WEEK = "1WEEK",
  _2WEEK = "2WEEK",
  _1MONTH = "1MONTH",
}

export enum TierMemberEnum {
  NEW = "NEW",
  VERIFIED = "VERIFIED",
}

export const defaultLateFee = 5000;

export const cacheTime = 1000 * 60 * 5;

export enum RoleEnum {
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
  USER = "USER",
}
