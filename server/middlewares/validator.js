// const { validationResult } = require('express-validator');
// import { Request, Response, NextFunction } from 'express';

// module.exports = (req: Request, res: Response, next: NextFunction) => {
//   const error = validationResult(req);
//   console.log(error.array()[0]);
//   if (!error.isEmpty()) {
//     return res
//       .status(401)
//       .json({ message: `${error.array()[0].param}이 잘못 되었습니다.` });
//   }

//   next();
// };
