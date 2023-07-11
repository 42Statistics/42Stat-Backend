import type {
  ApolloServerPlugin,
  BaseContext,
  GraphQLRequestListener,
  GraphQLServerContext,
} from '@apollo/server';
import { Plugin } from '@nestjs/apollo';
import { GraphQLError, type GraphQLSchema } from 'graphql';
import {
  fieldExtensionsEstimator,
  getComplexity,
  simpleEstimator,
} from 'graphql-query-complexity';

const MAX_COMPLEXITY = 500;

@Plugin()
export class ComplexityPlugin implements ApolloServerPlugin {
  private schema: GraphQLSchema;

  async serverWillStart(service: GraphQLServerContext): Promise<void> {
    this.schema = service.schema;
  }

  async requestDidStart(): Promise<GraphQLRequestListener<BaseContext>> {
    const maxComplexity = MAX_COMPLEXITY;

    return {
      didResolveOperation: async ({ request, document }) => {
        const complexity = getComplexity({
          schema: this.schema,
          operationName: request.operationName,
          query: document,
          variables: request.variables,
          estimators: [
            fieldExtensionsEstimator(),
            simpleEstimator({ defaultComplexity: 1 }),
          ],
        });

        if (complexity > maxComplexity) {
          throw new GraphQLError(
            `Query is too complex: ${complexity}. Maximum allowed complexity: ${maxComplexity}`,
          );
        }
      },
    };
  }
}
