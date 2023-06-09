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
  nestJsConfigVersion,
  nestJsSchematicsVersion,
  nestSwaggerVersion,
  nestJsVersion,
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
      '@types/aws-lambda': awsLambdaTypesVersion,
      'zip-webpack-plugin': zipWebpackVersion,
    }
  );
}
