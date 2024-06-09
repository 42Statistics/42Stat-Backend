export type FindAllActiveUserCountByDateInput = {
  start: Date;
  end: Date;
};

export type FindAllActiveUserCountByDateOutput = {
  date: Date;
  count: number;
}[];
