const { User, Thought } = require('../models');

const userController = {
    getAllUsers(req, res) {
        User.find({})
        .populate({ path: "thoughts", select: "-__v" })
        .populate({ path: "friends", select: "-__v" })
        .select("-__v")
        .then((dbUserData) => res.json(dbUserData))
        .catch((err) => {
            console.log(err);
            res.status(400).json(err);
        });
    },

    getUserById({params}, res) {
        User.findOne({_id: params.id})
            .populate({
                path: "thoughts",
                select: "-__v",
            })
            .populate({
                path: "friends",
                select: "-__v",
            })
            .select("-__v")
            .then((dbUserData) => res.json(dbUserData))
            .catch((err) => {
                console.log(err);
                res.sendStatus(400);
            });
    },

    createUser({ body }, res) {
        User.create(body)
            .then((dbUserData) => res.json(dbUserData))
            .catch((err) => res.json(err))
    },

    updateUser({ params, body }, res) {
        User.findOneAndUpdate({_id: params.id}, body, {new: true, runValidators: true})
        .then((dbUserData) => {
            if (!dbUserData) {
                res.status(404),json({message: "Sorry! No user with that id has been found"});
                return;
            }
            res.json(dbUserData);
        })
        .catch((err) => res.json(err));
    },

    deleteUser({ params }, res) {
        User.findOneAndDelete({_id: params.id})
            .then((dbUserData) => res.json(dbUserData))
            .catch((err) => res.json(err));
    },

    addFriend({params}, res) {
        User.findOneAndUpdate(
            {_id: params.id},
            {$push: {friends: params.friendsId}},
            {new: true}
        )
        .then((dbUserData) => {
            if (!dbUserData) {
                res.status(404).json({message: "Sorry, A user with that id has not been found!"});
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.json(err));
    },

    removeFriend

}

