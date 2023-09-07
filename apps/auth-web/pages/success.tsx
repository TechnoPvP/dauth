import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from 'next';
import React, { FC, useEffect } from 'react';
import { fetchGithubCallback } from '../libs/api/payroll.api';

export const getServerSideProps: GetServerSideProps<{ code: string }> = async (
  context
) => {
  const query = context.query;
  const code = query.code as string;

  if (!code) throw new Error('Invalid authorization code');

  const response = await fetchGithubCallback({ code });

  console.log({ backendResponse: response.data });

  return {
    props: {
      code: code,
    },
  };
};

const Success: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ code, ...props }) => {
  return (
    <>
      <style jsx>{``}</style>
    </>
  );
};

export default Success;
