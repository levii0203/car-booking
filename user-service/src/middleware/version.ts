import express from 'express'


class VersionMiddleware {
    version:Array<string> = []

    constructor(version:string){
        this.version = [...this.version,version]
    }

    public VersionHandler(): express.Handler {
        return (req: express.Request, res: express.Response, next: express.NextFunction) => {
            const v: string | undefined = req.get("X-Version")
            if ( v ==="" || v === undefined || this.version.indexOf(v)===-1 ) {
                return res.status(400).json({error: "Invalid or missing version header"})
            }
            next();
        }
    }
}

export default VersionMiddleware