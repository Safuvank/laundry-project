import type { IPricingRule } from "../interfaces/IPricingRule.js";

import { PricingRule } from "../models/pricingRule.model.js";

class PricingRepository {
  /**
   * Create Pricing Rule
   */
  async create(
    data: Partial<IPricingRule>,
  ): Promise<IPricingRule> {
    return PricingRule.create(data);
  }

  /**
   * Get All Active Pricing Rules
   */
  async findAllActive(): Promise<IPricingRule[]> {
    return PricingRule.find({
      isActive: true,
    })
      .populate("laundryServiceId")
      .sort({ createdAt: -1 });
  }

  /**
   * Get All Pricing Rules
   */
  async findAll(): Promise<IPricingRule[]> {
    return PricingRule.find()
      .populate("laundryServiceId")
      .sort({ createdAt: -1 });
  }

  /**
   * Find Pricing Rule By ID
   */
  async findById(
    id: string,
  ): Promise<IPricingRule | null> {
    return PricingRule.findById(id).populate(
      "laundryServiceId",
    );
  }

  /**
   * Find Pricing Rules By Laundry Service
   */
  async findByLaundryService(
    laundryServiceId: string,
  ): Promise<IPricingRule[]> {
    return PricingRule.find({
      laundryServiceId,
      isActive: true,
    }).sort({
      pricingType: 1,
    });
  }

  /**
   * Find Pricing Rule By Laundry Service + Pricing Type
   */
  async findByLaundryServiceAndType(
    laundryServiceId: string,
    pricingType: string,
  ): Promise<IPricingRule | null> {
    return PricingRule.findOne({
      laundryServiceId,
      pricingType,
    });
  }

  /**
   * Update Pricing Rule
   */
  async update(
    id: string,
    data: Partial<IPricingRule>,
  ): Promise<IPricingRule | null> {
    return PricingRule.findByIdAndUpdate(
      id,
      data,
      {
        returnDocument: "after",
        runValidators: true,
      },
    );
  }

  /**
   * Activate Pricing Rule
   */
  async activate(
    id: string,
  ): Promise<IPricingRule | null> {
    return PricingRule.findByIdAndUpdate(
      id,
      {
        isActive: true,
      },
      {
        returnDocument: "after",
      },
    );
  }

  /**
   * Deactivate Pricing Rule
   */
  async deactivate(
    id: string,
  ): Promise<IPricingRule | null> {
    return PricingRule.findByIdAndUpdate(
      id,
      {
        isActive: false,
      },
      {
        returnDocument: "after",
      },
    );
  }
}

export const pricingRepository =
  new PricingRepository();