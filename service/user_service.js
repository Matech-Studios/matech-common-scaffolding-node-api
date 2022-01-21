const bcrypt = require('bcrypt');
const User = require('../repository/models/user_model');

module.exports = {
    
    listActiveUsers: async () => {
        let users = await
            User
                .find({ 'status': true })
                .select({ name: 1, email: 1 });

        return users;
    },

    findByEmail: async (email) => {
        let result = await User.findOne({ email }, (err, user) => {
            if(err) {
                console.log(err);
                return null;
            }

            return user;
        });

        return result;
    },
    
    createUser: async (body) => {
    
        let hashedPassword = bcrypt.hashSync(body.password, 10);
        
        let user = new User({
            email:      body.email,
            name:       body.name,
            password:   hashedPassword
        });
    
        return await user.save();
    },

    updateUser: async (email, body) => {
        let user = await User.findOneAndUpdate({ 'email': email}, {
            $set: {
                name: body.name,
                password: body.password
            }
        }, {
            new: true
        });

        return user;
    },
    
    deactivateUser: async (email) => {
        
        let user = await User.findOneAndUpdate({ 'email': email }, {
            $set: {
                status: false
            }
        }, {
            new: true
        });
        
        return user;
    }
}