export enum StoreKey {
  Access = "access-control",
  Config = "app-config",
  LeftTrees = "left-trees",
}

export enum Path {
  Base = "/",
  Dashboard = "/dashboard",
  Query = "/query",
  Setting = "/setting",
  SignIn = "/sign-in",
  SignUp = "/sign-up",
  ForgotPassword = "/forgot-password",
}

export enum Theme {
  System = "system",
  Dark = "dark",
  Light = "light",
}

export enum State {
  QUEUED = "QUEUED",
  FAILED = "FAILED",
  RUNNING = "RUNNING",
  FINISHED = "FINISHED",
}
