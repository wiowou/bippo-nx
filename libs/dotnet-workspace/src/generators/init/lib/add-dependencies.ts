import type { GeneratorCallback, Tree } from '@nx/devkit';
import { addDependenciesToPackageJson } from '@nx/devkit';
import { bippoDotnetVersion, bippoDotnetAwsServiceVersion, bippoTerraformVersion, tsLibVersion } from '../../utils';

export function addDependencies(tree: Tree): GeneratorCallback {
  return addDependenciesToPackageJson(
    tree,
    {
      tslib: tsLibVersion,
    },
    {
      '@bippo-nx/dotnet': bippoDotnetVersion,
      '@bippo-nx/dotnet-aws-service': bippoDotnetAwsServiceVersion,
      '@bippo-nx/terraform': bippoTerraformVersion,
    }
  );
}
