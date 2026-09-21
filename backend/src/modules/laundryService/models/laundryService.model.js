import mongoose, { Schema } from "mongoose";
import { LaundryServiceCode } from "../constants/laundryServiceCode.js";
import { PricingMode } from "../constants/pricingMode.js";
const laundryServiceSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    code: {
        type: String,
        enum: Object.values(LaundryServiceCode),
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
    pricingMode: {
        type: String,
        enum: Object.values(PricingMode),
        required: true,
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
/*
|--------------------------------------------------------------------------
| Indexes
|--------------------------------------------------------------------------
*/
laundryServiceSchema.index({
    isActive: 1,
    sortOrder: 1,
});
export const LaundryService = mongoose.model("LaundryService", laundryServiceSchema);
//# sourceMappingURL=laundryService.model.js.map