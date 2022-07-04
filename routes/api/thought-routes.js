const router = require('express').Router();

const {
    getAllThoughts,
    getThoughtById,
    updateThoughtById,
    addThought,
    removeThought,
    addReaction,
    removeReaction
} = require('../../controllers/thought-controller');

router.route('/').get(getAllThoughts);

router.route('/:thoughtId').get(getThoughtById).put(updateThoughtById).delete(removeThought);

router.route('/:userId').post(addThought);

router.route('/:thoughtId/reactions').post(addReaction);

router.route('/:thoughtId/reactions/:reactionId').delete(removeReaction);

module.exports = router;
