import RouterPass from "./router.routes.js";

export default class PracticeNewRouter extends RouterPass{
    init(){
        this.get('/', async(req,res)=>{
            res.sendSuccess("Nice")
        })
    }
}