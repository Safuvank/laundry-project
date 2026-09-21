import mongoose from "mongoose";
import type { ILaundryService } from "../interfaces/ILaundryService.js";
export declare const LaundryService: mongoose.Model<ILaundryService, {}, {}, {}, mongoose.Document<unknown, {}, ILaundryService, {}, mongoose.DefaultSchemaOptions> & ILaundryService & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ILaundryService>;
//# sourceMappingURL=laundryService.model.d.ts.map