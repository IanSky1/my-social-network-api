const { User, Thought } = require("../models");

const thoughtController = {
    getAllThoughts(req, res) {
        Thought.find({})
            .populate({
                path: "reactions",
                select: "-__v",
            })
            .select('-__v')
            .then((dbThoughtData) => res.json(dbThoughtData))
            .catch((err) => {
                console.log(err);
                res.status(404).json(err);
            });   
    },

    getThoughtById({ params }, res) {
        Thought.findOne({_id: params.thoughtId })
        .populate({
            path: "reactions",
            select: "-__v",
        })
        .select("-__v")
        .sort({ _id: -1 })
        .then((dbThoughtData) => res.json(dbThoughtData))
        .catch((err) => {
            console.log(err);
            res.sendStats(400);
        });
    },

    updateThoughtById({ params, body }, res) {
        Thought.findOneAndUpdate({_id: params.thoughtId}, body, {
            new: true,
            runValidators: true,
        })
        .then((dbUserData) => {
            if (!dbUserData) {
                res.status(404).json({message: 'No thought has been found with this id'});
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            return res.json(err);
        })
    },

    addThought({ params, body }, res) {
        Thought.create(body)
        .then(({_id}) => {
            return User.findOneAndUpdate(
                {_id: params.userId},
                {$push: {thoughts: _id}},
                {new: true}
            );
        })

        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({message: "Sorry! No user with this id has been found!"});
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(error);
            return res.json(err);
        })
    },

    removeThought({params}, res) {
        Thought.findOneAndDelete({_id: params.thoughtId})
        .then(deletedThought => {
            if (!deletedThought) {
                return res.status(404).json({message: "Sorry! No thought exists with this id!"});
            }
            return res.json(deletedThought)
        })
        .catch(err => {
            console.log(err);
            return res.json(err);
        })
    },

    addReaction({params, body}, res) {
        Thought.findOneAndUpdate(
            {_id: params.thoughtId},
            {$push: { reactions: body}},
            {new: true}
        )
        .then((dbThoughtData) => {
            if (!dbThoughtData) {
                res.status(404).json({message: "Sorry! No user has been found with that id"});
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.json(err));
    },

    removeReaction({params}, res) {
        Thought.findOneAndUpdate(
            {_id: params.thoughtId},
            {$pull: {reactions: {reactionId: params.reactionId}}},
            {new: true}
        )
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch(err => res.json('error'));
    }
};

module.exports = thoughtController;