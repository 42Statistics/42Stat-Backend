export type Table = {
  targetValue: number;
  score: number;
}[];

const PROJECT_TRY_TABLE: Table = [
  { targetValue: 10, score: 1 },
  { targetValue: 15, score: 2 },
  { targetValue: 25, score: 3 },
  { targetValue: 35, score: 4 },
  { targetValue: 45, score: 5 },
  { targetValue: 55, score: 6 },
  { targetValue: 65, score: 7 },
];

const EXAM_TRY_TABLE: Table = [
  { targetValue: 4, score: 1 },
  { targetValue: 8, score: 2 },
  { targetValue: 10, score: 3 },
  { targetValue: 12, score: 4 },
  { targetValue: 20, score: 6 },
];

const EVAL_COUNT_TABLE: Table = [
  { targetValue: 20, score: 1 },
  { targetValue: 30, score: 2 },
  { targetValue: 40, score: 3 },
  { targetValue: 50, score: 4 },
  { targetValue: 60, score: 5 },
  { targetValue: 70, score: 6 },
  { targetValue: 80, score: 7 },
  { targetValue: 100, score: 8 },
  { targetValue: 200, score: 9 },
  { targetValue: 300, score: 10 },
];

const LOGTIME_TABLE: Table = [
  { targetValue: 10, score: 1 },
  { targetValue: 20, score: 3 },
  { targetValue: 30, score: 6 },
  { targetValue: 40, score: 9 },
];

const BONUS_TABLE: Table = [
  { targetValue: 5, score: 1 },
  { targetValue: 10, score: 2 },
  { targetValue: 15, score: 3 },
  { targetValue: 25, score: 4 },
  { targetValue: 35, score: 5 },
];

const PROJECT_ONE_SHOT_RATE_TABLE: Table = [
  { targetValue: 25, score: 1 },
  { targetValue: 50, score: 2 },
  { targetValue: 75, score: 3 },
  { targetValue: 100, score: 4 },
];

const PROJECT_ONE_SHOT_RATE_MULTIPLY_TABLE: Table = [
  { targetValue: 5, score: 1 },
  { targetValue: 7, score: 2 },
  { targetValue: 9, score: 3 },
  { targetValue: 100, score: 5 },
];

const EXAM_ONE_SHOT_RATE_TABLE: Table = [
  { targetValue: 50, score: 1 },
  { targetValue: 75, score: 2 },
  { targetValue: 100, score: 3 },
];

const EXAM_ONE_SHOT_RATE_MULTIPLY_TABLE: Table = [
  { targetValue: 1, score: 1 },
  { targetValue: 3, score: 2 },
  { targetValue: 5, score: 3 },
];

const OUTSTANDING_RATE_TABLE: Table = [
  { targetValue: 25, score: 1 },
  { targetValue: 35, score: 2 },
  { targetValue: 45, score: 3 },
  { targetValue: 55, score: 4 },
  { targetValue: 65, score: 5 },
  { targetValue: 75, score: 6 },
  { targetValue: 100, score: 8 },
];

const OUTSTANDING_RATE_MULTIPLY_TABLE: Table = [
  { targetValue: 5, score: 1 },
  { targetValue: 20, score: 2 },
  { targetValue: 55, score: 3 },
  { targetValue: 75, score: 4 },
];

const COMMON_CORE_DURATION_TABLE: Table = [
  { targetValue: 600, score: 1 },
  { targetValue: 500, score: 2 },
  { targetValue: 300, score: 3 },
  { targetValue: 150, score: 8 },
];

const TALENT_TABLE: Table = [
  { targetValue: 7, score: 1 },
  { targetValue: 12, score: 2 },
  { targetValue: 17, score: 3 },
  { targetValue: 21, score: 4 },
];

const EFFORT_TABLE: Table = [
  { targetValue: 11, score: 1 },
  { targetValue: 17, score: 2 },
  { targetValue: 21, score: 3 },
  { targetValue: 23, score: 4 },
];

export const SCORE_TABLE = {
  PROJECT_TRY: PROJECT_TRY_TABLE,
  EXAM_TRY: EXAM_TRY_TABLE,
  EVAL_COUNT: EVAL_COUNT_TABLE,
  LOGTIME: LOGTIME_TABLE,
  BONUS: BONUS_TABLE,
  PROJECT_ONE_SHOT_RATE: PROJECT_ONE_SHOT_RATE_TABLE,
  EXAM_ONE_SHOT_RATE: EXAM_ONE_SHOT_RATE_TABLE,
  OUTSTANDING_RATE: OUTSTANDING_RATE_TABLE,
  COMMON_CORE_DURATION: COMMON_CORE_DURATION_TABLE,
  TALENT: TALENT_TABLE,
  EFFORT: EFFORT_TABLE,
};

export const MULTIPLY_TABLE = {
  PROJECT_ONE_SHOT_RATE: PROJECT_ONE_SHOT_RATE_MULTIPLY_TABLE,
  EXAM_ONE_SHOT_RATE: EXAM_ONE_SHOT_RATE_MULTIPLY_TABLE,
  OUTSTANDING_RATE: OUTSTANDING_RATE_MULTIPLY_TABLE,
};
