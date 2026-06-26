function getQuestionsList(triviaData) {
  const apiQuestions = triviaData?.results ?? [];
  const questions = [];

  for (let i = 0; i < apiQuestions.length; i++) {
    const item = apiQuestions[i];
    questions.push({
      question: item.question,
      answer: item.correct_answer,
      difficulty: item.difficulty,
      category: item.category,
    });
  }

  return questions;
}

function getDifficultyCounts(questions) {
  let easyCount = 0;
  let mediumCount = 0;
  let hardCount = 0;

  for (let i = 0; i < questions.length; i++) {
    const level = questions[i].difficulty;
    if (level === "easy") easyCount += 1;
    else if (level === "medium") mediumCount += 1;
    else if (level === "hard") hardCount += 1;
  }

  return [
    { difficulty: "easy", count: easyCount },
    { difficulty: "medium", count: mediumCount },
    { difficulty: "hard", count: hardCount },
  ];
}

export function triviaScorer(triviaData) {
  // Guard: if triviaData is null/undefined, return safe empty state
  if (!triviaData || !Array.isArray(triviaData.results)) {
    return {
      questions: [],
      difficultyCounts: [
        { difficulty: "easy", count: 0 },
        { difficulty: "medium", count: 0 },
        { difficulty: "hard", count: 0 },
      ],
    };
  }

  const questions = getQuestionsList(triviaData);
  const difficultyCounts = getDifficultyCounts(questions);

  return { questions, difficultyCounts };
}