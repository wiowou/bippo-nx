import type { GeneratorCallback, Tree } from '@nx/devkit';
import { addDependenciesToPackageJson } from '@nx/devkit';
import {
  bippoDotnetVersion,
  bippoDotnetAwsServiceVersion,
  bippoPythonAwsServiceVersion,
  bippoTerraformVersion,
  tsLibVersion,
  bippoUtilVersion,
} from '../../utils';

export function addDependencies(tree: Tree): GeneratorCallback {
  return addDependenciesToPackageJson(
    tree,
    {
      tslib: tsLibVersion,
    },
    {
      '@bippo-nx/dotnet': bippoDotnetVersion,
      '@bippo-nx/dotnet-aws-service': bippoDotnetAwsServiceVersion,
      '@bippo-nx/python-aws-service': bippoPythonAwsServiceVersion,
      '@bippo-nx/terraform': bippoTerraformVersion,
      '@bippo-nx/util': bippoUtilVersion,
    }
  );
}
