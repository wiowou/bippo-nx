import type { GeneratorCallback, Tree } from '@nx/devkit';
import { addDependenciesToPackageJson } from '@nx/devkit';
import {
  awsLambdaTypesVersion,
  awsLambdaVersion,
  bippoAwsServiceVersion,
  bippoTerraformVersion,
  classTransformerVersion,
  classValidatorVersion,
  dynamodbVersion,
  eslintVersion,
  nestJsConfigVersion,
  nestJsSchematicsVersion,
  nestSwaggerVersion,
  nestJsVersion,
  nxVersion,
  reflectMetadataVersion,
  rxjsVersion,
  tsLibVersion,
  vendiaVersion,
  zipWebpackVersion,
} from '../../utils';

export function addDependencies(tree: Tree): GeneratorCallback {
  return addDependenciesToPackageJson(
    tree,
    {
      '@aws-sdk/lib-dynamodb': dynamodbVersion,
      '@nestjs/common': nestJsVersion,
      '@nestjs/config': nestJsConfigVersion,
      '@nestjs/core': nestJsVersion,
      '@nestjs/platform-express': nestJsVersion,
      '@vendia/serverless-express': vendiaVersion,
      'aws-lambda': awsLambdaVersion,
      'class-transformer': classTransformerVersion,
      'class-validator': classValidatorVersion,
      'reflect-metadata': reflectMetadataVersion,
      rxjs: rxjsVersion,
      tslib: tsLibVersion,
    },
    {
      '@bippo-nx/terraform': bippoTerraformVersion,
      '@bippo-nx/aws-service': bippoAwsServiceVersion,
      '@nestjs/schematics': nestJsSchematicsVersion,
      '@nestjs/swagger': nestSwaggerVersion,
      '@nestjs/testing': nestJsVersion,
      '@nx/eslint-plugin': nxVersion,
      '@nx/webpack': nxVersion,
      '@types/aws-lambda': awsLambdaTypesVersion,
      eslint: eslintVersion,
      'zip-webpack-plugin': zipWebpackVersion,
    }
  );
}
