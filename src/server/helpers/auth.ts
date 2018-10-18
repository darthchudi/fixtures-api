import jwt from 'jsonwebtoken';
import ENV from '../../common/config/env';

/**
 * Signs a payload as a JWT Token
 * @param payload - The payload to be encoded
 */
export const signToken = payload => {
  const token = jwt.sign(payload, ENV.JWT_SECRET, { expiresIn: '1h' });
  return { token };
};

export const decodeToken = (token): Promise<any> => {
  return new Promise<any>((resolve, reject) => {
    jwt.verify(token, ENV.JWT_SECRET, (err, decoded) => {
      if (err) return reject(err);
      return resolve(decoded);
    });
  });
};
