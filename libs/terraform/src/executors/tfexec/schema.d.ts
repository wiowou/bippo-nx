export interface TfexecExecutorSchema {
  cmd?: string;
  environment?: string;
  terraformRootPath: string;
  cwd?: string;
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
