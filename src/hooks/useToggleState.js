import { useState } from 'react';

const useToggleState = initState => {
  const [state, setState] = useState(initState || false);

  const toggleVisible = () => {
    setState(!state);
  };

  return [
    state,
    toggleVisible,
    setState,
  ];
};

export default useToggleState;
