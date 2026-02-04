export interface RuntimeConfigState {
  config: Record<string, unknown>;
}

export const initialRuntimeConfigState: RuntimeConfigState = {
  config: {},
};
