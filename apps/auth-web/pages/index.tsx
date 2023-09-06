import axios from 'axios';

export function Index() {
  const handleGithubLogin = async () => {
    const HOST = 'http://localhost:5010';
    const response = await axios.post(`${HOST}/auth/login/github`);

    console.log(response);
  };

  return (
    <>
      <a href="http://localhost:5010/auth/login/github">Login With Github</a>

      <style jsx>{`
        .page {
        }
      `}</style>
    </>
  );
}

export default Index;
