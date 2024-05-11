export interface LambdaPackageExecutorSchema {
  dotnetRootPath: string;
  dotnetToolsPath: string;
  outputPath?: string;
  configurationType?: 'Release' | 'Debug';
  functionArchitecture?: 'x86_64' | 'arm64';
  cwd?: string;
  fileReplacements?: FileReplacement[];
  emptyZip: boolean;
}

export interface NormalizedLambdaPackageExecutorSchema extends LambdaPackageExecutorSchema {
  root: string;
  sourceRoot: string;
}

export interface FileReplacement {
  replace: string;
  with: string;
}
