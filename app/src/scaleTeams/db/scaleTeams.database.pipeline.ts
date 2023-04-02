import { GetEvalInfoArgs } from 'src/personalEval/dto/getEvalInfo.args';

export const evalInfo = {
  any: ({ uid }: GetEvalInfoArgs) => ({
    $match: {
      $or: [{ 'corrector.id': uid }, { 'correcteds.id': uid }],
    },
  }),
  corrector: ({ uid, targetUserName }: GetEvalInfoArgs) => ({
    $match: {
      $and: [
        { 'corrector.id': uid },
        targetUserName ? { 'correcteds.login': targetUserName } : {},
      ],
    },
  }),
  corrected: ({ uid, targetUserName }: GetEvalInfoArgs) => ({
    $match: {
      $and: [
        { 'correcteds.id': uid },
        targetUserName ? { 'corrector.login': targetUserName } : {},
      ],
    },
  }),
};
