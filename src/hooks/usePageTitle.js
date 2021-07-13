import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../store/common/common.actions';

const usePageTitle = (title, goBackIcon = false, childComponent = null) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setPageTitle(childComponent ? childComponent : title, goBackIcon));

    return () => {
      dispatch(setPageTitle('', false));
    }
  }, [title,childComponent])

  return null;
}

export default usePageTitle;