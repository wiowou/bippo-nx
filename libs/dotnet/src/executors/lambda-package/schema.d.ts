export interface LambdaPackageExecutorSchema {
  dotnetRootPath: string;
  dotnetToolsPath: string;
  outputPath?: string;
  projectLocationPath?: string;
  packageType?: 'image' | 'zip';
  configurationType?: 'Release' | 'Debug';
  functionArchitecture?: 'Release' | 'Debug';
  fileReplacements?: FileReplacement[];
}

export interface NormalizedLambdaPackageExecutorSchema extends LambdaPackageExecutorSchema {
  root: string;
  sourceRoot: string;
}

export interface FileReplacement {
  replace: string;
  with: string;
}
