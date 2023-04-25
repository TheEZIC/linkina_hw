// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { ipcRenderer, contextBridge } from "electron";

const API = {
  login: (...args: any[]) => ipcRenderer.invoke("login", ...args),
  register: (...args: any[]) => ipcRenderer.invoke("register", ...args),
  getContactInfo: (...args: any[]) => ipcRenderer.invoke("getContactInfo", ...args),
  updateContactInfo: (...args: any[]) => ipcRenderer.invoke("updateContactInfo", ...args),
  manager: {
    findOrders: (...args: any[]) => ipcRenderer.invoke("manager.findOrders", ...args),
    login: (...args: any[]) => ipcRenderer.invoke("manager.assignOrder", ...args),
    updatePrivateDescription: (...args: any[]) => ipcRenderer.invoke("manager.updatePrivateDescription", ...args),
  },
  requester: {
    submitOrder: (...args: any[]) => ipcRenderer.invoke("requester.submitOrder", ...args),
    getOrders: (...args: any[]) => ipcRenderer.invoke("requester.getOrders", ...args),
    getSubmissions: (...args: any[]) => ipcRenderer.invoke("requester.getSubmissions", ...args),
    submitEdit: (...args: any[]) => ipcRenderer.invoke("requester.submitEdit", ...args),
  },
  modeler: {
    getOrders: (...args: any[]) => ipcRenderer.invoke("modeler.getOrders", ...args),
    getEdits: (...args: any[]) => ipcRenderer.invoke("modeler.getEdits", ...args),
    addSubmission: (...args: any[]) => ipcRenderer.invoke("modeler.addSubmission", ...args),
  }
};

contextBridge.exposeInMainWorld("API", API);
