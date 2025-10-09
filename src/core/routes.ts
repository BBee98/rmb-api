import { server } from './app';
import {RoutePostEmail} from "../email/routes";


export const routes = () => {
    server.register((app, _, done) => {
        RoutePostEmail(app);
        done();
    }, { prefix: '/v1' })
}