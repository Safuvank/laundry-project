import type { ILaundryService } from "../interfaces/ILaundryService.js";
import { LaundryServiceCode } from "../constants/laundryServiceCode.js";
export declare class LaundryServiceRepository {
    create(data: Partial<ILaundryService>): Promise<import("mongoose").Document<unknown, {}, ILaundryService, {}, import("mongoose").DefaultSchemaOptions> & ILaundryService & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    findAllActive(): Promise<(import("mongoose").Document<unknown, {}, ILaundryService, {}, import("mongoose").DefaultSchemaOptions> & ILaundryService & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    findAll(): Promise<(import("mongoose").Document<unknown, {}, ILaundryService, {}, import("mongoose").DefaultSchemaOptions> & ILaundryService & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    findById(id: string): Promise<ILaundryService | null>;
    findByCode(code: LaundryServiceCode): Promise<(import("mongoose").Document<unknown, {}, ILaundryService, {}, import("mongoose").DefaultSchemaOptions> & ILaundryService & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    update(id: string, data: Partial<ILaundryService>): Promise<(import("mongoose").Document<unknown, {}, ILaundryService, {}, import("mongoose").DefaultSchemaOptions> & ILaundryService & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    activate(id: string): Promise<(import("mongoose").Document<unknown, {}, ILaundryService, {}, import("mongoose").DefaultSchemaOptions> & ILaundryService & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    deactivate(id: string): Promise<(import("mongoose").Document<unknown, {}, ILaundryService, {}, import("mongoose").DefaultSchemaOptions> & ILaundryService & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
}
export declare const laundryServiceRepository: LaundryServiceRepository;
//# sourceMappingURL=laundryService.repository.d.ts.map