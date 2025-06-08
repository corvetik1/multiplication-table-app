import React from 'react';
import { Box, Button, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { setActiveTable } from '@/redux/features/multiplicationSlice';

// Стилизованные компоненты
const TableCell = styled(Paper)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '48px',
  fontSize: '1rem',
  transition: 'all 0.3s ease',
  fontWeight: 500,
  cursor: 'pointer',
  userSelect: 'none',
  padding: '4px',
  '&:hover': {
    background: '#e3f2fd',
    transform: 'scale(1.05)',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
  },
  [theme.breakpoints.down('md')]: {
    height: '45px',
    fontSize: '0.95rem',
    padding: '3px',
  },
  [theme.breakpoints.down('sm')]: {
    height: '38px',
    fontSize: '0.85rem',
    padding: '2px',
    touchAction: 'manipulation', // Улучшает отзывчивость на мобильных устройствах
  },
}));

const HeaderCell = styled(TableCell)(() => ({
  background: 'linear-gradient(45deg, #4a90e2, #357abd)',
  color: 'white',
  fontWeight: 'bold',
  cursor: 'default',
  '&:hover': {
    transform: 'none',
    background: 'linear-gradient(45deg, #4a90e2, #357abd)',
  },
}));

const TableButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #a8edea, #fed6e3)',
  color: '#333',
  borderRadius: '15px',
  fontWeight: 'bold',
  transition: 'all 0.3s ease',
  margin: '6px',
  padding: '10px 16px',
  fontSize: '1rem',
  minWidth: '120px',
  '&:hover': {
    background: 'linear-gradient(45deg, #ff9a9e, #fecfef)',
    transform: 'translateY(-1px)',
  },
  '&.active': {
    background: 'linear-gradient(45deg, #ff9a9e, #fecfef)',
    transform: 'translateY(-1px)',
    boxShadow: '0 3px 8px rgba(255, 154, 158, 0.4)',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.95rem',
    padding: '10px 14px',
    margin: '5px',
    minWidth: '100px',
    touchAction: 'manipulation', // Улучшает отзывчивость на мобильных устройствах
  },
}));

const StudyMode = (): React.ReactNode => {
  const dispatch = useAppDispatch();
  const activeTable = useAppSelector((state) => state.multiplication.activeTable);
  
  // Таблицы для быстрого выбора
  const tables: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  // Обработчик выбора таблицы
  const handleTableSelect = (num: number) => {
    dispatch(setActiveTable(num));
  };

  // Создание полной таблицы умножения
  const renderMultiplicationTable = () => {
    const rows = [];
    
    // Создаем заголовок таблицы
    const headerRow = [
      <HeaderCell key="empty" elevation={1}>×</HeaderCell>
    ];
    
    for (let i = 1; i <= 10; i++) {
      headerRow.push(
        <HeaderCell key={`header-${i}`} elevation={1}>{i}</HeaderCell>
      );
    }
    
    rows.push(
      <Box sx={{ display: 'flex', gap: { xs: 0.2, sm: 0.3, md: 0.5 }, width: '100%', mb: { xs: 0.2, sm: 0.3, md: 0.5 } }} key="header-row">
        {headerRow.map((cell, index) => (
          <Box sx={{ width: '9.09%' }} key={`header-cell-${index}`}>
            {cell}
          </Box>
        ))}
      </Box>
    );
    
    // Создаем строки таблицы
    for (let i = 1; i <= 10; i++) {
      const row = [
        <HeaderCell key={`row-header-${i}`} elevation={1}>{i}</HeaderCell>
      ];
      
      for (let j = 1; j <= 10; j++) {
        const isHighlighted = 
          (activeTable !== null && activeTable !== 0 && (i === activeTable || j === activeTable));
        
        row.push(
          <TableCell 
            key={`cell-${i}-${j}`} 
            elevation={1}
            sx={{
              backgroundColor: isHighlighted ? '#fff8e1' : 'white',
              fontWeight: isHighlighted ? 'bold' : 'normal',
            }}
          >
            {i * j}
          </TableCell>
        );
      }
      
      rows.push(
        <Box sx={{ display: 'flex', gap: { xs: 0.2, sm: 0.3, md: 0.5 }, width: '100%', mb: { xs: 0.2, sm: 0.3, md: 0.5 } }} key={`row-${i}`}>
          {row.map((cell, index) => (
            <Box sx={{ width: '9.09%' }} key={`cell-${i}-${index}`}>
              {cell}
            </Box>
          ))}
        </Box>
      );
    }
    
    return rows;
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%',
      maxWidth: '100%',
      px: { xs: 1.5, sm: 2 },
      py: { xs: 1.5, sm: 2 }
    }}>
      <Box sx={{ 
        mb: { xs: 1.5, sm: 2.5 }, 
        display: 'flex', 
        flexWrap: 'wrap', 
        justifyContent: 'center',
        gap: { xs: 0.5, sm: 1 }
      }}>
        <Typography 
          variant="subtitle1" 
          sx={{ 
            width: '100%', 
            textAlign: 'center', 
            mb: { xs: 1.5, sm: 2 },
            fontSize: { xs: '1.15rem', sm: '1.25rem' },
            fontWeight: 'medium'
          }}
        >
          Выберите таблицу для изучения:
        </Typography>
        {tables.map((num) => (
          <TableButton
            key={`table-btn-${num}`}
            onClick={() => handleTableSelect(num)}
            className={activeTable === num ? 'active' : ''}
            variant="contained"
            size="small"
          >
            Таблица {num}
          </TableButton>
        ))}
        <TableButton
          onClick={() => handleTableSelect(0)}
          className={activeTable === 0 ? 'active' : ''}
          variant="contained"
          size="small"
        >
          Все таблицы
        </TableButton>
      </Box>
      
      <Box sx={{ 
        flex: 1, 
        backgroundColor: '#f8f9fa',
        borderRadius: '12px',
        p: { xs: 0.5, sm: 1, md: 1.5 },
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        mx: { xs: -0.5, sm: 0 }, // Отрицательный margin на мобильных для большей ширины
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: { xs: 0.25, sm: 0.4, md: 0.5 },
          width: '100%',
          maxWidth: '100%'
        }}>
          {renderMultiplicationTable()}
        </Box>
      </Box>
    </Box>
  );
};

export default StudyMode;
