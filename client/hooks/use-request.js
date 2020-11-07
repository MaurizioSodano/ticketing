import { useState } from 'react';
import axios from 'axios';

const UseRequest = ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null);

  const doRequest = async () => {
    try {
      setErrors(null);
      console.log(`calling axios on url:${url}`);
      const response = await axios[method](url, body);
      if (onSuccess) {
        console.log(`on Success:${response.data}`);
        onSuccess(response.data);
      }
      return response.data;
    } catch (err) {
      console.log(`on Error:${err.message}`);
      setErrors(
        <div className='alert alert-danger'>
          <h4>Oops...</h4>
          <ul className='my-0'>
            {err.response.data.errors?.map((error) => (
              <li key={error.message}>{error.message}</li>
            ))}
          </ul>
        </div>
      );
    }
  };

  return { doRequest, errors };
};

export default UseRequest;
