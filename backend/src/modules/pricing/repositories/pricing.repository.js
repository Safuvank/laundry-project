// import type { IPricingRule } from "../interfaces/IPricingRule.js";
import { PricingRule } from "../models/pricingRule.model.js";
import { PricingType } from "../constants/pricingType.js";
class PricingRepository {
    /**
     * Create Pricing Rule
     */
    async create(data) {
        return PricingRule.create(data);
    }
    /**
     * Get All Active Pricing Rules
     */
    async findAllActive() {
        return PricingRule.find({
            isActive: true,
        })
            .populate("laundryServiceId")
            .sort({
            createdAt: -1,
        });
    }
    /**
     * Get All Pricing Rules
     */
    async findAll() {
        return PricingRule.find().populate("laundryServiceId").sort({
            createdAt: -1,
        });
    }
    /**
     * Find Pricing Rule By ID
     */
    async findById(id) {
        return PricingRule.findById(id).populate("laundryServiceId");
    }
    /**
     * Find Pricing Rules By Laundry Service
     */
    async findByLaundryService(laundryServiceId) {
        return PricingRule.find({
            laundryServiceId,
            isActive: true,
        }).sort({
            pricingType: 1,
        });
    }
    /**
     * Find Pricing Rule By Laundry Service + Pricing Type
     */
    async findByLaundryServiceAndType(laundryServiceId, pricingType) {
        return PricingRule.findOne({
            laundryServiceId,
            pricingType,
            isActive: true,
        });
    }
    /**
     * Update Pricing Rule
     */
    async update(id, data) {
        return PricingRule.findByIdAndUpdate(id, data, {
            returnDocument: "after",
            runValidators: true,
        });
    }
    /**
     * Activate Pricing Rule
     */
    async activate(id) {
        return PricingRule.findByIdAndUpdate(id, {
            isActive: true,
        }, {
            returnDocument: "after",
        });
    }
    /**
     * Deactivate Pricing Rule
     */
    async deactivate(id) {
        return PricingRule.findByIdAndUpdate(id, {
            isActive: false,
        }, {
            returnDocument: "after",
        });
    }
}
export const pricingRepository = new PricingRepository();
//# sourceMappingURL=pricing.repository.js.map