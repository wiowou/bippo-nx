export interface TfexecExecutorSchema {
  terraformRootPath: string;
  cwd?: string;
  projectKey?: string;
  environment?: string;
  commands: string[];
  fileReplacements: FileReplacement[];
}

export interface NormalizedTfexecExecutorSchema extends TfexecExecutorSchema {
  root: string;
}

export interface FileReplacement {
  replace: string;
  with: string;
}
