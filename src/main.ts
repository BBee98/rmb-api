import * as Handlebars from "handlebars";
import {template as FormTemplate} from "./form/template";
import {startServer} from "./core/app";

startServer()

const form = Handlebars.compile(FormTemplate)




