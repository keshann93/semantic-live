export interface Declarations {
  [prop: string]: any;
}

export interface State {
  payload: string;
}

export interface Action {
  type: string;
  payload: string;
}

export function reducer(state: State, { type, payload }: Action) {
  switch (type) {
    case 'resetReclarations':
      return {
        ...state,
        payload,
      };
    default:
      throw new Error();
  }
}
