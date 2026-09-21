import mongoose from "mongoose";
import type { ITurnaroundPlan } from "../interfaces/ITurnaroundPlan.js";
export declare const TurnaroundPlan: mongoose.Model<ITurnaroundPlan, {}, {}, {}, mongoose.Document<unknown, {}, ITurnaroundPlan, {}, mongoose.DefaultSchemaOptions> & ITurnaroundPlan & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ITurnaroundPlan>;
//# sourceMappingURL=turnaroundPlan.model.d.ts.map