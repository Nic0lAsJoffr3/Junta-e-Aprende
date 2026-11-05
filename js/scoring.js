const TOTAL_GAME_POINTS = 20000;
const SECONDS_PENALTY = 10;
const MIN_POINTS_PER_CORRECT = 100;

let scoringStartedAt = null;
let currentQuestionStartedAt = null;
let scoringCorrectAnswers = 0;
let scoringTotalQuestions = 0;

function startScoring(totalQuestions) {
  scoringTotalQuestions = totalQuestions;
  scoringCorrectAnswers = 0;
  scoringStartedAt = Date.now();
  currentQuestionStartedAt = Date.now();
}

function startQuestionTimer() {
  currentQuestionStartedAt = Date.now();
}

function registerCorrectAnswer() {
  scoringCorrectAnswers += 1;
}

function getElapsedSeconds() {
  if (!scoringStartedAt) {
    return 0;
  }

  return Math.max(
    0,
    Math.floor((Date.now() - scoringStartedAt) / 1000)
  );
}

function getQuestionBasePoints() {
  if (scoringTotalQuestions <= 0) {
    return 0;
  }

  return TOTAL_GAME_POINTS / scoringTotalQuestions;
}

function calculateFinalScore() {
  const basePoints = getQuestionBasePoints();
  const maximumScore = scoringCorrectAnswers * basePoints;
  const minimumScore = scoringCorrectAnswers * MIN_POINTS_PER_CORRECT;
  const penalty = getElapsedSeconds() * SECONDS_PENALTY;

  const scoreWithPenalty = maximumScore - penalty;

  return Math.max(
    0,
    Math.min(
      Math.round(maximumScore),
      Math.max(
        Math.round(minimumScore),
        Math.round(scoreWithPenalty)
      )
    )
  );
}

function resetScoring() {
  scoringStartedAt = null;
  currentQuestionStartedAt = null;
  scoringCorrectAnswers = 0;
  scoringTotalQuestions = 0;
}