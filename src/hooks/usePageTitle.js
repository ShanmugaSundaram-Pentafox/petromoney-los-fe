import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../store/common/common.actions';

const usePageTitle = (title, goBackIcon=false) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setPageTitle(title, goBackIcon));

    return () => {
      dispatch(setPageTitle('', false));
    }
  }, [title])

  return null;
}

export default usePageTitle;