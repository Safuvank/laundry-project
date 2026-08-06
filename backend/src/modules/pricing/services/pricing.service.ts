import { Types } from "mongoose";

import { pricingRepository } from "../repositories/pricing.repository.js";

import { laundryServiceRepository } from "../../laundryService/repositories/laundryService.repository.js";

import { NotFoundError } from "../../../shared/errors/NotFoundErrror.js";
import { ValidationError } from "../../../shared/errors/ValidationError.js";

import type { IPricingRule } from "../interfaces/IPricingRule.js";

export class PricingService {
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
  private async getPricingRuleOrFail(
    id: string,
  ): Promise<IPricingRule> {
    this.validateObjectId(id);

    const pricingRule = await pricingRepository.findById(id);

    if (!pricingRule) {
      throw new NotFoundError("Pricing rule not found.");
    }

    return pricingRule;
  }

  /**
   * Create Pricing Rule
   */
  async create(data: Partial<IPricingRule>) {
    // Check Laundry Service
    if (!Types.ObjectId.isValid(data.laundryServiceId?.toString())) {
      throw new ValidationError("Invalid laundry service id.");
    }

    const laundryService =
      await laundryServiceRepository.findById(
        data.laundryServiceId!.toString(),
      );

    if (!laundryService) {
      throw new NotFoundError("Laundry service not found.");
    }

    // Prevent duplicate pricing type
    const existingRule =
      await pricingRepository.findByLaundryServiceAndType(
        data.laundryServiceId!.toString(),
        data.pricingType!,
      );

    if (existingRule) {
      throw new ValidationError(
        "Pricing rule already exists for this laundry service.",
      );
    }

    return pricingRepository.create(data);
  }

  /**
   * Customer
   * Get Active Pricing Rules
   */
  async getActivePricingRules() {
    return pricingRepository.findAllActive();
  }

  /**
   * Admin
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
  async update(
    id: string,
    data: Partial<IPricingRule>,
  ) {
    const pricingRule =
      await this.getPricingRuleOrFail(id);

    // Prevent changing laundry service
    if (data.laundryServiceId) {
      throw new ValidationError(
        "Laundry service cannot be changed.",
      );
    }

    // Prevent changing pricing type
    if (data.pricingType) {
      throw new ValidationError(
        "Pricing type cannot be changed.",
      );
    }

    const updated =
      await pricingRepository.update(
        pricingRule.id,
        data,
      );

    return updated;
  }

  /**
   * Activate Pricing Rule
   */
  async activate(id: string) {
    const pricingRule =
      await this.getPricingRuleOrFail(id);

    return pricingRepository.activate(
      pricingRule.id,
    );
  }

  /**
   * Deactivate Pricing Rule
   */
  async deactivate(id: string) {
    const pricingRule =
      await this.getPricingRuleOrFail(id);

    return pricingRepository.deactivate(
      pricingRule.id,
    );
  }
}

export const pricingService =
  new PricingService();