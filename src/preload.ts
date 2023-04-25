// See the Electron documentation for details on how to use preload scripts:

import { contextBridge } from "electron";
import backend from "./backend";

// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
contextBridge.exposeInMainWorld('API', backend);