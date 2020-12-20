import axios from "axios";

const BuildClient= ({ req }) => {
 
  if (typeof window === "undefined") {
    //we are on the server
    //requests should be made to http://ingress-nginx-controller.ingress-nginx.svc.cluster.local
    // online: baseURL: 'http://www.ticketing-domain-prod-mariglianella.xyz/',
    return axios.create({
      baseURL: process.env.CLIENT_BASE_URL,
      headers: req.headers,
    });
  } else {
    //we are on the browser
    //requests can be made with a base urs of ""
    return axios.create({
      baseURL: "/",
    });
  }
};

export default BuildClient;