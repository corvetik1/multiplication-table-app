import React, { useEffect, useCallback } from 'react';
import { Box, Typography, TextField, Button, Paper, LinearProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { 
  setAnswer as setTestAnswer, 
  checkAnswer, 
  setQuestion, 
  resetTestMode 
} from '@/redux/features/multiplicationSlice';

// Стилизованные компоненты
const TestPaper = styled(Paper)(() => ({
  padding: '20px',
  borderRadius: '15px',
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
  background: 'linear-gradient(to right, #ffffff, #f9f9f9)',
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '250px',
}));

const SubmitButton = styled(Button)(() => ({
  background: 'linear-gradient(45deg, #00d2ff, #3a7bd5)',
  color: 'white',
  borderRadius: '20px',
  padding: '10px 20px',
  fontWeight: 'bold',
  transition: 'all 0.3s ease',
  boxShadow: '0 3px 8px rgba(58, 123, 213, 0.3)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 15px rgba(58, 123, 213, 0.4)',
  },
}));

const TestMode = (): React.ReactNode => {
  const dispatch = useAppDispatch();
  const { question, answer, isCorrect, level, testMode } = useAppSelector((state) => state.multiplication);
  
  // Генерация нового вопроса для теста
  const generateTestQuestion = useCallback(() => {
    let factor1: number, factor2: number;
    
    switch (level) {
      case 'easy':
        factor1 = Math.floor(Math.random() * 5) + 1; // 1-5
        factor2 = Math.floor(Math.random() * 5) + 1; // 1-5
        break;
      case 'medium':
        factor1 = Math.floor(Math.random() * 7) + 2; // 2-8
        factor2 = Math.floor(Math.random() * 7) + 2; // 2-8
        break;
      case 'hard':
        factor1 = Math.floor(Math.random() * 10) + 1; // 1-10
        factor2 = Math.floor(Math.random() * 10) + 1; // 1-10
        break;
      default:
        factor1 = Math.floor(Math.random() * 10) + 1;
        factor2 = Math.floor(Math.random() * 10) + 1;
    }
    
    dispatch(setQuestion({ factor1, factor2 }));
  }, [level, dispatch]);
  
  // Обработчик ввода ответа
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Разрешаем только цифры
    if (/^\d*$/.test(value)) {
      dispatch(setTestAnswer(value));
    }
  }, [dispatch]);
  
  // Обработчик проверки ответа
  const handleCheckAnswer = useCallback(() => {
    if (answer) {
      dispatch(checkAnswer());
      
      // Если остались вопросы, генерируем новый через небольшую задержку
      if (testMode.questionsLeft > 1) {
        setTimeout(() => {
          generateTestQuestion();
        }, 1500);
      }
    }
  }, [answer, dispatch, generateTestQuestion, testMode.questionsLeft]);
  
  // Обработчик нажатия Enter
  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && answer) {
      handleCheckAnswer();
    }
  }, [answer, handleCheckAnswer]);
  
  // Обработчик перезапуска теста
  const handleRestartTest = useCallback(() => {
    dispatch(resetTestMode());
    generateTestQuestion();
  }, [dispatch, generateTestQuestion]);
  
  // Генерация первого вопроса при загрузке
  useEffect(() => {
    generateTestQuestion();
  }, [generateTestQuestion]);
  
  // Расчет прогресса
  const progress = ((testMode.totalQuestions - testMode.questionsLeft) / testMode.totalQuestions) * 100;
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" sx={{ textAlign: 'center', mb: 1 }}>
          Тест: {testMode.totalQuestions - testMode.questionsLeft} из {testMode.totalQuestions} вопросов
        </Typography>
        <LinearProgress 
          variant="determinate" 
          value={progress} 
          sx={{ 
            height: 10, 
            borderRadius: 5,
            backgroundColor: 'rgba(0,0,0,0.1)',
            '& .MuiLinearProgress-bar': {
              backgroundColor: 'primary.main',
            }
          }} 
        />
      </Box>
      
      {testMode.questionsLeft > 0 ? (
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <TestPaper elevation={3}>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: '#2c3e50' }}>
              {question.factor1} × {question.factor2} = ?
            </Typography>
            
            <TextField
              label="Ваш ответ"
              variant="outlined"
              value={answer}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              autoFocus
              sx={{ 
                mb: 3, 
                width: '150px',
                input: { 
                  textAlign: 'center',
                  fontSize: '1.5rem',
                }
              }}
            />
            
            <SubmitButton 
              onClick={handleCheckAnswer}
              disabled={!answer}
              variant="contained"
              size="large"
            >
              Проверить
            </SubmitButton>
            
            {isCorrect !== null && (
              <Typography 
                variant="h6" 
                sx={{ 
                  mt: 2,
                  color: isCorrect ? 'success.main' : 'error.main',
                  fontWeight: 'bold',
                  animation: 'fadeIn 0.5s'
                }}
              >
                {isCorrect ? 'Правильно!' : 'Неверно!'}
              </Typography>
            )}
          </TestPaper>
        </Box>
      ) : (
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <TestPaper elevation={3}>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: '#2c3e50' }}>
              Тест завершен!
            </Typography>
            
            <Typography variant="h5" sx={{ mb: 3 }}>
              Ваш результат: {testMode.correctAnswers} из {testMode.totalQuestions}
              ({Math.round((testMode.correctAnswers / testMode.totalQuestions) * 100)}%)
            </Typography>
            
            <SubmitButton 
              onClick={handleRestartTest}
              variant="contained"
              size="large"
            >
              Пройти тест снова
            </SubmitButton>
          </TestPaper>
        </Box>
      )}
    </Box>
  );
};

export default TestMode;
