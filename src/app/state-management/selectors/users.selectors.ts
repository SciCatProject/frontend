import {createSelector, Store} from '@ngrx/store';

export const getState = (state: any) => state.root.user;
export const getCurrentUser = (state: any) => state.root.user.currentUser;
export const getSettings = (state: any) => state.root.user.settings;
export const getTapeCopies = (state: any) => state.root.user.settings.tapeCopies;

