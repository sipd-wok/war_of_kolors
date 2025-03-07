// Simple module to store state between React and Phaser
let globalState = {
  user_id: "",
  username: "",
  character: "",
};

export const setGlobalState = (newState: Partial<typeof globalState>) => {
  globalState = { ...globalState, ...newState };
};

export const getGlobalState = () => {
  return { ...globalState }; // Return a copy to prevent modification
};
