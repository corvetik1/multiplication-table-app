import React from 'react';
import { Box, Button, Typography, Container, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { setMode, Mode } from '@/redux/features/multiplicationSlice';
import StudyMode from './StudyMode';
import PracticeMode from './PracticeMode';
import TestMode from './TestMode';

// Стилизованные компоненты
const ModeButton = styled(Button)<{ isactive: string }>(({ theme, isactive }) => ({
  background: isactive === 'true' 
    ? 'linear-gradient(45deg, #00d2ff, #3a7bd5)'
    : 'linear-gradient(45deg, #ff6b6b, #ee5a24)',
  color: 'white',
  borderRadius: '20px',
  padding: '10px 16px',
  fontSize: '1rem',
  fontWeight: 'bold',
  transition: 'all 0.3s ease',
  boxShadow: isactive === 'true'
    ? '0 3px 8px rgba(58, 123, 213, 0.3)'
    : '0 3px 8px rgba(238, 90, 36, 0.3)',
  margin: '6px',
  '&:hover': {
    transform: 'translateY(-1px)',
    boxShadow: isactive === 'true'
      ? '0 4px 12px rgba(58, 123, 213, 0.4)'
      : '0 4px 12px rgba(238, 90, 36, 0.4)',
  },
  [theme.breakpoints.down('sm')]: {
    padding: '8px 12px',
    fontSize: '0.9rem',
    margin: '4px',
    minWidth: '100px',
  },
}));

const ContentPaper = styled(Paper)(() => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  borderRadius: '15px',
  padding: '15px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
}));

const MultiplicationApp: React.FC = () => {
  const dispatch = useAppDispatch();
  const mode = useAppSelector((state) => state.multiplication.mode);
  
  // Обработчик изменения режима
  const handleModeChange = (newMode: Mode) => {
    dispatch(setMode(newMode));
  };
  
  return (
    <Container 
      maxWidth="md" 
      sx={{ 
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        py: { xs: 1, sm: 2 },
        px: { xs: 1, sm: 2 },
      }}
    >
      <Box 
        sx={{ 
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          padding: { xs: '8px 10px', sm: '10px 15px' },
          textAlign: 'center',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
          borderRadius: '10px',
          mb: { xs: 1, sm: 2 },
        }}
      >
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            color: '#4a90e2',
            mb: 1,
            fontWeight: 'bold',
            textShadow: '1px 1px 3px rgba(0, 0, 0, 0.1)',
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
          }}
        >
          🎯 Изучаем таблицу умножения! 🎯
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 1, mb: 1 }}>
          <ModeButton 
            isactive={(mode === 'study').toString()}
            onClick={() => handleModeChange('study')}
            variant="contained"
          >
            Изучение
          </ModeButton>
          <ModeButton 
            isactive={(mode === 'practice').toString()}
            onClick={() => handleModeChange('practice')}
            variant="contained"
          >
            Практика
          </ModeButton>
          <ModeButton 
            isactive={(mode === 'test').toString()}
            onClick={() => handleModeChange('test')}
            variant="contained"
          >
            Тест
          </ModeButton>
        </Box>
      </Box>
      
      <ContentPaper elevation={3}>
        {mode === 'study' && <StudyMode />}
        {mode === 'practice' && <PracticeMode />}
        {mode === 'test' && <TestMode />}
      </ContentPaper>
    </Container>
  );
};

export default MultiplicationApp;
