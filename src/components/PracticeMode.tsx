import React, { useEffect, useCallback } from 'react';
import { Box, Typography, TextField, Button, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { 
  setAnswer, 
  checkAnswer, 
  setQuestion, 
  setLevel, 
  Level 
} from '@/redux/features/multiplicationSlice';

// Стилизованные компоненты
const LevelButton = styled(Button)<{ isactive: string }>(({ isactive }) => ({
  background: isactive === 'true' 
    ? 'linear-gradient(45deg, #ff9a9e, #fecfef)'
    : 'linear-gradient(45deg, #a8edea, #fed6e3)',
  color: '#333',
  borderRadius: '15px',
  fontWeight: 'bold',
  transition: 'all 0.3s ease',
  margin: '4px',
  '&:hover': {
    background: 'linear-gradient(45deg, #ff9a9e, #fecfef)',
    transform: 'translateY(-1px)',
  },
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


const QuestionPaper = styled(Paper)(() => ({
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

const PracticeMode: React.FC = () => {
  const dispatch = useAppDispatch();
  const { level, question, answer, isCorrect, explanation, stats } = useAppSelector((state) => state.multiplication);
  
  // Генерация случайного вопроса
  const generateQuestion = useCallback(() => {
    let factor1, factor2;
    
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
      default:
        factor1 = Math.floor(Math.random() * 10) + 1; // 1-10
        factor2 = Math.floor(Math.random() * 10) + 1; // 1-10
        break;
    }
    
    dispatch(setQuestion({ factor1, factor2 }));
    dispatch(setAnswer(''));
  }, [level, dispatch]);

  // Обработчик изменения уровня сложности
  const handleLevelChange = (newLevel: Level) => {
    dispatch(setLevel(newLevel));
  };
  
  // Обработчик изменения ответа
  const handleAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Разрешаем только цифры
    if (/^\d*$/.test(value)) {
      dispatch(setAnswer(value));
    }
  };
  
  // Обработчик проверки ответа
  const handleCheckAnswer = useCallback(() => {
    if (answer) {
      dispatch(checkAnswer());
      // Больше не используем автоматический таймер для перехода к следующему вопросу
      // Теперь пользователь сам решает, когда перейти к следующему вопросу
    }
  }, [answer, dispatch]);
  
  // Обработчик перехода к следующему вопросу
  const handleNextQuestion = useCallback(() => {
    generateQuestion();
  }, [generateQuestion]);
  
  // Обработчик нажатия Enter
  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && answer) {
      handleCheckAnswer();
    }
  }, [answer, handleCheckAnswer]);
  
  // Генерация вопроса при первой загрузке и при изменении уровня
  useEffect(() => {
    generateQuestion();
  }, [level, generateQuestion]);
  
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%', 
      width: '100%',
      maxWidth: { xs: '100%', sm: '95%', md: '800px' }, 
      mx: 'auto', 
      px: { xs: 1, sm: 1.5, md: 2 }
    }}>
      <Box sx={{ mb: 1 }}>
        <Typography variant="subtitle1" sx={{ textAlign: 'center', mb: 0.5, fontSize: '0.95rem' }}>
          Выберите уровень сложности:
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 0.5 }}>
          <LevelButton 
            isactive={(level === 'easy').toString()}
            onClick={() => handleLevelChange('easy')}
            variant="contained"
            size="small"
          >
            Легкий
          </LevelButton>
          <LevelButton 
            isactive={(level === 'medium').toString()}
            onClick={() => handleLevelChange('medium')}
            variant="contained"
            size="small"
          >
            Средний
          </LevelButton>
          <LevelButton 
            isactive={(level === 'hard').toString()}
            onClick={() => handleLevelChange('hard')}
            variant="contained"
            size="small"
          >
            Сложный
          </LevelButton>
        </Box>
      </Box>
      
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', mt: 1, overflow: 'hidden' }}>
        <QuestionPaper elevation={3} sx={{ 
          maxWidth: { xs: '100%', sm: '95%' }, 
          width: '100%',
          overflow: 'auto',
          '&::-webkit-scrollbar': {
            width: '4px',
            height: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,0.2)',
            borderRadius: '4px',
          }
        }}>
          <Typography variant="h5" sx={{ 
            mb: { xs: 1, sm: 1.5, md: 2 }, 
            fontWeight: 'bold', 
            color: '#2c3e50',
            fontSize: { xs: '1.2rem', sm: '1.4rem', md: '1.5rem' }
          }}>
            {question.factor1} × {question.factor2} = ?
          </Typography>
          
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' }, 
            alignItems: 'center', 
            gap: { xs: 0.5, sm: 1 }, 
            mb: { xs: 1, sm: 1.5, md: 2 },
            width: '100%'
          }}>
            <TextField
              label="Ваш ответ"
              variant="outlined"
              value={answer}
              onChange={handleAnswerChange}
              onKeyPress={handleKeyPress}
              autoFocus
              sx={{ 
                width: { xs: '100px', sm: '120px' },
                input: { 
                  textAlign: 'center',
                  fontSize: { xs: '1.2rem', sm: '1.4rem' },
                }
              }}
            />
            
            <SubmitButton 
              onClick={handleCheckAnswer}
              disabled={!answer}
              variant="contained"
              size="medium"
              sx={{ width: { xs: '100%', sm: 'auto' } }}
            >
              Проверить
            </SubmitButton>
          </Box>
          
          {isCorrect !== null && (
            <Box sx={{ 
              mt: { xs: 0.5, sm: 1 },
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  color: isCorrect ? 'success.main' : 'error.main',
                  fontWeight: 'bold',
                  animation: 'fadeIn 0.5s',
                  fontSize: { xs: '0.9rem', sm: '1rem' }
                }}
              >
                {isCorrect ? 'Правильно!' : 'Неверно!'}
              </Typography>
              
              {!isCorrect && explanation && (
                <Paper 
                  elevation={2} 
                  sx={{ 
                    mt: { xs: 0.5, sm: 1 }, 
                    p: { xs: 1, sm: 1.5 }, 
                    backgroundColor: '#fff8e1',
                    borderRadius: '8px',
                    border: '1px solid #ffe082',
                    width: '100%',
                    maxHeight: { xs: '150px', sm: '200px' },
                    overflow: 'auto'
                  }}
                >
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      whiteSpace: 'pre-line',
                      fontSize: { xs: '0.8rem', sm: '0.9rem' },
                      color: '#5d4037',
                      textAlign: 'left'
                    }}
                  >
                    {explanation}
                  </Typography>
                </Paper>
              )}
              
              <Button
                onClick={handleNextQuestion}
                variant="contained"
                color="primary"
                size="small"
                sx={{
                  mt: { xs: 1, sm: 1.5 },
                  width: { xs: '100%', sm: 'auto' },
                  background: 'linear-gradient(45deg, #4CAF50, #8BC34A)',
                  color: 'white',
                  borderRadius: '16px',
                  padding: { xs: '4px 10px', sm: '6px 12px' },
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 5px rgba(76, 175, 80, 0.3)',
                  '&:hover': {
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 10px rgba(76, 175, 80, 0.4)',
                  },
                }}
              >
                Следующий вопрос
              </Button>
            </Box>
          )}
        </QuestionPaper>
      </Box>
      
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Typography variant="body1">
          Статистика: {stats.correct} правильных из {stats.total} ({stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0}%)
        </Typography>
      </Box>
    </Box>
  );
};

export default PracticeMode;
