import React from 'react';
import { ManageObjectResponse } from '../../types';
// import './JSONResponse.scss';

interface JSONResponseProps {
  jsonResponse: ManageObjectResponse | null;
}

const JSONResponse: React.FC<JSONResponseProps> = ({ jsonResponse }) => {
  return (
    <div className="json-response">
      <h3>Server Response</h3>
      {jsonResponse ? (
        <pre>{JSON.stringify(jsonResponse, null, 2)}</pre>
      ) : (
        <p>No response yet</p>
      )}
    </div>
  );
};

export default JSONResponse;
