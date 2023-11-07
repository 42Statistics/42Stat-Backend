import {
  lookupStage,
  type CollectionLookup,
} from 'src/database/mongoose/database.mongoose.aggregation';
import { events_users } from './eventsUser.database.schema';

export const lookupEventsUsers: CollectionLookup = (
  localField,
  foreignField,
  pipeline,
) => lookupStage(events_users.name, localField, foreignField, pipeline);
