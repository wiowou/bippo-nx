import type { GeneratorCallback, Tree } from '@nx/devkit';
import { addDependenciesToPackageJson } from '@nx/devkit';
import { bippoDotnetAwsServiceVersion, bippoTerraformVersion, tsLibVersion } from '../../utils';

export function addDependencies(tree: Tree): GeneratorCallback {
  return addDependenciesToPackageJson(
    tree,
    {
      tslib: tsLibVersion,
    },
    {
      '@bippo-nx/dotnet-aws-service': bippoDotnetAwsServiceVersion,
      '@bippo-nx/terraform': bippoTerraformVersion,
    }
  );
}
