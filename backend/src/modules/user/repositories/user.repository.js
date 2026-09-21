import { User } from "../../auth/models/user.model.js";
export class UserRepository {
    /*
    |--------------------------------------------------------------------------
    | Create User
    |--------------------------------------------------------------------------
    */
    async create(data) {
        return User.create(data);
    }
    /*
    |--------------------------------------------------------------------------
    | Find User By Email
    |--------------------------------------------------------------------------
    */
    async findByEmail(email) {
        return User.findOne({
            email: email.toLowerCase().trim(),
        });
    }
    /*
    |--------------------------------------------------------------------------
    | Find User By ID
    |--------------------------------------------------------------------------
    */
    async findById(userId) {
        return User.findById(userId).select("-password");
    }
    /*
    |--------------------------------------------------------------------------
    | Update Profile
    |--------------------------------------------------------------------------
    */
    async updateProfile(userId, data) {
        return User.findByIdAndUpdate(userId, data, {
            new: true,
            runValidators: true,
        }).select("-password");
    }
    /*
    |--------------------------------------------------------------------------
    | Update Password
    |--------------------------------------------------------------------------
    */
    async updatePassword(userId, password) {
        return User.findByIdAndUpdate(userId, {
            password,
        }, {
            new: true,
            runValidators: true,
        }).select("-password");
    }
    /*
    |--------------------------------------------------------------------------
    | Update Profile Image
    |--------------------------------------------------------------------------
    */
    async updateProfileImage(userId, profileImage) {
        return User.findByIdAndUpdate(userId, {
            profileImage,
        }, {
            new: true,
            runValidators: true,
        }).select("-password");
    }
    /*
    |--------------------------------------------------------------------------
    | Soft Delete Account
    |--------------------------------------------------------------------------
    */
    async softDelete(userId) {
        return User.findByIdAndUpdate(userId, {
            accountStatus: "SUSPENDED",
        }, {
            new: true,
            runValidators: true,
        }).select("-password");
    }
}
export const userRepository = new UserRepository();
//# sourceMappingURL=user.repository.js.map