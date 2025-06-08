import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Вспомогательная функция для правильного склонения слов
function getFriendlyWord(num: number, prefix: string = ''): string {
  if (num === 1) {
    return `${prefix} коробке`;
  } else if (num >= 2 && num <= 4) {
    return `${prefix} коробках`;
  } else {
    return `${prefix} коробках`;
  }
}

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
  explanation: string;
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
  explanation: '',
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
      state.explanation = '';
    },
    setAnswer: (state, action: PayloadAction<string>) => {
      state.answer = action.payload;
    },
    checkAnswer: (state) => {
      const { factor1, factor2 } = state.question;
      const correctAnswer = factor1 * factor2;
      const userAnswer = parseInt(state.answer);
      const isCorrect = userAnswer === correctAnswer;
      state.isCorrect = isCorrect;
      
      // Формирование понятного объяснения для ребенка
      if (!isCorrect) {
        // Создаем объяснение на основе сложения
        let explanation = `Умножение ${factor1} × ${factor2} означает, что нужно сложить число ${factor1} само с собой ${factor2} раз:\n\n`;
        
        // Добавляем наглядное представление умножения через сложение
        explanation += `${factor1}`;
        for (let i = 1; i < factor2; i++) {
          explanation += ` + ${factor1}`;
        }
        explanation += ` = ${correctAnswer}\n\n`;
        
        // Добавляем пояснение с примером из жизни
        if (factor1 <= 5 && factor2 <= 5) {
          explanation += `Представь, что у тебя ${factor2} ${getFriendlyWord(factor2)} конфет, и в каждой ${getFriendlyWord(factor1, 'по')} ${factor1} штук.\n`;
          explanation += `Всего у тебя будет ${correctAnswer} конфет.`;
        } else {
          explanation += `Правильный ответ: ${correctAnswer}`;
        }
        
        state.explanation = explanation;
      } else {
        state.explanation = `Отлично! ${factor1} × ${factor2} = ${correctAnswer}`;
      }
      
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
