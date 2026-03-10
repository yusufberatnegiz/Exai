export type Question = {
  id: string;
  question_text: string;
  question_type: string;
  choices: string[] | null;
  solution_text: string;
  topic: string;
  difficulty: string;
  index_in_set: number;
};

export type QuestionSet = {
  id: string;
  title: string;
  courseId: string;
  courseTitle: string;
};

export type WeakTopicResult = { error: string } | { questionSetId: string } | null;

export type GradeResult = {
  is_correct: boolean;
  score: number;
  feedback: string;
  gradingFailed?: boolean;
};
