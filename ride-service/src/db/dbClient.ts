import RideDatabase , {RideDatabaseInterface} from "./db";

/**
 * @global Database Instance
 */
const DB: RideDatabaseInterface = new RideDatabase();

export default DB;
