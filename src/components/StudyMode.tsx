import React, { useState } from 'react';
import { Box, Paper, Typography, Drawer, useTheme, useMediaQuery, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { setActiveTable } from '@/redux/features/multiplicationSlice';

// Стилизованные компоненты
const TableCell = styled(Paper)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '38px',
  width: '100%',
  fontSize: '0.95rem',
  fontWeight: 'normal',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  padding: '0px',
  margin: '0px',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
  },
  [theme.breakpoints.down('md')]: {
    height: '32px',
    fontSize: '0.85rem',
    padding: '0px',
  },
  [theme.breakpoints.down('sm')]: {
    height: '24px',
    fontSize: '0.7rem',
    padding: '0px',
    touchAction: 'manipulation', // Улучшает отзывчивость на мобильных устройствах
  },
  '@media (max-width: 380px)': {
    height: '18px',
    fontSize: '0.55rem',
    padding: '0px',
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

interface TableButtonProps {
  isactive?: string;
}

const TableButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'isactive',
})<TableButtonProps>(({ theme, isactive }) => ({
  background: isactive === 'true' 
    ? 'linear-gradient(45deg, #ff9a9e, #fecfef)'
    : 'linear-gradient(45deg, #a8edea, #fed6e3)',
  color: '#333',
  borderRadius: '12px',
  fontWeight: 'bold',
  transition: 'all 0.3s ease',
  margin: '2px',
  padding: '6px 10px',
  fontSize: '0.85rem',
  minWidth: '36px',
  '&:hover': {
    background: 'linear-gradient(45deg, #ff9a9e, #fecfef)',
    transform: 'translateY(-1px)',
    boxShadow: '0 2px 6px rgba(255, 154, 158, 0.4)',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.75rem',
    padding: '4px 8px',
    margin: '2px',
    minWidth: '30px',
    touchAction: 'manipulation', // Улучшает отзывчивость на мобильных устройствах
  },
}));

const StudyMode: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const activeTable = useAppSelector((state) => state.multiplication.activeTable);
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Массив таблиц умножения
  const tables = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  
  // Обработчик выбора таблицы
  const handleTableSelect = (tableNumber: number) => {
    dispatch(setActiveTable(tableNumber));
    if (isMobile) {
      setDrawerOpen(false); // Закрываем меню после выбора таблицы на мобильных устройствах
    }
  };
  
  // Обработчики для меню
  const handleOpenDrawer = () => {
    setDrawerOpen(true);
  };
  
  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  // Создание полной таблицы умножения с адаптивным масштабированием
  const renderMultiplicationTable = () => {
    const theme = useTheme();
    const isXsScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const isVerySmallScreen = useMediaQuery('(max-width:380px)');
    const isMdScreen = useMediaQuery(theme.breakpoints.up('md'));
    const isLgScreen = useMediaQuery(theme.breakpoints.up('lg'));
    const isXlScreen = useMediaQuery(theme.breakpoints.up('xl'));
    
    // Динамические размеры в зависимости от размера экрана
    let cellSize;
    if (isVerySmallScreen) cellSize = 16;
    else if (isXsScreen) cellSize = 20;
    else if (isMdScreen) cellSize = 30;
    else if (isLgScreen) cellSize = 38;
    else if (isXlScreen) cellSize = 45;
    else cellSize = 24; // Стандартный размер для sm
    
    // Отступы между ячейками
    let gap;
    if (isVerySmallScreen) gap = 0.01;
    else if (isXsScreen) gap = 0.02;
    else if (isMdScreen) gap = 0.1;
    else if (isLgScreen) gap = 0.15;
    else if (isXlScreen) gap = 0.2;
    else gap = 0.05; // Стандартный отступ для sm
    
    // Размер шрифта
    const fontSize = isVerySmallScreen ? '0.55rem' : 
                     isXsScreen ? '0.65rem' : 
                     isMdScreen ? '0.9rem' : 
                     isLgScreen ? '1rem' : 
                     isXlScreen ? '1.1rem' : '0.8rem';
    
    const rows = [];
    const headerRow = [
      <HeaderCell key="empty" elevation={1}>×</HeaderCell>
    ];
    
    for (let i = 1; i <= 10; i++) {
      headerRow.push(
        <HeaderCell key={`header-${i}`} elevation={1}>{i}</HeaderCell>
      );
    }
    
    // Заголовок таблицы
    rows.push(
      <Box 
        sx={{ 
          display: 'flex', 
          gap: gap, 
          width: '100%', 
          mb: gap, 
          overflow: 'auto',
          '&::-webkit-scrollbar': {
            height: '3px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,0.2)',
            borderRadius: '3px',
          }
        }} 
        key="header-row"
      >
        {headerRow.map((cell, index) => (
          <Box 
            sx={{ 
              flex: 1,
              minWidth: `${cellSize}px`,
              maxWidth: isXlScreen ? `${cellSize * 2}px` : `${cellSize * 1.5}px`,
            }} 
            key={`header-cell-${index}`}
          >
            {cell}
          </Box>
        ))}
      </Box>
    );
    
    // Строки таблицы
    for (let i = 1; i <= 10; i++) {
      const row = [
        <HeaderCell key={`row-header-${i}`} elevation={1}>{i}</HeaderCell>
      ];
      
      for (let j = 1; j <= 10; j++) {
        const isHighlighted = (activeTable !== null && activeTable !== 0 && (i === activeTable || j === activeTable));
        row.push(
          <TableCell 
            key={`cell-${i}-${j}`} 
            elevation={1} 
            sx={{ 
              backgroundColor: isHighlighted ? '#fff8e1' : 'white', 
              fontWeight: isHighlighted ? 'bold' : 'normal',
              fontSize: fontSize
            }}
          >
            {i * j}
          </TableCell>
        );
      }
      
      rows.push(
        <Box 
          sx={{ 
            display: 'flex', 
            gap: gap, 
            width: '100%', 
            mb: gap, 
            overflow: 'auto',
            '&::-webkit-scrollbar': {
              height: '3px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(0,0,0,0.2)',
              borderRadius: '3px',
            }
          }} 
          key={`row-${i}`}
        >
          {row.map((cell, index) => (
            <Box 
              sx={{ 
                flex: 1,
                minWidth: `${cellSize}px`,
                maxWidth: isXlScreen ? `${cellSize * 2}px` : `${cellSize * 1.5}px`,
              }} 
              key={`cell-${i}-${index}`}
            >
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
      height: '100vh',
      width: '100vw',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Кнопка меню */}
      <Button 
        variant="contained"
        sx={{ 
          position: 'absolute', 
          top: 4, 
          left: 4, 
          zIndex: 1100,
          minWidth: '32px',
          width: '32px',
          height: '32px',
          padding: 0,
          fontSize: '1rem',
          backgroundColor: 'rgba(25, 118, 210, 0.8)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          '&:hover': {
            backgroundColor: 'rgba(25, 118, 210, 0.9)',
          }
        }}
        onClick={handleOpenDrawer}
        size="small"
      >
        ☰
      </Button>

      {/* Выдвижное меню */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleCloseDrawer}
      >
        <Box sx={{ 
          width: 200, 
          p: 1.5,
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 1
          }}>
            <Typography variant="subtitle1" sx={{ fontSize: '1rem' }}>Выберите таблицу</Typography>
            <Button 
              variant="outlined" 
              onClick={handleCloseDrawer} 
              size="small"
              sx={{ 
                minWidth: '24px', 
                width: '24px', 
                height: '24px', 
                padding: 0,
                fontWeight: 'bold',
                ml: 1
              }}
            >
              ×
            </Button>
          </Box>
          
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 0.5,
            justifyContent: 'center'
          }}>
            {tables.map((num) => (
              <TableButton
                key={`table-${num}`}
                variant="contained"
                isactive={(activeTable === num).toString()}
                onClick={() => handleTableSelect(num)}
                size="small"
              >
                {num}
              </TableButton>
            ))}
            <TableButton
              variant="contained"
              isactive={(activeTable === 0).toString()}
              onClick={() => handleTableSelect(0)}
              size="small"
            >
              Все
            </TableButton>
          </Box>
        </Box>
      </Drawer>

      {/* Таблица умножения на весь экран */}
      <Box sx={{ 
        flex: 1, 
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        pt: { xs: 0.5, sm: 1, md: 2, lg: 3 },
        px: { xs: 0.2, sm: 0.5, md: 1, lg: 2 },
        overflow: { xs: 'auto', md: 'auto' }
      }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          width: '100%',
          maxWidth: { xs: '100%', sm: '98%', md: '95%', lg: '90%', xl: '85%' },
          mx: 'auto',
          overflow: 'auto',
          transition: 'all 0.3s ease',
          '&::-webkit-scrollbar': {
            width: '3px',
            height: '3px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,0.2)',
            borderRadius: '3px',
          }
        }}>
          {renderMultiplicationTable()}
        </Box>
      </Box>
    </Box>
  );
};

export default StudyMode;
