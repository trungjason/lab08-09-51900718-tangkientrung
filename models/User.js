const mongoose = require('mongoose');
const { connection } = require('../database/database-connection');
const bcrypt = require('bcrypt');

const UserSchema = mongoose.Schema({
    username: { type: 'string', required: true, unique: true },
    email: { type: 'string', required: true, unique: true },
    password: { type: 'string', required: true },
});

UserSchema.pre('save', function(next) {
    try {
        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);

        const hashedPassword = bcrypt.hashSync(this.password, salt);

        this.password = hashedPassword;
        next();
    } catch (err) {
        next(err);
    }
})

// Khoong dungf arrow function vi se sai tu khoa this khong tro den duoc
UserSchema.methods.verifyPassword = function(plainTextPassword) {
    try {
        return bcrypt.compareSync(plainTextPassword, this.password);
    } catch (err) {
        return false;
    }
};

module.exports = mongoose.model('User', UserSchema);