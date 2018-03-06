import { Router } from './router';
import { loader } from './loader';
import { Platform } from './platform';

export const router = new Router();
export { loader };
export const platformSingleSpa = new Platform();