import { createContext } from 'react';

interface ContextProps {
   isMenuOpen: boolean;

   //Metods
   toggleSideMenu: () => void;
}


export const UiContext = createContext({} as ContextProps);