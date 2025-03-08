import fs from 'fs';
import jwt from 'jsonwebtoken';
import path from 'path';
import util from 'util';
import * as uuid from 'uuidv7';

const readIt = util.promisify(fs.readFile);
const SECRET_FILE = path.resolve(__dirname, '../rsa-keys/private.test.pem');

const getSecrets = async (): Promise<string> => {
  const privateKeyBuffer = await readIt(SECRET_FILE);
  return privateKeyBuffer.toString();
};

const userUuid = process.argv[2];

const createJwt = async (): Promise<void> => {
  const privateKey = await getSecrets();
  // TODO: set this payload to match your needs
  const somePayload = {
    email: 'some@email.com',
    id: 1,
    uuid: userUuid ?? uuid.uuidv7(),
    roles: ['myUser'],
    source: 'template',
  };
  console.log(JSON.stringify(somePayload, null, ' '));
  console.log(
    jwt.sign(somePayload, privateKey, {
      algorithm: 'RS256',
      issuer: 'PulkitRaina',
      expiresIn: '10h',
    }),
  );
};

void createJwt();
