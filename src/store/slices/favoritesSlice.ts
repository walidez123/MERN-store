import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../../types';

interface FavoritesState {
  items: string[];
}

const initialState: FavoritesState = {
  items: []
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const index = state.items.indexOf(action.payload);
      if (index === -1) {
        state.items.push(action.payload);
      } else {
        state.items.splice(index, 1);
      }
    }
  }
});

export const { toggleFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;