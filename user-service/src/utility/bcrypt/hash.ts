import bcrypt from 'bcrypt';

const SALT = 10;

export class Bcrypt {
  public HashPassword(obj: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      bcrypt.hash(obj, SALT, (err, hash) => {
        console.log(obj)
        if (err) {
          reject(new Error(`Bcrypt failed: ${err.message}`));
        } else {
          resolve(hash);
        }
      });
    });
  }

  public ComparePassword(obj1:string,obj2:string): Promise<boolean> {
    return new Promise<boolean>((resolve,reject)=>{
        bcrypt.compare(obj1,obj2,(err,is)=>{
            if(err){
                reject(new Error(`Bcrypt failed: ${err.message}`))
            }
            else {
                resolve(is)
            }
        })
    })
  }
}

export default Bcrypt