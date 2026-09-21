import { TurnaroundPlan } from "../models/turnaroundPlan.model.js";
import { TurnaroundPlanCode } from "../constants/turnaroundPlanCode.js";
export class TurnaroundPlanRepository {
    /*
    |--------------------------------------------------------------------------
    | Create Turnaround Plan
    |--------------------------------------------------------------------------
    */
    async create(data) {
        return TurnaroundPlan.create(data);
    }
    /*
    |--------------------------------------------------------------------------
    | Find All Active Plans
    |--------------------------------------------------------------------------
    */
    async findAllActive() {
        return TurnaroundPlan.find({
            isActive: true,
        }).sort({
            sortOrder: 1,
        });
    }
    /*
    |--------------------------------------------------------------------------
    | Find All Plans
    |--------------------------------------------------------------------------
    | Mainly useful for Admin.
    */
    async findAll() {
        return TurnaroundPlan.find().sort({
            sortOrder: 1,
        });
    }
    /*
    |--------------------------------------------------------------------------
    | Find Plan By ID
    |--------------------------------------------------------------------------
    */
    async findById(id) {
        return TurnaroundPlan.findById(id);
    }
    /*
    |--------------------------------------------------------------------------
    | Find Plan By Code
    |--------------------------------------------------------------------------
    */
    async findByCode(code) {
        return TurnaroundPlan.findOne({
            code,
        });
    }
    /*
    |--------------------------------------------------------------------------
    | Update Plan
    |--------------------------------------------------------------------------
    */
    async update(id, data) {
        return TurnaroundPlan.findByIdAndUpdate(id, data, {
            returnDocument: "after",
            runValidators: true,
        });
    }
    /*
    |--------------------------------------------------------------------------
    | Activate Plan
    |--------------------------------------------------------------------------
    */
    async activate(id) {
        return TurnaroundPlan.findByIdAndUpdate(id, {
            isActive: true,
        }, {
            returnDocument: "after",
        });
    }
    /*
    |--------------------------------------------------------------------------
    | Deactivate Plan
    |--------------------------------------------------------------------------
    */
    async deactivate(id) {
        return TurnaroundPlan.findByIdAndUpdate(id, {
            isActive: false,
        }, {
            returnDocument: "after",
        });
    }
}
export const turnaroundPlanRepository = new TurnaroundPlanRepository();
//# sourceMappingURL=turnaroundPlan.repository.js.map