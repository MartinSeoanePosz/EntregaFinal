import passport from 'passport';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import User from '../dao/models/users.js';
import { CartRepository } from '../repositories/cartRepository.js';
import { ProductRepository } from '../repositories/productRepository.js';
import { hashPassword, isValidPassword } from '../fileUtils.js';
import { UserDTO } from '../dao/dto/userDTO.js';
import { addLogger } from '../middleware/index.js'
import { MAILER } from '../config/indexconfig.js';
import MailingService from '../services/mailing.js';
import Document from '../dao/models/documents.js';
import { UserRepository } from '../repositories/userRepository.js';

const cartRepository = new CartRepository();
const productManager = new ProductRepository();
const mailingService = new MailingService();
const userRepository = new UserRepository();

const sessionController = {
  login: async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await User.findOne({ email });

        if (!result || !isValidPassword(result.password, password)) {
            req.logger.warn(`Failed login attempt for email: ${email}`);
            return res.status(400).json({ error: "Wrong credentials" });
        }

        let cart = await cartRepository.getById(result.cart);
        if (!cart) {
            const newCart = await cartRepository.add({ userId: result._id });
            cart = newCart;
        }
        if (!result.cart.includes(cart._id)) {
            result.cart.push(cart._id)
            await result.save();
        }
        req.session.cartId = cart._id;
        req.session.user = email;
        req.session.role = result.role;
        res.cookie('userData', JSON.stringify({ user: email, role: result.role, cart: req.session.cartId }), { httpOnly: true, maxAge: 20000 });

        return res.status(200).json({
            status: "ok",
            role: result.role
        });
    } catch (error) {
        req.logger.error(error.stack || error.message);
        return res.status(400).json({ error: "Wrong credentials" });
    }
},
  signup: (req, res, next) => {
    passport.authenticate("register", (error, user, info) => {
      if (error) {
        req.logger.error(error.stack || error.message);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      if (!user) {
        return res.status(400).json({ error: "User already exists" });
      }
      return res.status(201).json({ respuesta: "User created successfully" });
    })(req, res, next);
  },

  logout: (req, res) => {
    console.log('Logging out user:', req.session.user);
    req.session.destroy((error) => {
      if (error) {
        req.logger.debug(error.stack || error.message);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.redirect('/login');
      }
    });
  },

  failRegister: (req, res) => {
    res.status(400).json({
      error: "Error creating user",
    });
  },

  githubLogin: (req, res) => {
  },

  githubCallback: (req, res) => {
    const email = req.user.email;
    const role = req.user.role;

    req.session.user = email;
    req.session.role = role;

    res.cookie('userData', JSON.stringify({ user: email, role: role }), { httpOnly: true, maxAge: 20000 });

    res.redirect("/products");
  },

  getCurrentUser: async (req, res) => {
    try {
      if (!req.session.user) {
        return res.status(401).json({ error: "User not logged in" });
      }
  
      const currentUser = await User.findOne({ email: req.session.user });
  
      if (!currentUser) {
        return res.status(404).json({ error: "User not found" });
      }
  
      const cart = await cartRepository.getById(currentUser.cart);
  
      const userInfo = new UserDTO(currentUser);
  
      res.render('current', { title: 'Current', style: '../css/current.css', userInfo });
    } catch (error) {
      req.logger.http(error.stack || error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  modifyProducts: async (req, res) => {
    const products = await productManager.getAll();
    res.render("realtime", {
      title: "Add or remove products",
      products: products,
      style: "../css/products.css",
    });
  },
  forgotPassword: async (req, res) => {
    const { email } = req.body;    
    try {
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(400).json({ message: 'User with this email does not exist' });
      }
      const token = crypto.randomBytes(20).toString('hex');
      user.resetPasswordToken = token;
      user.resetPasswordExpires = Date.now() + 3600000;

      await user.save();
      const resetUrl = `http://${req.headers.host}/reset-password/${token}`;

      const mailOptions = {
        from: MAILER.user,
        to: email,
        subject: 'Password reset',
        html: `<p>You requested a password reset. Click the link to reset your password: <a href="${resetUrl}">${resetUrl}</a></p>`
      };
      await mailingService.outboundEmail(mailOptions);
      res.status(200).json({ message: 'Email sent' });
    } 
    catch (error) {
      req.logger.error(error.stack || error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  resetPassword: async (req, res) => {
    const { newPassword } = req.body;
    const { token } = req.params;
    try {
        const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
        console.log("user:", user)
        if (!user) {
            return res.status(400).json({ message: 'Password reset token is invalid or has expired' });
        }

        const isMatch = await bcrypt.compare(newPassword, user.password);
        if (isMatch) {
            return res.status(400).json({ message: 'New password cannot be the same as the old password' });
        }

        user.password = hashPassword(newPassword);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();
        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  renderResetPasswordForm: async (req, res) => {
    const { token } = req.params;
    try {
        const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
        if (!user) {
            return res.status(400).json({ message: 'Password reset token is invalid or has expired' });
        }
        res.render('passwordReset', { title: 'PasswordReset', style: '/css/login.css', token: token }); 
    } catch (error) {
        console.error('Error rendering password reset form:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  uploadDocument: async (req, res) => {
    try {
        const userEmail = req.session.user; 
        const user = await userRepository.getUserByEmail(userEmail);

        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }

        const file = req.file;

        const document = new Document({
            path: file.path,
            originalName: file.originalname,
            mimeType: file.mimetype,
            size: file.size
        });

        const savedDocument = await document.save();

        user.documents = user.documents || [];

        user.documents.push(savedDocument._id);

        await user.save();

        res.status(200).json({ 
            message: "File uploaded successfully", 
            filePath: file.path, 
            fileName: file.originalname 
        });
    } catch (error) {
        console.error("Error uploading file:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
};


export default sessionController;
