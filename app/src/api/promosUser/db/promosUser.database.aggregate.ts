import {
  lookupStage,
  type CollectionLookup,
} from 'src/database/mongoose/database.mongoose.aggregation';
import { promos_user } from './promosUser.database.schema';

export const lookupPromosUsers: CollectionLookup = (
  localField,
  foreignField,
  pipeline,
) => lookupStage(`${promos_user.name}s`, localField, foreignField, pipeline);
