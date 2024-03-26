import { useEffect } from 'react';

const usePageTitle = (title, goBackIcon = false, childComponent = null) => {
  useEffect(() => {
    // setPageTitle(childComponent ? childComponent : title, goBackIcon);

    return () => {
      // setPageTitle('', false);
    }
  }, [title,childComponent])

  return null;
}

export default usePageTitle;