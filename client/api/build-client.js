import axios from "axios";

const BuildClient= ({ req }) => {
  if (typeof window === "undefined") {
    //we are on the server
    //requests should be made to http://ingress-nginx.ingress-nginx.svc.cluster.local
    return axios.create({
      baseURL: 'http://www.ticketing-domain-prod-mariglianella.xyz/',
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