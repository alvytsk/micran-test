import React from 'react';
import { ManageObjectResponse } from '../../types';
import './JSONResponse.scss';

interface JSONResponseProps {
  jsonResponse: ManageObjectResponse | null;
}

function syntaxHighlight(json: string | null) {
  if (!json) return '';

  json = json
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    function (match) {
      let cls = 'number';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'key';
        } else {
          cls = 'string';
        }
      } else if (/true|false/.test(match)) {
        cls = 'boolean';
      } else if (/null/.test(match)) {
        cls = 'null';
      }
      return '<span class="' + cls + '">' + match + '</span>';
    },
  );
}

const JSONResponse: React.FC<JSONResponseProps> = ({ jsonResponse }) => {
  return (
    <div className="json-response">
      <h3>Ответ сервера</h3>
      {jsonResponse ? (
        // <pre>{JSON.stringify(jsonResponse, null, 2)}</pre>

        <pre
          dangerouslySetInnerHTML={{
            __html: syntaxHighlight(JSON.stringify(jsonResponse, undefined, 4)),
          }}
        />
      ) : (
        <p>No response yet</p>
      )}
    </div>
  );
};

export default JSONResponse;
