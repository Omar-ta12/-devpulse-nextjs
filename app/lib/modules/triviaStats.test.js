import { describe, test, expect } from 'vitest';
import { triviaScorer } from './triviaStats';

describe('triviaScorer', () => {
  test('returns safe empty state for null input', () => {
    const result = triviaScorer(null);

    expect(result.questions).toEqual([]);
    expect(result.difficultyCounts).toEqual([
      { difficulty: 'easy', count: 0 },
      { difficulty: 'medium', count: 0 },
      { difficulty: 'hard', count: 0 },
    ]);
  });

  test('returns safe empty state for undefined input', () => {
    const result = triviaScorer(undefined);

    expect(result.questions).toEqual([]);
    expect(result.difficultyCounts).toEqual([
      { difficulty: 'easy', count: 0 },
      { difficulty: 'medium', count: 0 },
      { difficulty: 'hard', count: 0 },
    ]);
  });

  test('returns safe empty state when results is missing', () => {
    const result = triviaScorer({});

    expect(result.questions).toEqual([]);
    expect(result.difficultyCounts[0].count).toBe(0);
  });

  test('returns safe empty state when results is not an array', () => {
    const result = triviaScorer({ results: 'not-an-array' });

    expect(result.questions).toEqual([]);
  });

  test('handles empty results array', () => {
    const result = triviaScorer({ results: [] });

    expect(result.questions).toEqual([]);
    expect(result.difficultyCounts).toEqual([
      { difficulty: 'easy', count: 0 },
      { difficulty: 'medium', count: 0 },
      { difficulty: 'hard', count: 0 },
    ]);
  });

  test('transforms question data correctly', () => {
    const data = {
      results: [
        {
          question: 'What is 2+2?',
          correct_answer: '4',
          difficulty: 'easy',
          category: 'Math',
        },
      ],
    };
    const result = triviaScorer(data);

    expect(result.questions).toHaveLength(1);
    expect(result.questions[0]).toEqual({
      question: 'What is 2+2?',
      answer: '4',
      difficulty: 'easy',
      category: 'Math',
    });
  });

  test('counts difficulty levels correctly', () => {
    const data = {
      results: [
        { question: 'Q1', correct_answer: 'A', difficulty: 'easy', category: 'C' },
        { question: 'Q2', correct_answer: 'A', difficulty: 'easy', category: 'C' },
        { question: 'Q3', correct_answer: 'A', difficulty: 'medium', category: 'C' },
        { question: 'Q4', correct_answer: 'A', difficulty: 'hard', category: 'C' },
        { question: 'Q5', correct_answer: 'A', difficulty: 'hard', category: 'C' },
        { question: 'Q6', correct_answer: 'A', difficulty: 'hard', category: 'C' },
      ],
    };
    const result = triviaScorer(data);

    expect(result.difficultyCounts).toEqual([
      { difficulty: 'easy', count: 2 },
      { difficulty: 'medium', count: 1 },
      { difficulty: 'hard', count: 3 },
    ]);
  });

  test('ignores unknown difficulty values', () => {
    const data = {
      results: [
        { question: 'Q1', correct_answer: 'A', difficulty: 'unknown', category: 'C' },
        { question: 'Q2', correct_answer: 'A', difficulty: 'easy', category: 'C' },
      ],
    };
    const result = triviaScorer(data);

    expect(result.difficultyCounts).toEqual([
      { difficulty: 'easy', count: 1 },
      { difficulty: 'medium', count: 0 },
      { difficulty: 'hard', count: 0 },
    ]);
  });

  test('processes multiple questions with mixed difficulties', () => {
    const data = {
      results: [
        { question: 'Easy?', correct_answer: 'Yes', difficulty: 'easy', category: 'General' },
        { question: 'Medium?', correct_answer: 'Maybe', difficulty: 'medium', category: 'General' },
        { question: 'Hard?', correct_answer: 'No', difficulty: 'hard', category: 'Science' },
      ],
    };
    const result = triviaScorer(data);

    expect(result.questions).toHaveLength(3);
    expect(result.difficultyCounts).toEqual([
      { difficulty: 'easy', count: 1 },
      { difficulty: 'medium', count: 1 },
      { difficulty: 'hard', count: 1 },
    ]);
  });
});
