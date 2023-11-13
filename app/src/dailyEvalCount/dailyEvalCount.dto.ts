export type FindEvalCountByDateInput = {
  start: Date;
  end: Date;
};

export type FindUserEvalCountByDateInput = FindEvalCountByDateInput & {
  userId: number;
};

export type FindEvalCountByDateOutput = {
  date: Date;
  count: number;
};
