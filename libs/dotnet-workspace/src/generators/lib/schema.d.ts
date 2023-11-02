export interface LibGeneratorSchema {
  name: string;
  directory?: string;
}

interface NormalizedSchema extends LibGeneratorSchema {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  rootOffset: string;
  workspaceName: string;
}
