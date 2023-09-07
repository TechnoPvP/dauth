import { Button, ButtonGroup } from '@chakra-ui/button';
import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { Icon } from '@chakra-ui/icon';
import { Input, InputGroup, InputLeftElement } from '@chakra-ui/input';
import { VStack } from '@chakra-ui/layout';
import { EmailIcon, LockIcon } from '@chakra-ui/icons';
import { Divider } from '@chakra-ui/react';
import { Text } from '@chakra-ui/react';
import axios, { AxiosError } from 'axios';
import Link from 'next/link';

export function Index() {
  const handleMe = async () => {
    try {
      const response = await axios.get('http://localhost:5050/auth/me', {
        withCredentials: true
      });
      console.log(response.data);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error.response?.data);
      }
    }
  };

  return (
    <>
      {/* <a href="http://localhost:5010/auth/login/github">Login With Github</a> */}

      <main>
        <div className="login-container">
          <VStack spacing={5}>
            <Text fontSize="xl"> Airhublabs </Text>

            <FormControl>
              <FormLabel>Email</FormLabel>

              <InputGroup>
                <InputLeftElement>
                  <Icon as={LockIcon} />
                </InputLeftElement>
                <Input type="email" placeholder="Email" />
              </InputGroup>
            </FormControl>

            <FormControl>
              <FormLabel>Password</FormLabel>

              <InputGroup>
                <InputLeftElement>
                  <Icon as={EmailIcon} />
                </InputLeftElement>
                <Input type="password" placeholder="Password" />
              </InputGroup>
            </FormControl>

            <Button variant="solid" w="full" colorScheme="twitter">
              Login
            </Button>

            <Button onClick={handleMe}>Me</Button>

            <Divider />

            <Button
              variant="outline"
              w="full"
              borderColor="gray.200"
              color="gray.600"
            >
               Continue with Twitter
            </Button>

            {/* <Link
              href="http://localhost:5050/auth/login/google"
              style={{ width: '100%' }}
            >
              <Button
                variant="outline"
                w="full"
                borderColor="gray.200"
                color="gray.600"
              >
                Continue with Google
              </Button>
            </Link> */}

            <a href="http://localhost:5050/auth/login/google?redirectUrl=https://webrevived.com">Continue with Google</a>
            <a href="http://localhost:5050/auth/login/github?redirectUrl=https://webrevived.com">Continue with Github</a>

            {/* <Link
              href="http://localhost:5050/auth/login/github"
              style={{ width: '100%' }}
            >
              <Button
                variant="outline"
                w="full"
                borderColor="gray.200"
                color="gray.600"
              >
                Continue with Github
              </Button>
            </Link> */}
          </VStack>
        </div>
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

        .login-container {
          width: 100%;
          max-width: 500px;
          margin: 0 auto;
        }
      `}</style>
    </>
  );
}

export default Index;
