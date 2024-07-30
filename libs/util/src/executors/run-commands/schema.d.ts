export interface RunCommandsExecutorSchema {
  commands: [];
  cwd?: string;
  fileReplacements: FileReplacement[];
  copyInputFromPath?: string;
  copyOutputToPath?: string;
}

export interface FileReplacement {
  replace: string;
  with: string;
}

export interface NormalizedRunCommandsExecutorSchema extends RunCommandsExecutorSchema {
  root: string;
  sourceRoot: string;
}
