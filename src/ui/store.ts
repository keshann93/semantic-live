export interface Declarations {
  [prop: string]: any;
}

export interface State {
  declarations: Declarations;
}

export interface Action {
  type: string;
  payload: {
    prop: string;
    value?: any;
  };
}

export type UpdateProp = (prop: string, value: any) => void;
export type RemoveProp = (prop: string) => void;

export function reducer(state: State, { type, payload }: Action) {
  switch (type) {
    case 'resetReclarations':
      return {
        ...state,
        declarations: payload,
      };
    default:
      throw new Error();
  }
}
