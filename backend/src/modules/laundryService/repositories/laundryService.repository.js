// import type { ILaundryService } from "../interfaces/ILaundryService.js";
import { LaundryService } from "../models/laundryService.model.js";
import { LaundryServiceCode } from "../constants/laundryServiceCode.js";
export class LaundryServiceRepository {
    /*
    |--------------------------------------------------------------------------
    | Create Laundry Service
    |--------------------------------------------------------------------------
    */
    async create(data) {
        return LaundryService.create(data);
    }
    /*
    |--------------------------------------------------------------------------
    | Find All Active Services
    |--------------------------------------------------------------------------
    */
    async findAllActive() {
        return LaundryService.find({
            isActive: true,
        }).sort({
            sortOrder: 1,
        });
    }
    /*
    |--------------------------------------------------------------------------
    | Find All Services
    |--------------------------------------------------------------------------
    */
    async findAll() {
        return LaundryService.find().sort({
            sortOrder: 1,
        });
    }
    /*
    |--------------------------------------------------------------------------
    | Find Service By ID
    |--------------------------------------------------------------------------
    */
    async findById(id) {
        return LaundryService.findById(id);
    }
    /*
    |--------------------------------------------------------------------------
    | Find Service By Code
    |--------------------------------------------------------------------------
    */
    async findByCode(code) {
        return LaundryService.findOne({
            code,
        });
    }
    /*
    |--------------------------------------------------------------------------
    | Update Service
    |--------------------------------------------------------------------------
    */
    async update(id, data) {
        return LaundryService.findByIdAndUpdate(id, {
            $set: data,
        }, {
            returnDocument: "after",
            runValidators: true,
        });
    }
    /*
    |--------------------------------------------------------------------------
    | Activate Service
    |--------------------------------------------------------------------------
    */
    async activate(id) {
        return LaundryService.findByIdAndUpdate(id, {
            $set: {
                isActive: true,
            },
        }, {
            returnDocument: "after",
            runValidators: true,
        });
    }
    /*
    |--------------------------------------------------------------------------
    | Deactivate Service
    |--------------------------------------------------------------------------
    */
    async deactivate(id) {
        return LaundryService.findByIdAndUpdate(id, {
            $set: {
                isActive: false,
            },
        }, {
            returnDocument: "after",
            runValidators: true,
        });
    }
}
export const laundryServiceRepository = new LaundryServiceRepository();
//# sourceMappingURL=laundryService.repository.js.map