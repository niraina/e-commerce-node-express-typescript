import { NextFunction, Response } from "express"

/**Import des modules necessaires */
const jwt = require('jsonwebtoken')

/**extraction du token */
const extractBearer = (authorization: string) => {
    if(typeof authorization !== 'string') {
        return false
    }

    //on isole le token
    const matches = authorization.match(/(bearer)\s+(\S+)/i)

    return matches && matches[2]
}

/**verification de presence du token */
const checkTokenMiddeware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization && extractBearer(req.headers.authorization)
    // console.log('Headers', req.headers);
    // console.log('Token', token);
    if(!token) {
        return res.status(401).json({ message: `Ho le petit malin`})
    }

    //verfier la validité du token
    jwt.verify(token, process.env.JWT_SECRET, (err: any, decodedToken: any) => {
        // console.log('Erreur token', err);
        // console.log('Decoded token', decodedToken);
        if(err) {
            return res.status(401).json({message: 'Bad token'})
        }
        next()
    })

}

export default checkTokenMiddeware