import { Button } from '@chakra-ui/button';
import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { Input } from '@chakra-ui/input';
import { AbsoluteCenter, Box, HStack, VStack } from '@chakra-ui/layout';
import { Divider, FormErrorMessage, Heading, Text } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import githubIcon from '@iconify/icons-logos/github-icon';
import googleIcon from '@iconify/icons-logos/google-icon';
import microsoftIcon from '@iconify/icons-logos/microsoft-icon';
import { Icon } from '@iconify/react';
import axios, { AxiosError } from 'axios';
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from 'next';
import Link from 'next/link';
import { useState } from 'react';
import {
  Controller,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email({ message: 'Email is required' }),
  password: z.string().min(1, 'Password is required'),
});

export const loginSchemaWithoutPassword = loginSchema.omit({ password: true });

export type LoginSchema = z.infer<typeof loginSchema>;

export const Index: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ redirectUrl }) => {
  const [isLocalStrategy, setIsLocalStrategy] = useState<boolean>(false);

  const { control, watch, handleSubmit, formState, trigger } =
    useForm<LoginSchema>({
      mode: 'onTouched',
      reValidateMode: 'onChange',
      defaultValues: {
        email: '',
      },
      resolver: isLocalStrategy
        ? zodResolver(loginSchema)
        : zodResolver(loginSchemaWithoutPassword),
    });

  const handleMe = async () => {
    try {
      const response = await axios.get('https://localhost:5050/auth/me', {
        withCredentials: true,
      });
      console.log(response.data);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error.response?.data);
      }
    }
  };

  const handleCallHrms = async () => {
    try {
      const response = await axios.get('http://localhost:6010/employee', {
        withCredentials: true,
      });
      console.log(response.data);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error.response?.data);
      }
    }
  };

  const handleValidSubmit: SubmitHandler<LoginSchema> = (data, event) => {
    if (!isLocalStrategy) return setIsLocalStrategy(true);
  };

  const handleInvalidSubmit: SubmitErrorHandler<LoginSchema> = (
    error,
    event
  ) => {
    console.log('Submission error', error);
  };

  const logout = async () => {
    try {
      const response = await axios.post(
        'http://localhost:5050/auth/logout',
        {},
        {
          withCredentials: true,
        }
      );
      console.log(response.data);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error.response?.data);
      }
    }
  };

  return (
    <>
      <main>
        <div className="login-container">
          <VStack spacing={5}>
            <form
              className="form-container"
              onSubmit={handleSubmit(handleValidSubmit, handleInvalidSubmit)}
            >
              <VStack spacing={5}>
                <VStack>
                  <Heading fontSize="3xl">Log In to to your account</Heading>
                  <Text fontSize="md" color="gray.500">
                    Central platform that connects everything
                  </Text>
                </VStack>

                <Controller
                  control={control}
                  name="email"
                  render={({ field, fieldState, formState }) => (
                    <FormControl isInvalid={fieldState.invalid}>
                      <FormLabel>Email</FormLabel>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        {...field}
                      />
                      <FormErrorMessage>
                        {fieldState.error?.message}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                />

                {isLocalStrategy && (
                  <Controller
                    control={control}
                    name="password"
                    render={({ field, fieldState, formState }) => (
                      <FormControl isInvalid={fieldState.invalid}>
                        <FormLabel>Password</FormLabel>
                        <Input
                          type="password"
                          placeholder="Password"
                          {...field}
                        />
                        <FormErrorMessage>
                          {fieldState.error?.message}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  />
                )}

                <Button
                  variant="solid"
                  w="full"
                  colorScheme="twitter"
                  type={'submit'}
                >
                  Continue with email
                </Button>
              </VStack>
            </form>

            <HStack>
              <Button onClick={handleCallHrms}>Call HRMS</Button>
              <Button onClick={handleMe}>Call Auth</Button>
              <Button onClick={logout}>Logout</Button>
            </HStack>

            <Box position="relative" paddingY="4" w="full">
              <Divider />
              <AbsoluteCenter
                position="relative"
                zIndex="docked"
                bg="rgb(252, 252, 252)"
                px="3"
                color="gray.500"
              >
                OR
              </AbsoluteCenter>
            </Box>

            <Link
              href={`http://localhost:5050/auth/login/microsoft?redirectUrl=${redirectUrl}`}
              style={{ width: '100%' }}
            >
              <Button
                variant="outline"
                w="full"
                borderColor="gray.200"
                color="gray.600"
                leftIcon={<Icon icon={microsoftIcon} />}
              >
                Continue with Microsoft
              </Button>
            </Link>

            <Link
              href={`http://localhost:5050/auth/login/google?redirectUrl=${redirectUrl}`}
              style={{ width: '100%' }}
            >
              <Button
                variant="outline"
                w="full"
                borderColor="gray.200"
                color="gray.600"
                leftIcon={<Icon icon={googleIcon} />}
              >
                Continue with Google
              </Button>
            </Link>

            <Link
              href={`https://localhost:5050/auth/login/github`}
              style={{ width: '100%' }}
            >
              <Button
                leftIcon={<Icon icon={githubIcon} />}
                variant="outline"
                w="full"
                borderColor="gray.200"
                color="gray.600"
              >
                Continue with Github
              </Button>
            </Link>

            <HStack spacing="1">
              <Text>Having issues?</Text>
              <Text
                cursor={'pointer'}
                color={'#3b76b6'}
                textDecorationColor={'#3b76b6'}
              >
                Contact Us
              </Text>
            </HStack>
          </VStack>
        </div>

        {/* <Button onClick={handleCallHrms}>Call HRMS</Button>
        <Button onClick={handleMe}>Call Auth</Button>
        <Button onClick={logout}>Logout</Button> */}
      </main>

      <style jsx>{`
        main {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          background-color: #fcfcfc;
        }

        .form-container {
          width: 100%;
        }

        .link {
          position: relative;
          display: inline-block;
        }

        .underline {
          position: absolute;
          width: 0%;
          height: 1.5px;
          background-color: #3b76b6;
          transition: width 0.15s ease-in;
          left: 0;
          right: unset;
          bottom: 0;
        }

        .login-container {
          width: 100%;
          max-width: 500px;
          margin: 0 auto;
        }
      `}</style>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<{
  redirectUrl: string | null;
}> = async (context) => {
  const redirectUrl: string | undefined = Array.isArray(
    context.query.redirectUrl
  )
    ? context.query.redirectUrl[0]
    : context.query.redirectUrl;

  return {
    props: {
      redirectUrl: redirectUrl || null,
    },
  };
};

export default Index;
