import {
  CollectionLookup,
  lookupStage,
} from 'src/database/mongoose/database.mongoose.aggregation';

export const lookupQuestsUser: CollectionLookup = (
  localField,
  foreignField,
  pipeline,
) => lookupStage('quests_users', localField, foreignField, pipeline);
