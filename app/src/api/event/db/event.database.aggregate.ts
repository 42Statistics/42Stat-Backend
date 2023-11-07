import {
  lookupStage,
  type CollectionLookup,
} from 'src/database/mongoose/database.mongoose.aggregation';
import { events } from './event.database.schema';

export const lookupEvents: CollectionLookup = (
  localField,
  foreignField,
  pipeline,
) => lookupStage(events.name, localField, foreignField, pipeline);
