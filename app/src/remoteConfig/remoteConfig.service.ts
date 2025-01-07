import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from '@aws-sdk/client-secrets-manager';
import { fromInstanceMetadata } from '@aws-sdk/credential-providers';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { CacheOnReturn } from 'src/cache/decrators/onReturn/cache.decorator.onReturn.symbol';
import { AWS_CONFIG } from 'src/config/aws';
import { DateWrapper } from 'src/dateWrapper/dateWrapper';

@Injectable()
export class RemoteConfigService {
  private readonly secretsManager: SecretsManagerClient;

  constructor(
    @Inject(AWS_CONFIG.KEY)
    private readonly awsConfig: ConfigType<typeof AWS_CONFIG>,
  ) {
    this.secretsManager = new SecretsManagerClient({
      region: this.awsConfig.REGION,
      credentials: fromInstanceMetadata({
        timeout: this.awsConfig.CREDENTIAL_TIMEOUT,
        maxRetries: this.awsConfig.CREDENTIAL_RETRY_COUNT,
      }),
    });
  }

  @CacheOnReturn(DateWrapper.MIN * 5)
  async fetchConfig(secretId: string): Promise<unknown> {
    const response = await this.secretsManager.send(
      new GetSecretValueCommand({
        SecretId: secretId,
      }),
    );

    if (!response.SecretString) {
      throw new InternalServerErrorException(
        'wrong aws secrets manager config',
      );
    }

    return JSON.parse(response.SecretString);
  }
}
