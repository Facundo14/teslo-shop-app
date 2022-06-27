import { UiState } from './';


type UiActionType = 
  | { type: '[UI] - TogglMenu'}

export const uiReducer = (state: UiState, action: UiActionType): UiState => {
   switch (action.type) {
      case '[UI] - TogglMenu':
          return {
            ...state,
            isMenuOpen: !state.isMenuOpen
          }

      default:
         return state;
     }


}