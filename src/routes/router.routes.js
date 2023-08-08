import { Router } from "express";
import { generateCustomResponses, handlePolicies } from "../utils/moreUtils.js";

export default class RouterPass {
    constructor() {
        this.router = Router();
        this.init();
    }

    getRouter() {
        return this.router;
    }
    init() { }
    get(path, ...callbacks) {
        this.router.get(path, handlePolicies, generateCustomResponses, this.applyCallbacks(callbacks));
    }
    post(path, ...callbacks) {
        this.router.post(path, handlePolicies, generateCustomResponses, this.applyCallbacks(callbacks));
    }
    put(path, ...callbacks) {
        this.router.put(path, handlePolicies, generateCustomResponses, this.applyCallbacks(callbacks));
    }
    delete(path, ...callbacks) {
        this.router.delete(path, handlePolicies, generateCustomResponses, this.applyCallbacks(callbacks));
    }
    applyCallbacks(callbacks) {
        return callbacks.map((callback) => async (...params) => {
            try {
                await callback.apply(this, params)
            } catch (error) {
                console.log(error);
                params[1].status(500).send(error)
            }
        })
    }
}