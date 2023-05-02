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
    assignOrder: (...args: any[]) => ipcRenderer.invoke("manager.assignOrder", ...args),
    updatePrivateDescription: (...args: any[]) => ipcRenderer.invoke("manager.updatePrivateDescription", ...args),
    getModelers: (...args: any[]) => ipcRenderer.invoke("manager.getModelers", ...args),
    getRequesters: (...args: any[]) => ipcRenderer.invoke("manager.getRequesters", ...args),
  },
  requester: {
    submitOrder: (...args: any[]) => ipcRenderer.invoke("requester.submitOrder", ...args),
    editOrder: (...args: any[]) => ipcRenderer.invoke("requester.editOrder", ...args),
    deleteOrder: (...args: any[]) => ipcRenderer.invoke("requester.deleteOrder", ...args),
    getOrders: (...args: any[]) => ipcRenderer.invoke("requester.getOrders", ...args),
    getSubmissions: (...args: any[]) => ipcRenderer.invoke("requester.getSubmissions", ...args),
    submitEdit: (...args: any[]) => ipcRenderer.invoke("requester.submitEdit", ...args),
    finishOrder: (...args: any[]) => ipcRenderer.invoke("requester.finishOrder", ...args),
  },
  modeler: {
    getOrders: (...args: any[]) => ipcRenderer.invoke("modeler.getOrders", ...args),
    getEdits: (...args: any[]) => ipcRenderer.invoke("modeler.getEdits", ...args),
    addSubmission: (...args: any[]) => ipcRenderer.invoke("modeler.addSubmission", ...args),
  }
};

contextBridge.exposeInMainWorld("API", API);
