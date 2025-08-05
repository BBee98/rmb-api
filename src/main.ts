import {ConfigEnvironment, Serve} from './core/app';
import {Routes} from './core/routes'
import * as Handlebars from "handlebars";
import {template as FormTemplate} from "./form/template";

Routes();
Serve();
ConfigEnvironment();

const form = Handlebars.compile(FormTemplate)


