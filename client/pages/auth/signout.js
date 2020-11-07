import { useEffect } from 'react';
import useRequest from '../../hooks/use-request';
import Router from 'next/router';

const SignOut = () => {
  const { doRequest } = useRequest({
    url: '/api/user/signout',
    method: 'post',
    body: {},
    onSuccess: () => {
      console.log('success SigninOut');
      Router.push('/');
    },
  });

  useEffect(() => {
    doRequest();
  }, []);
  return <div>Signing out...</div>;
};

export default SignOut;
