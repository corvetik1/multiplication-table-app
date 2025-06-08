import React, { useEffect } from 'react';
import { Box, Typography, TextField, Button, Paper, Grid } from '@mui/material';
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
const LevelButton = styled(Button)<{ isactive: string }>(({ theme, isactive }) => ({
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

const SubmitButton = styled(Button)(({ theme }) => ({
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

const QuestionPaper = styled(Paper)(({ theme }) => ({
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
  const { level, question, answer, isCorrect, stats } = useAppSelector((state) => state.multiplication);
  
  // Генерация нового вопроса в зависимости от уровня сложности
  const generateQuestion = () => {
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
  };
  
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
  const handleCheckAnswer = () => {
    if (answer) {
      dispatch(checkAnswer());
      // Небольшая задержка перед новым вопросом
      setTimeout(() => {
        generateQuestion();
      }, 1500);
    }
  };
  
  // Обработчик нажатия Enter
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && answer) {
      handleCheckAnswer();
    }
  };
  
  // Генерация вопроса при первой загрузке и при изменении уровня
  useEffect(() => {
    generateQuestion();
  }, [level]);
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" sx={{ textAlign: 'center', mb: 1 }}>
          Выберите уровень сложности:
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
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
      
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <QuestionPaper elevation={3}>
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: '#2c3e50' }}>
            {question.factor1} × {question.factor2} = ?
          </Typography>
          
          <TextField
            label="Ваш ответ"
            variant="outlined"
            value={answer}
            onChange={handleAnswerChange}
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
