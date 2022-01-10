
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { FC, ReactNode, useContext, useState } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import NavigatorResponsive from './components/common/navigator-responsive';

import { PATH_COURSES, routes } from './config/routes-config';
import { StoreType } from './models/store-type';
import CoursesContext, { defaultValue } from './store/context';


const theme = createTheme();
// theme.typography.body1 = {
//   fontSize: '1.2rem',
//   '@media (min-width:568px)': {
//     fontSize: '2rem'
//   },
//   [theme.breakpoints.up('md')]: {
//     fontSize: '3rem'
//   }
// }
const App: FC = () => {

  const [storeValueState, setStore] = useState<StoreType>(defaultValue);
  storeValueState.increase = increaseCount;
  storeValueState.decrease = decreaseCount;
  function increaseCount() {
    storeValueState.count++;
    setStore({ ...storeValueState })
  }
  function decreaseCount() {
    storeValueState.count--;
    setStore({ ...storeValueState })
  }
  function getRoutes(): ReactNode[] {
    return routes.map(r => <Route key={r.path} path={r.path} element={r.element} />)
  }
  return <CoursesContext.Provider value={storeValueState}>
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <NavigatorResponsive items={routes} />
        <Routes>
          {getRoutes()}
          <Route path='/' element={<Navigate to={PATH_COURSES}></Navigate>} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </CoursesContext.Provider>
}

export default App;
