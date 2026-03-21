import { useEffect } from 'react';
import { useAppDispatch } from '@/hooks/redux';
import { loadUserFromStorage } from '@/store/authSlice';

const AuthLoader = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadUserFromStorage());
  }, [dispatch]);

  return <>{children}</>;
};

export default AuthLoader;



