import express, { Router } from 'express'
import UserController from '../../controlllers/user-controller'
import { RegisterValidator} from '../validators/user-validator'

const opts: express.RouterOptions = {
   caseSensitive: true
}

const RiderRouter: Router = express.Router(opts)

const controller = new UserController()

RiderRouter.route("/auth/riders/register").post(RegisterValidator,controller.RegisterRider)

export default RiderRouter

