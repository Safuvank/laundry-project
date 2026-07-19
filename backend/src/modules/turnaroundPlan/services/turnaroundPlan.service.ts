import { turnaroundPlanRepository } from "../repositories/turnaroundPlan.repository.js";

import { TurnaroundPlanCode } from "../constants/turnaroundPlanCode.js";
import { PricingType } from "../constants/pricingType.js";

import { NotFoundError } from "../../../shared/errors/NotFoundErrror.js";
import { ValidationError } from "../../../shared/errors/ValidationError.js";

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

export class TurnaroundPlanService {
  /*
  |--------------------------------------------------------------------------
  | Private Helper - Get Plan Or Fail
  |--------------------------------------------------------------------------
  */

  private async getPlanOrFail(id: string) {
    const plan = await turnaroundPlanRepository.findById(id);

    if (!plan) {
      throw new NotFoundError("Turnaround plan not found.");
    }

    return plan;
  }

  /*
  |--------------------------------------------------------------------------
  | Create Turnaround Plan
  |--------------------------------------------------------------------------
  */

  async create(data: CreateTurnaroundPlanData) {
    /*
     * Validate turnaround hours
     */

    if (data.minHours > data.maxHours) {
      throw new ValidationError(
        "Minimum turnaround hours cannot be greater than maximum turnaround hours.",
      );
    }

    /*
     * Validate pricing
     */

    this.validatePricing(data.pricingType, data.priceAdjustment);

    /*
     * Prevent duplicate code
     */

    const existingPlan = await turnaroundPlanRepository.findByCode(data.code);

    if (existingPlan) {
      throw new ValidationError(
        `Turnaround plan with code ${data.code} already exists.`,
      );
    }

    /*
     * Build data without explicitly passing undefined
     *
     * Important because your project uses:
     * exactOptionalPropertyTypes: true
     */

    const createData: CreateTurnaroundPlanData = {
      name: data.name,
      code: data.code,
      minHours: data.minHours,
      maxHours: data.maxHours,
      pricingType: data.pricingType,
      priceAdjustment: data.priceAdjustment,
    };

    if (data.description !== undefined) {
      createData.description = data.description;
    }

    if (data.isActive !== undefined) {
      createData.isActive = data.isActive;
    }

    if (data.sortOrder !== undefined) {
      createData.sortOrder = data.sortOrder;
    }

    return turnaroundPlanRepository.create(createData);
  }

  /*
  |--------------------------------------------------------------------------
  | Get Active Turnaround Plans
  |--------------------------------------------------------------------------
  | Used by customers during booking.
  */

  async getActivePlans() {
    return turnaroundPlanRepository.findAllActive();
  }

  /*
  |--------------------------------------------------------------------------
  | Get All Turnaround Plans
  |--------------------------------------------------------------------------
  | Used mainly by Admin.
  */

  async getAllPlans() {
    return turnaroundPlanRepository.findAll();
  }

  /*
  |--------------------------------------------------------------------------
  | Get Turnaround Plan By ID
  |--------------------------------------------------------------------------
  */

  async getById(id: string) {
    return this.getPlanOrFail(id);
  }

  /*
  |--------------------------------------------------------------------------
  | Update Turnaround Plan
  |--------------------------------------------------------------------------
  */

  async update(id: string, data: UpdateTurnaroundPlanData) {
    const existingPlan = await this.getPlanOrFail(id);

    /*
     * Determine final hours after update.
     *
     * Example:
     *
     * Existing:
     * minHours = 3
     * maxHours = 6
     *
     * Request:
     * { minHours: 8 }
     *
     * Final would become:
     * minHours = 8
     * maxHours = 6
     *
     * That must be rejected.
     */

    const finalMinHours = data.minHours ?? existingPlan.minHours;

    const finalMaxHours = data.maxHours ?? existingPlan.maxHours;

    if (finalMinHours > finalMaxHours) {
      throw new ValidationError(
        "Minimum turnaround hours cannot be greater than maximum turnaround hours.",
      );
    }

    /*
     * Determine final pricing configuration.
     */

    const finalPricingType = data.pricingType ?? existingPlan.pricingType;

    const finalPriceAdjustment =
      data.priceAdjustment ?? existingPlan.priceAdjustment;

    this.validatePricing(finalPricingType, finalPriceAdjustment);

    /*
     * Build update object safely.
     *
     * We don't send undefined values to Mongoose.
     */

    const updateData: UpdateTurnaroundPlanData = {};

    if (data.name !== undefined) {
      updateData.name = data.name;
    }

    if (data.description !== undefined) {
      updateData.description = data.description;
    }

    if (data.minHours !== undefined) {
      updateData.minHours = data.minHours;
    }

    if (data.maxHours !== undefined) {
      updateData.maxHours = data.maxHours;
    }

    if (data.pricingType !== undefined) {
      updateData.pricingType = data.pricingType;
    }

    if (data.priceAdjustment !== undefined) {
      updateData.priceAdjustment = data.priceAdjustment;
    }

    if (data.sortOrder !== undefined) {
      updateData.sortOrder = data.sortOrder;
    }

    return turnaroundPlanRepository.update(id, updateData);
  }

  /*
  |--------------------------------------------------------------------------
  | Activate Turnaround Plan
  |--------------------------------------------------------------------------
  */

  async activate(id: string) {
    const plan = await this.getPlanOrFail(id);

    if (plan.isActive) {
      throw new ValidationError("Turnaround plan is already active.");
    }

    return turnaroundPlanRepository.activate(id);
  }

  /*
  |--------------------------------------------------------------------------
  | Deactivate Turnaround Plan
  |--------------------------------------------------------------------------
  */

  async deactivate(id: string) {
    const plan = await this.getPlanOrFail(id);

    if (!plan.isActive) {
      throw new ValidationError("Turnaround plan is already inactive.");
    }

    return turnaroundPlanRepository.deactivate(id);
  }

  /*
  |--------------------------------------------------------------------------
  | Private Helper - Validate Pricing
  |--------------------------------------------------------------------------
  */

  private validatePricing(pricingType: PricingType, priceAdjustment: number) {
    /*
     * Price cannot be negative.
     */

    if (priceAdjustment < 0) {
      throw new ValidationError("Price adjustment cannot be negative.");
    }

    /*
     * NONE means no surcharge.
     */

    if (pricingType === PricingType.NONE && priceAdjustment !== 0) {
      throw new ValidationError(
        "Price adjustment must be 0 when pricing type is NONE.",
      );
    }

    /*
     * Percentage validation
     */

    if (pricingType === PricingType.PERCENTAGE && priceAdjustment > 100) {
      throw new ValidationError(
        "Percentage price adjustment cannot exceed 100.",
      );
    }
  }
}

export const turnaroundPlanService = new TurnaroundPlanService();
