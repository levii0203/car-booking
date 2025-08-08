import { Router , RouterOptions} from "express";

const RouterOpts:RouterOptions = {
    caseSensitive: true,
}

const RideRouter: Router = Router(RouterOpts);

RideRouter.route('/ride/request').post();

export default RideRouter;