export type ActiveUserCount = {
  date: Date;
  count: number;
};

export type GetAllActiveUserCountByDateInput = {
  start: Date;
  end: Date;
};
