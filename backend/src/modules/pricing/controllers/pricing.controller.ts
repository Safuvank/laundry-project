import type { Request, Response } from "express";

import { asyncHandler } from "../../../shared/utils/asyncHandler.js";

import { pricingService } from "../services/pricing.service.js";

class PricingController {
  /**
   * Create Pricing Rule
   * Admin Only
   */
  create = asyncHandler(async (req: Request, res: Response) => {
    const pricingRule = await pricingService.create(req.body);

    return res.status(201).json({
      success: true,
      message: "Pricing rule created successfully.",
      data: pricingRule,
    });
  });

  /**
   * Get Active Pricing Rules
   * Customer
   */
  getActivePricingRules = asyncHandler(
    async (req: Request, res: Response) => {
      const pricingRules =
        await pricingService.getActivePricingRules();

      return res.status(200).json({
        success: true,
        message: "Pricing rules retrieved successfully.",
        data: pricingRules,
      });
    },
  );

  /**
   * Get All Pricing Rules
   * Admin Only
   */
  getAll = asyncHandler(async (req: Request, res: Response) => {
    const pricingRules = await pricingService.getAll();

    return res.status(200).json({
      success: true,
      message: "All pricing rules retrieved successfully.",
      data: pricingRules,
    });
  });

  /**
   * Get Pricing Rule By Id
   */
  getById = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Pricing rule id is required.",
      });
    }

    const pricingRule = await pricingService.getById(id);

    return res.status(200).json({
      success: true,
      message: "Pricing rule retrieved successfully.",
      data: pricingRule,
    });
  });

  /**
   * Update Pricing Rule
   */
  update = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Pricing rule id is required.",
      });
    }

    const pricingRule = await pricingService.update(
      id,
      req.body,
    );

    return res.status(200).json({
      success: true,
      message: "Pricing rule updated successfully.",
      data: pricingRule,
    });
  });

  /**
   * Activate Pricing Rule
   */
  activate = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Pricing rule id is required.",
      });
    }

    const pricingRule = await pricingService.activate(id);

    return res.status(200).json({
      success: true,
      message: "Pricing rule activated successfully.",
      data: pricingRule,
    });
  });

  /**
   * Deactivate Pricing Rule
   */
  deactivate = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Pricing rule id is required.",
      });
    }

    const pricingRule = await pricingService.deactivate(id);

    return res.status(200).json({
      success: true,
      message: "Pricing rule deactivated successfully.",
      data: pricingRule,
    });
  });
}

export const pricingController = new PricingController();