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
  padding: '16px',
  borderRadius: '12px',
  boxShadow: '0 3px 10px rgba(0, 0, 0, 0.08)',
  background: 'linear-gradient(to right, #ffffff, #f9f9f9)',
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '200px',
  width: '100%',
  maxWidth: '95%',
}));

const SubmitButton = styled(Button)(() => ({
  background: 'linear-gradient(45deg, #00d2ff, #3a7bd5)',
  color: 'white',
  borderRadius: '16px',
  padding: '6px 16px',
  fontWeight: 'bold',
  transition: 'all 0.3s ease',
  boxShadow: '0 2px 6px rgba(58, 123, 213, 0.3)',
  '&:hover': {
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 10px rgba(58, 123, 213, 0.4)',
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
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%', 
      width: '100%',
      maxWidth: { xs: '100%', sm: '95%', md: '800px' }, 
      mx: 'auto', 
      px: { xs: 1, sm: 1.5, md: 2 },
      overflow: 'hidden'
    }}>
      <Box sx={{ mb: 0.5 }}>
        <Typography variant="subtitle1" sx={{ textAlign: 'center', mb: 0.5, fontSize: { xs: '0.85rem', sm: '0.95rem' } }}>
          Тест: {testMode.totalQuestions - testMode.questionsLeft} из {testMode.totalQuestions} вопросов
        </Typography>
        <LinearProgress 
          variant="determinate" 
          value={progress} 
          sx={{ 
            height: { xs: 6, sm: 8 }, 
            borderRadius: { xs: 3, sm: 4 },
            backgroundColor: 'rgba(0,0,0,0.08)',
            '& .MuiLinearProgress-bar': {
              backgroundColor: 'primary.main',
            }
          }} 
        />
      </Box>
      
      {testMode.questionsLeft > 0 ? (
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', mt: 1 }}>
          <TestPaper elevation={3}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', color: '#2c3e50' }}>
              {question.factor1} × {question.factor2} = ?
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', gap: 1, mb: 2 }}>
              <TextField
                label="Ваш ответ"
                variant="outlined"
                value={answer}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                autoFocus
                sx={{ 
                  width: '120px',
                  input: { 
                    textAlign: 'center',
                    fontSize: '1.4rem',
                  }
                }}
              />
              
              <SubmitButton 
                onClick={handleCheckAnswer}
                disabled={!answer}
                variant="contained"
                size="medium"
              >
                Проверить
              </SubmitButton>
            </Box>
            
            {isCorrect !== null && (
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  color: isCorrect ? 'success.main' : 'error.main',
                  fontWeight: 'bold',
                  animation: 'fadeIn 0.5s',
                  fontSize: '1rem'
                }}
              >
                {isCorrect ? 'Правильно!' : 'Неверно!'}
              </Typography>
            )}
          </TestPaper>
        </Box>
      ) : (
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', mt: 2 }}>
          <TestPaper elevation={3}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', color: '#2c3e50' }}>
              Тест завершен!
            </Typography>
            
            <Box sx={{ 
              p: 2, 
              bgcolor: 'rgba(0, 0, 0, 0.03)', 
              borderRadius: 2,
              mb: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'medium', mb: 0.5 }}>
                Ваш результат:
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                {testMode.correctAnswers} из {testMode.totalQuestions}
                ({Math.round((testMode.correctAnswers / testMode.totalQuestions) * 100)}%)
              </Typography>
            </Box>
            
            <SubmitButton 
              onClick={handleRestartTest}
              variant="contained"
              size="medium"
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
