import { getWorkspaceLayout, joinPathFragments, Tree } from '@nx/devkit';
import { NormalizedLambdaApiGeneratorSchema } from '../../lambda-api/schema';

export function updateIndex(tree: Tree, options: NormalizedLambdaApiGeneratorSchema): void {
  if (!options.directory) {
    return;
  }
  const parentDirectory = `${getWorkspaceLayout(tree).appsDir}/${options.directory}`;
  const filePath = joinPathFragments(parentDirectory, 'index.ts');
  try {
    const contents = tree.read(filePath).toString();
    const newContents = contents + '\n' + `import * as ${options.name} from './${options.name}';`;
    tree.write(filePath, newContents);
  } catch (error) {
    console.info(`Cannot find ${filePath}`);
  }
}
