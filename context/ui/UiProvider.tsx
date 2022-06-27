import { FC, useReducer } from 'react';
import { UiContext, uiReducer } from './';

interface Props {
    children?: React.ReactNode | undefined
}

export interface UiState {
    isMenuOpen: boolean;
}

const UI_INITIAL_STATE: UiState = {
    isMenuOpen: false,
}

export const UiPovider:FC<Props> = ({ children }) => {

    const [state, dispatch] = useReducer(uiReducer, UI_INITIAL_STATE);


    const toggleSideMenu = () => {
        dispatch({ type: '[UI] - TogglMenu' });
    }


    return (
        <UiContext.Provider value={{
            ...state,

            //Metods
            toggleSideMenu
        }}>
            { children }
        </UiContext.Provider>
    )
}