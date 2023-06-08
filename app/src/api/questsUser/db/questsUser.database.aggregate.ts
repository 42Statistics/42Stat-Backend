import {
  CollectionLookup,
  lookupStage,
} from 'src/common/db/common.db.aggregation';

export const lookupQuestsUser: CollectionLookup = (
  localField,
  foreignField,
  pipeline,
) => lookupStage('quests_users', localField, foreignField, pipeline);
