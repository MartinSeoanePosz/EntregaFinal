import { UserRepository } from '../repositories/userRepository.js';
import { MAILER } from '../config/indexconfig.js';
import MailingService from '../services/mailing.js';
import { addLogger } from '../middleware/index.js'; 
import { get } from 'mongoose';

const userRepository = new UserRepository(); 
const mailingService = new MailingService();

const userController = {
  premiumRole: async (req, res) => {
    const uid = req.params.uid;
    try {
      const response = await userRepository.upgradeToPremium(uid); 
      res.json(response);
    } catch (error) {
      req.logger.warn(error.stack || error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  deleteUserByEmail: async (req, res, next) => {
    const { email } = req.params;
    try {
        const deletedUser = await userRepository.deleteUserByEmail(email);
        if (!deletedUser) {
            return res.status(404).json({ error: "User not found" });
        }
        return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
  },
  setLastConnection: async (email) => {
    try {
        const user = await userRepository.getUserByEmail(email);
        if( !user ) throw new Error('User not found');
        await userRepository.setLastConnection(user);
    } catch (error) {
        console.error("Error updating last Connection:", error);
        throw new Error(error);
    }
  },
  getAllUsers: async (req, res) => {
    try {
      const users = await userRepository.getAllandDisplay();
      res.render(
        'users', 
        { 
          title: 'Users', 
          style: '../../css/users.css',
          users: users 
        }
      );
    } catch (error) {
      console.error("Error getting all users:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
  deleteOldUsers: async (req, res) => {
    try {
      const users = await userRepository.getAll();
      const now = new Date();

      for (const user of users) {
        if (!user.lastConnection || (now - new Date(user.lastConnection)) > (2 * 24 * 60 * 60 * 1000)) {
          const mailOptions = {
            from: MAILER.user,
            to: user.email,
            subject: 'Account Deletion Notification',
            html: `<p>Dear ${user.firstName},</p>
                   <p>Your account has been deleted due to inactivity.</p>
                   <p>If you believe this is in error or have any questions, please contact support.</p>
                   <p>Thank you,</p>
                   <p>Computer Store Team</p>`
          };
          await mailingService.outboundEmail(mailOptions);
          await userRepository.deleteUserByEmail(user.email);
        }
      }

      return res.status(200).json({ message: "Old inactive users deleted successfully" });
    } catch (error) {
      console.error("Error deleting old inactive users:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
  deleteUser: async (req, res) => {
    try{
      const user = await userRepository.getUserByEmail(req.params.email);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      } else {
        const mailOptions = {
          from: MAILER.user,
          to: user.email,
          subject: 'Account Deletion Notification',
          html: `<p>Dear ${user.firstName},</p>
                 <p>Your account has been deleted due to inactivity.</p>
                 <p>If you believe this is in error or have any questions, please contact support.</p>
                 <p>Thank you,</p>
                 <p>Computer Store Team</p>`
        };
        await mailingService.outboundEmail(mailOptions);
        await userRepository.deleteUserByEmail(user.email);
      }
      return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },


};

export default userController;