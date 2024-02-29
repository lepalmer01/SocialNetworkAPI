const { Thought, User } = require("../models");
const userController = {
  async getUsers(req, res) {
    try {
      const allUsers = await User.find().select("-__v"); // v is the most up to date version of whatever has been updated
      res.status(200).json(allUsers);
    } catch (error) {
      res.status(500).json();
    }
  },
  async getOneUser(req, res) {
    try {
      const oneUser = await User.findOne({ _id: req.params.userId })
        .select("-__v")
        .populate("friends")
        .populate("thoughts");
      res.status(200).json(oneUser);
    } catch (error) {
      res.status(500).json();
    }
  },
  async createUser(req, res) {
    try {
      const user = await User.create(req.body);
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json();
    }
  },
  async updateUser(req, res) {
    try {
      // findOne * update
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $set: req.body },
        { runValidators: true, new: true }
      );
      res.status(200).json(user)
    } catch (error) {
      res.status(500).json();
    }
  },


  async deleteUser(req, res) {
    try {
      const user = await User.findOneAndDelete({ _id: req.params.userId });

      if (!user) {
        return res.status(404).json({ message: "No user found with that id" });
      }
      Thought.deleteMany({ _id: { $in: user.thoughts } });

      res.status(200).json(user)
    } catch (error) {
      console.error(error)
      res.status(500).json();
    }
  },

  async addFriend(req, res) {
    try {
      // findOne * update (addtoSet)
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $addToSet: { friends: req.params.friendId } },
        { runValidators: true, new: true }
      );

      if (!user) {
        return res.status(404).json({ message: "No user found" });
      }
      res.status(200).json(user)
    } catch (error) {
      res.status(500).json();
    }
  },


  async deleteFriend(req, res) {
    try {
      // findOne * update
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $pull: { friends: req.params.friendId } },
        { runValidators: true, new: true }
      );

      if (!user) {
        return res.status(404).json({ message: "No user found" });
      }
      res.status(200).json(user)
    } catch (error) {
      res.status(500).json();
    }
  },
};

module.exports = userController;
