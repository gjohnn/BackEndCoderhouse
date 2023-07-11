import { userModel } from "../DAO/models/user.model.js";
import { cartModel } from "../DAO/models/cart.model.js"

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

    async addCartToUser( {uid, cid} ) {
        try {
          const findProdInCart = await userModel.findOne({ _id: uid}, {carts:{ _id:cid }});
          if (findProdInCart) {
            const productToUpdate = findProdInCart.carts.find(e => e.cid.equals(cid));
    
            if (productToUpdate) {
              await userModel.updateOne({ _id: cid, "carts.pid": pid } )
            }
          } else {
            await userModel.findOneAndUpdate(
              { _id: cid }, { $push: { carts: { cid: pid } } }
            );
          }
          const cartToUpdate = await userModel.findOne({ _id: cid });
          return cartToUpdate;
        } catch (error) {
          console.error('Error updating cart:', error);
          throw error;
        }
      }

    async addCartToUser({uid, cid}) {

        try {
            console.log(uid);
            let userFound = await userModel.findOne({_id:`64adc2d0b32b69d01ef590f2`}, {__v:false})
            console.log(userFound);
            const findCartInUser = await userModel.findOne({ _id: uid, carts: { $elemMatch: { uid: uid } } });
            if (findCartInUser) {
                const productToUpdate = findCartInUser.carts.find(e => e.uid.equals(uid));

                if (productToUpdate) {
                    await userModel.updateOne({ _id: uid, "carts.cid": cid })
                }
            } else {
                await userModel.findOneAndUpdate(
                    { _id: uid }, { $push: { carts: { cid: cid } } }
                );
            }
            const userToUpdate = await userModel.findOne({ _id: uid });
            return userToUpdate;
        } catch (error) {
            console.error('Error updating cart:', error);
            throw error;
        }
    }
}

export const userService = new userManager();