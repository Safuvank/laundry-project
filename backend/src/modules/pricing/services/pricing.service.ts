import { Types } from "mongoose";

import { pricingRepository } from "../repositories/pricing.repository.js";

import { laundryServiceRepository } from "../../laundryService/repositories/laundryService.repository.js";

import { NotFoundError } from "../../../shared/errors/NotFoundErrror.js";
import { ValidationError } from "../../../shared/errors/ValidationError.js";

import type { IPricingRule } from "../interfaces/IPricingRule.js";

export class PricingService {
  /* -------------------------------------------------------------------------- */
  /*                              Private Helpers                              */
  /* -------------------------------------------------------------------------- */

  /**
   * Validate Pricing Rule ID
   */
  private validateObjectId(id: string): void {
    if (!Types.ObjectId.isValid(id)) {
      throw new ValidationError("Invalid pricing rule id.");
    }
  }

  /**
   * Get Pricing Rule or Throw Error
   */
  private async getPricingRuleOrFail(id: string): Promise<IPricingRule> {
    this.validateObjectId(id);

    const pricingRule = await pricingRepository.findById(id);

    if (!pricingRule) {
      throw new NotFoundError("Pricing rule not found.");
    }

    return pricingRule;
  }

  /* -------------------------------------------------------------------------- */
  /*                              Admin APIs                                   */
  /* -------------------------------------------------------------------------- */

  /**
   * Create Pricing Rule
   */
  async create(data: Partial<IPricingRule>) {
    /* ---------------------------------------------------------------------- */
    /* Validate Laundry Service ID                                            */
    /* ---------------------------------------------------------------------- */

    if (!data.laundryServiceId) {
      throw new ValidationError("Laundry service id is required.");
    }

    const laundryServiceId = data.laundryServiceId.toString();

    if (!Types.ObjectId.isValid(laundryServiceId)) {
      throw new ValidationError("Invalid laundry service id.");
    }

    /* ---------------------------------------------------------------------- */
    /* Check Laundry Service Exists                                           */
    /* ---------------------------------------------------------------------- */

    const laundryService =
      await laundryServiceRepository.findById(laundryServiceId);

    if (!laundryService) {
      throw new NotFoundError("Laundry service not found.");
    }

    /* ---------------------------------------------------------------------- */
    /* Check Laundry Service Is Active                                        */
    /* ---------------------------------------------------------------------- */

    if (!laundryService.isActive) {
      throw new ValidationError("Laundry service is inactive.");
    }

    /* ---------------------------------------------------------------------- */
    /* Validate Pricing Type                                                  */
    /* ---------------------------------------------------------------------- */

    if (!data.pricingType) {
      throw new ValidationError("Pricing type is required.");
    }

    /* ---------------------------------------------------------------------- */
    /* Prevent Duplicate Pricing Type                                         */
    /* ---------------------------------------------------------------------- */

    const existingRule = await pricingRepository.findByLaundryServiceAndType(
      laundryServiceId,
      data.pricingType,
    );

    if (existingRule) {
      throw new ValidationError(
        "Pricing rule already exists for this laundry service.",
      );
    }

    /* ---------------------------------------------------------------------- */
    /* Create Pricing Rule                                                    */
    /* ---------------------------------------------------------------------- */

    return pricingRepository.create(data);
  }

  /**
   * Customer
   *
   * Get Active Pricing Rules
   */
  async getActivePricingRules() {
    return pricingRepository.findAllActive();
  }

  /**
   * Admin
   *
   * Get All Pricing Rules
   */
  async getAll() {
    return pricingRepository.findAll();
  }

  /**
   * Get Pricing Rule By ID
   */
  async getById(id: string) {
    return this.getPricingRuleOrFail(id);
  }

  /**
   * Update Pricing Rule
   */
  async update(id: string, data: Partial<IPricingRule>) {
    const pricingRule = await this.getPricingRuleOrFail(id);

    /* ---------------------------------------------------------------------- */
    /* Prevent Changing Laundry Service                                       */
    /* ---------------------------------------------------------------------- */

    if (data.laundryServiceId) {
      throw new ValidationError("Laundry service cannot be changed.");
    }

    /* ---------------------------------------------------------------------- */
    /* Prevent Changing Pricing Type                                          */
    /* ---------------------------------------------------------------------- */

    if (data.pricingType) {
      throw new ValidationError("Pricing type cannot be changed.");
    }

    /* ---------------------------------------------------------------------- */
    /* Update Pricing Rule                                                    */
    /* ---------------------------------------------------------------------- */

    const updated = await pricingRepository.update(
      pricingRule._id.toString(),
      data,
    );

    if (!updated) {
      throw new NotFoundError("Pricing rule not found.");
    }

    return updated;
  }

  /**
   * Activate Pricing Rule
   */
  async activate(id: string) {
    const pricingRule = await this.getPricingRuleOrFail(id);

    const updated = await pricingRepository.activate(
      pricingRule._id.toString(),
    );

    if (!updated) {
      throw new NotFoundError("Pricing rule not found.");
    }

    return updated;
  }

  /**
   * Deactivate Pricing Rule
   */
  async deactivate(id: string) {
    const pricingRule = await this.getPricingRuleOrFail(id);

    const updated = await pricingRepository.deactivate(
      pricingRule._id.toString(),
    );

    if (!updated) {
      throw new NotFoundError("Pricing rule not found.");
    }

    return updated;
  }
}

export const pricingService = new PricingService();
