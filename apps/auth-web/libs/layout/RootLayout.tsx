import React, { FC, PropsWithChildren } from 'react';
import { ChakraProvider } from '@chakra-ui/react';

export interface RootLayoutProps extends PropsWithChildren {}

const RootLayout: FC<RootLayoutProps> = ({ children, ...props }) => {
  return (
    <>
      <ChakraProvider>{children}</ChakraProvider>
      <style jsx>{``}</style>
    </>
  );
};

export default RootLayout;
