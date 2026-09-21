import type { ITurnaroundPlan } from "../interfaces/ITurnaroundPlan.js";
import { TurnaroundPlanCode } from "../constants/turnaroundPlanCode.js";
export declare class TurnaroundPlanRepository {
    create(data: Partial<ITurnaroundPlan>): Promise<import("mongoose").Document<unknown, {}, ITurnaroundPlan, {}, import("mongoose").DefaultSchemaOptions> & ITurnaroundPlan & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    findAllActive(): Promise<(import("mongoose").Document<unknown, {}, ITurnaroundPlan, {}, import("mongoose").DefaultSchemaOptions> & ITurnaroundPlan & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    findAll(): Promise<(import("mongoose").Document<unknown, {}, ITurnaroundPlan, {}, import("mongoose").DefaultSchemaOptions> & ITurnaroundPlan & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    findById(id: string): Promise<(import("mongoose").Document<unknown, {}, ITurnaroundPlan, {}, import("mongoose").DefaultSchemaOptions> & ITurnaroundPlan & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    findByCode(code: TurnaroundPlanCode): Promise<(import("mongoose").Document<unknown, {}, ITurnaroundPlan, {}, import("mongoose").DefaultSchemaOptions> & ITurnaroundPlan & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    update(id: string, data: Partial<ITurnaroundPlan>): Promise<(import("mongoose").Document<unknown, {}, ITurnaroundPlan, {}, import("mongoose").DefaultSchemaOptions> & ITurnaroundPlan & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    activate(id: string): Promise<(import("mongoose").Document<unknown, {}, ITurnaroundPlan, {}, import("mongoose").DefaultSchemaOptions> & ITurnaroundPlan & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    deactivate(id: string): Promise<(import("mongoose").Document<unknown, {}, ITurnaroundPlan, {}, import("mongoose").DefaultSchemaOptions> & ITurnaroundPlan & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
}
export declare const turnaroundPlanRepository: TurnaroundPlanRepository;
//# sourceMappingURL=turnaroundPlan.repository.d.ts.map