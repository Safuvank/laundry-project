import mongoose from "mongoose";
import type { ILaundryService } from "../interfaces/ILaundryService.js";
export declare class LaundryServiceService {
    private validateObjectId;
    private getServiceOrFail;
    create(data: Partial<ILaundryService>): Promise<mongoose.Document<unknown, {}, ILaundryService, {}, mongoose.DefaultSchemaOptions> & ILaundryService & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    getActiveServices(): Promise<(mongoose.Document<unknown, {}, ILaundryService, {}, mongoose.DefaultSchemaOptions> & ILaundryService & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    getAll(): Promise<(mongoose.Document<unknown, {}, ILaundryService, {}, mongoose.DefaultSchemaOptions> & ILaundryService & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    getById(id: string): Promise<ILaundryService>;
    update(id: string, data: Partial<ILaundryService>): Promise<mongoose.Document<unknown, {}, ILaundryService, {}, mongoose.DefaultSchemaOptions> & ILaundryService & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    activate(id: string): Promise<mongoose.Document<unknown, {}, ILaundryService, {}, mongoose.DefaultSchemaOptions> & ILaundryService & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    deactivate(id: string): Promise<mongoose.Document<unknown, {}, ILaundryService, {}, mongoose.DefaultSchemaOptions> & ILaundryService & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
}
export declare const laundryServiceService: LaundryServiceService;
//# sourceMappingURL=laundryService.service.d.ts.map