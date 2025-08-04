import express, { Router } from 'express'
import UserController from '../../controlllers/user-controller'
import { RegisterValidator, LoginValidator} from '../validators/user-validator'

const opts: express.RouterOptions = {
   caseSensitive: true
}

const UserRouter: Router = express.Router(opts)

const controller = new UserController()

UserRouter.route("/auth/users/register").post(RegisterValidator,controller.RegisterUser)
UserRouter.route("/auth/users/login").post(LoginValidator,controller.Login)
UserRouter.route("/auth/users/profile").get(controller.GetProfile)


export default UserRouter;

