import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../store/common/common.actions';

const usePageTitle = title => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setPageTitle(title));

    return () => {
      dispatch(setPageTitle(undefined));
    }
  }, [title])

  return null;
}

export default usePageTitle;