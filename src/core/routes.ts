import { server } from './app';
import {RoutePostEmail} from "../form/routes";


export const Routes = () => {
    server.register((app, _, done) => {
        RoutePostEmail(app);
        done();
    }, { prefix: '/v1' })
}