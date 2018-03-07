import { Router } from './router';
import { Platform } from './platform';
import { loader } from './loader';

export const router = new Router();
export const platformSingleSpa = new Platform();
export { loader };
