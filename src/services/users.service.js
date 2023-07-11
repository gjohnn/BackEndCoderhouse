import { userModel } from "../DAO/models/user.model.js";
import { cartService } from "./carts.service.js";

class userManager {
    constructor() {
        this.model = userModel
    }

    async getAllUsers(req) {
        let users;
        try {
            let query = userModel.find({}, { path: false, __v: false, });

            const pages = await userModel.paginate(query);
            const { docs, totalPages, page, hasPrevPage, hasNextPage, prevPage, nextPage } = pages;

            const currentLink = `${req.protocol}://${req.get('host')}${req.originalUrl}`

            const response = {
                status: "success",
                payload: docs,
                totalPages,
                prevPage,
                nextPage,
                page,
                hasPrevPage,
                hasNextPage,
                prevLink: hasPrevPage ? getPrevLink(currentLink, prevPage) : null,
                nextLink: hasNextPage ? getNextLink(currentLink, nextPage) : null,
            };
            return response;

            function getPrevLink(currentLink, prevPage) {
                const parsedUrl = parse(currentLink, true);
                const searchParams = new URLSearchParams(parsedUrl.search);
                searchParams.set('page', prevPage);
                const updatedLink = `${parsedUrl.pathname}?${searchParams.toString()}`;
                return `${req.protocol}://${req.get('host')}${updatedLink}`
            }

            function getNextLink(currentLink, nextPage) {
                const parsedUrl = parse(currentLink, true);
                const searchParams = new URLSearchParams(parsedUrl.search);
                searchParams.set('page', nextPage);
                const updatedLink = `${parsedUrl.pathname}?${searchParams.toString()}`;
                return `${req.protocol}://${req.get('host')}${updatedLink}`
            }
        } catch (error) {
            console.log(error);
        }
        return users;
    }

    async getUserById(id) {
        let user;
        try {
            user = await userModel.findOne({ _id: id });
        } catch (error) {
            console.log(error);
        }
        return user;
    }

    async addUser(first_name, last_name, email) {
        let user;
        try {
            user = await userModel.create({
                first_name, last_name, email, carts: []
            });
        } catch (error) {
            console.log(error);
        }
        return user;
    }

    async updateUser(userid, props) {
        let user;
        try {
            user = await userModel.updateOne({ _id: userid }, props)
        } catch (error) {
            console.log(error);
        }
        return user;
    }

    async addCartToUser({uid, cid}) {

        try {
            let findUser = await userModel.findOne({ _id: uid })
            console.log(findUser);
            if (findUser) {
                const userToUpdate = findUser.carts.find(cart => cart.cid.equals(cid))
                if (userToUpdate) {
                    console.log("El carrito ya pertenece al usuario");
                } else {
                    await userModel.findOneAndUpdate(
                        { _id: uid }, { $push: { carts: { pid: pid } } }
                    );
                }

            } else {
                console.log("user not found!");
            }
            const updatedUser = await userModel.findOne({ _id: uid });
            return updatedUser;

        } catch (error) {
            console.log(error);
        }
    }
}

export const userService = new userManager();