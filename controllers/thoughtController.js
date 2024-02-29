const { Thought, User } = require("../models");
const thoughtController = {
  // get ALL thoughts
  async getThoughts(req, res) {
    try {
      const getallThoughts = await Thought.find({});
      res.json(getallThoughts);
    } catch (error) {
      res.status(404).json(err);
    }
  },

  // get ONE thought
  async getOneThought(req, res) {
    try {
      const getOneThought = await Thought.findOne({
        _id: req.params.thoughtId,
      }).select("-__v");
      res.status(200).json(getOneThought);
    } catch (error) {
      res.status(500).JSON();
    }
  },

  // create a thought and add to user
  async createThought(req, res) {
    try {
      const createThought = await Thought.create(req.body);
      const userUpdate = await User.findOneAndUpdate(
        { _id: req.body.userId },
        { $push: { thoughts: createThought._id } },
        { new: true }
      );
      res.json(userUpdate);
    } catch (error) {
      res.status(500).json();
    }
  },

  // delete a thought
  async deleteThought(req, res) {
    try {
      console.log(Thought);
      const deleteThought = await Thought.findOneAndDelete({
        _id: req.params.thoughtId,
      });

      const updateUser = await User.findOneAndUpdate(
        { thoughts: req.params.thoughtId },
        { $pull: { thoughts: req.params.thoughtId } },
        { runValidators: true, new: true }
      );
      res.json(updateUser);
    } catch (error) {
      console.error(error);
      res.status(500).json(error);
    }
  },

  // update a Thought
  async updateThought(req, res) {
    try {
      // findOne * update
      const updateThought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
        { runValidators: true, new: true }
      );
      res.status(200).json(updateThought);
    } catch (error) {
      res.status(500).json();
    }
  },

  // create a Reaction
  async createReaction(req, res) {
    try {
      // findOne * update (addtoSet)
      const createReaction = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body } },
        { runValidators: true, new: true }
      );

      if (!createReaction) {
        return res.status(404).json({ message: "No thought found" });
      }
      res.status(200).json(createReaction);
    } catch (error) {
      res.status(500).json();
    }
  },

  // delete a Reaction
  async deleteReaction(req, res) {
    try {
      // findOne * update
      const deleteReaction = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { reactionId: req.params.reactionId } } },
        { runValidators: true, new: true }
      );

      if (!deleteReaction) {
        return res
          .status(404)
          .json({ message: "No thought found with this Id" });
      }

      res.status(200).json(deleteReaction);
    } catch (error) {
      console.error(error);
      res.status(500).json();
    }
  },
};

module.exports = thoughtController;
