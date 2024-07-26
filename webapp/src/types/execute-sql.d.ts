export interface QueryStats {
  state: State;
  queued: boolean;
  scheduled: boolean;
  nodes: number;
  totalSplits: number;
  queuedSplits: number;
  runningSplits: number;
  completedSplits: number;
  cpuTimeMillis: number;
  wallTimeMillis: number;
  queuedTimeMillis: number;
  elapsedTimeMillis: number;
  processedRows: number;
  processedBytes: number;
  physicalInputBytes: number;
  physicalWrittenBytes: number;
  peakMemoryBytes: number;
  spilledBytes: number;
  progressPercentage?: number;
  runningPercentage?: number;
  rootStage?: RootStage;
}

export interface RootStage {
  stageId: string;
  state: string;
  done: boolean;
  nodes: number;
  totalSplits: number;
  queuedSplits: number;
  runningSplits: number;
  completedSplits: number;
  cpuTimeMillis: number;
  wallTimeMillis: number;
  processedRows: number;
  processedBytes: number;
  physicalInputBytes: number;
  failedTasks: number;
  coordinatorOnly: boolean;
  subStages: any[];
}

export interface ErrorInfo {
  code: number;
  name: string;
  type: string;
}

export interface Cause {
  type: string;
  message: string;
  cause?: Cause;
  suppressed: any[];
  stack: string[];
  errorInfo: ErrorInfo;
}

export interface FailureInfo {
  type: string;
  message: string;
  cause: Cause;
  suppressed: Cause[];
  stack: string[];
  errorInfo: ErrorInfo;
}

export interface Error {
  message: string;
  errorCode: number;
  errorName: string;
  errorType: string;
  failureInfo: FailureInfo;
}

export interface Column {
  name: string;
  type: string;
  typeSignature: {
      rawType: string;
      arguments: any[];
  };
}

export interface QueryResponse {
  id: string;
  infoUri: string;
  nextUri?: string;
  partialCancelUri?: string;
  columns?: Column[];
  data?: any[][];
  stats: QueryStats;
  error?: Error;
  warnings: any[];
}

export interface DateResponse {
  id: string;
  infoUri: string;
  partialCancelUri?: string;
  columns?: Column[];
  data?: any[][];
  state: State;
  error?: Error;
  warnings: any[];
}

