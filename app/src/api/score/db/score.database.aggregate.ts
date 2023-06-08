import {
  CollectionLookup,
  lookupStage,
} from 'src/common/db/common.db.aggregation';

export const lookupScores: CollectionLookup = (
  localField,
  foreignField,
  pipeline,
) => lookupStage('scores', localField, foreignField, pipeline);
