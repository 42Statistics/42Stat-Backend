import {
  lookupStage,
  type CollectionLookup,
} from 'src/database/mongoose/database.mongoose.aggregation';
import { promo } from './promo.database.schema';

export const lookupPromos: CollectionLookup = (
  localField,
  foreignField,
  pipeline,
) => lookupStage(`${promo.name}s`, localField, foreignField, pipeline);
