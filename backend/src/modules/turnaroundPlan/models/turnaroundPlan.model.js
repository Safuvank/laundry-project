import mongoose, { Schema } from "mongoose";
import { TurnaroundPlanCode } from "../constants/turnaroundPlanCode.js";
import { PricingType } from "../constants/pricingType.js";
import { PricingAdjustmentType } from "../../pricing/constants/pricingAdjustmentType.js";
const turnaroundPlanSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    code: {
        type: String,
        enum: Object.values(TurnaroundPlanCode),
        required: true,
        unique: true,
        uppercase: true,
        trim: true,
    },
    description: {
        type: String,
        default: "",
        trim: true,
    },
    minHours: {
        type: Number,
        required: true,
        min: 0,
    },
    maxHours: {
        type: Number,
        required: true,
        min: 0,
    },
    pricingType: {
        type: String,
        enum: Object.values(PricingType),
        required: true,
        default: PricingType.NONE,
    },
    adjustmentType: {
        type: String,
        enum: Object.values(PricingAdjustmentType),
        required: true,
    },
    priceAdjustment: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    sortOrder: {
        type: Number,
        default: 0,
        min: 0,
    },
}, {
    timestamps: true,
});
turnaroundPlanSchema.index({
    isActive: 1,
    sortOrder: 1,
});
export const TurnaroundPlan = mongoose.model("TurnaroundPlan", turnaroundPlanSchema);
//# sourceMappingURL=turnaroundPlan.model.js.map