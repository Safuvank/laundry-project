import { TurnaroundPlanCode } from "../constants/turnaroundPlanCode.js";
import { PricingType } from "../constants/pricingType.js";
type CreateTurnaroundPlanData = {
    name: string;
    code: TurnaroundPlanCode;
    description?: string;
    minHours: number;
    maxHours: number;
    pricingType: PricingType;
    priceAdjustment: number;
    isActive?: boolean;
    sortOrder?: number;
};
type UpdateTurnaroundPlanData = {
    name?: string;
    description?: string;
    minHours?: number;
    maxHours?: number;
    pricingType?: PricingType;
    priceAdjustment?: number;
    sortOrder?: number;
};
export declare class TurnaroundPlanService {
    private getPlanOrFail;
    create(data: CreateTurnaroundPlanData): Promise<import("mongoose").Document<unknown, {}, import("../interfaces/ITurnaroundPlan.js").ITurnaroundPlan, {}, import("mongoose").DefaultSchemaOptions> & import("../interfaces/ITurnaroundPlan.js").ITurnaroundPlan & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    getActivePlans(): Promise<(import("mongoose").Document<unknown, {}, import("../interfaces/ITurnaroundPlan.js").ITurnaroundPlan, {}, import("mongoose").DefaultSchemaOptions> & import("../interfaces/ITurnaroundPlan.js").ITurnaroundPlan & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    getAllPlans(): Promise<(import("mongoose").Document<unknown, {}, import("../interfaces/ITurnaroundPlan.js").ITurnaroundPlan, {}, import("mongoose").DefaultSchemaOptions> & import("../interfaces/ITurnaroundPlan.js").ITurnaroundPlan & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    getById(id: string): Promise<import("mongoose").Document<unknown, {}, import("../interfaces/ITurnaroundPlan.js").ITurnaroundPlan, {}, import("mongoose").DefaultSchemaOptions> & import("../interfaces/ITurnaroundPlan.js").ITurnaroundPlan & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    update(id: string, data: UpdateTurnaroundPlanData): Promise<(import("mongoose").Document<unknown, {}, import("../interfaces/ITurnaroundPlan.js").ITurnaroundPlan, {}, import("mongoose").DefaultSchemaOptions> & import("../interfaces/ITurnaroundPlan.js").ITurnaroundPlan & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    activate(id: string): Promise<(import("mongoose").Document<unknown, {}, import("../interfaces/ITurnaroundPlan.js").ITurnaroundPlan, {}, import("mongoose").DefaultSchemaOptions> & import("../interfaces/ITurnaroundPlan.js").ITurnaroundPlan & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    deactivate(id: string): Promise<(import("mongoose").Document<unknown, {}, import("../interfaces/ITurnaroundPlan.js").ITurnaroundPlan, {}, import("mongoose").DefaultSchemaOptions> & import("../interfaces/ITurnaroundPlan.js").ITurnaroundPlan & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    private validatePricing;
}
export declare const turnaroundPlanService: TurnaroundPlanService;
export {};
//# sourceMappingURL=turnaroundPlan.service.d.ts.map