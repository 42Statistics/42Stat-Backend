import { Catch, HttpException, HttpStatus } from '@nestjs/common';
import type { GqlExceptionFilter } from '@nestjs/graphql';
import {
  GraphQLError,
  GraphQLErrorExtensions,
  GraphQLErrorOptions,
} from 'graphql';

@Catch(HttpException)
export class HttpExceptionFilter implements GqlExceptionFilter {
  catch(exception: HttpException) {
    const status = exception.getStatus();
    const response = exception.getResponse();

    const extentions: GraphQLErrorExtensions = {
      code:
        typeof response === 'object' && 'message' in response
          ? response.message
          : response,
      status,
      originalError: response,
    };

    const options: GraphQLErrorOptions = {
      extensions: extentions,
    };

    return new GraphQLError(`${options.extensions?.code}`, options);
  }
}
