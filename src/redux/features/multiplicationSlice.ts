import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Mode = 'study' | 'practice' | 'test';
export type Level = 'easy' | 'medium' | 'hard';

interface MultiplicationState {
  mode: Mode;
  activeTable: number | null;
  level: Level;
  question: {
    factor1: number;
    factor2: number;
  };
  answer: string;
  isCorrect: boolean | null;
  stats: {
    correct: number;
    total: number;
  };
  testMode: {
    questionsLeft: number;
    correctAnswers: number;
    totalQuestions: number;
  };
}

const initialState: MultiplicationState = {
  mode: 'study',
  activeTable: null,
  level: 'easy',
  question: {
    factor1: 0,
    factor2: 0,
  },
  answer: '',
  isCorrect: null,
  stats: {
    correct: 0,
    total: 0,
  },
  testMode: {
    questionsLeft: 10,
    correctAnswers: 0,
    totalQuestions: 10,
  },
};

export const multiplicationSlice = createSlice({
  name: 'multiplication',
  initialState,
  reducers: {
    setMode: (state, action: PayloadAction<Mode>) => {
      state.mode = action.payload;
      state.answer = '';
      state.isCorrect = null;
    },
    setActiveTable: (state, action: PayloadAction<number | null>) => {
      state.activeTable = action.payload;
    },
    setLevel: (state, action: PayloadAction<Level>) => {
      state.level = action.payload;
    },
    setQuestion: (state, action: PayloadAction<{ factor1: number; factor2: number }>) => {
      state.question = action.payload;
      state.answer = '';
      state.isCorrect = null;
    },
    setAnswer: (state, action: PayloadAction<string>) => {
      state.answer = action.payload;
    },
    checkAnswer: (state) => {
      const correctAnswer = state.question.factor1 * state.question.factor2;
      const isCorrect = parseInt(state.answer) === correctAnswer;
      state.isCorrect = isCorrect;
      
      if (state.mode === 'test') {
        state.testMode.questionsLeft -= 1;
        if (isCorrect) {
          state.testMode.correctAnswers += 1;
        }
      } else {
        state.stats.total += 1;
        if (isCorrect) {
          state.stats.correct += 1;
        }
      }
    },
    resetTestMode: (state) => {
      state.testMode = {
        questionsLeft: 10,
        correctAnswers: 0,
        totalQuestions: 10,
      };
    },
    resetStats: (state) => {
      state.stats = {
        correct: 0,
        total: 0,
      };
    },
  },
});

export const {
  setMode,
  setActiveTable,
  setLevel,
  setQuestion,
  setAnswer,
  checkAnswer,
  resetTestMode,
  resetStats,
} = multiplicationSlice.actions;

export default multiplicationSlice.reducer;
