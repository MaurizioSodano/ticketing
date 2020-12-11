const LandingPage = ({ currentUser }) => {
 
  return currentUser?<h1>Signed In</h1>:<h1>Not logged</h1>;
};

LandingPage.getInitialProps = async (context,client,currentUser) => {

  return {};
};
export default LandingPage;
