interface NormalizedLibGeneratorSchema extends LibGeneratorSchema {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  rootOffset: string;
  workspaceName: string;
  workspaceRoot: string;
}

export interface LibGeneratorSchema {
  name: string;
  directory?: string;
}
