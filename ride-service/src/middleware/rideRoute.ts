import { Router , RouterOptions} from "express";
import RideController from "../controller/rideController";

const Controller = new RideController()

const RouterOpts:RouterOptions = {
    caseSensitive: true,
}

const RideRouter: Router = Router(RouterOpts);

RideRouter.route('/ride/request').post(Controller.RideRequest);

export default RideRouter;