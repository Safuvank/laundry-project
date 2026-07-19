import type { Request, Response } from "express";

import { asyncHandler } from "../../../shared/utils/asyncHandler.js";

import { turnaroundPlanService } from "../services/turnaroundPlan.service.js";

class TurnaroundPlanController {
  /*
  |--------------------------------------------------------------------------
  | Create Turnaround Plan
  |--------------------------------------------------------------------------
  | ADMIN ONLY
  |
  | POST /api/v1/turnaround-plans
  */

  create = asyncHandler(async (req: Request, res: Response) => {
    const plan = await turnaroundPlanService.create(req.body);

    return res.status(201).json({
      success: true,
      message: "Turnaround plan created successfully.",
      data: plan,
    });
  });

  /*
  |--------------------------------------------------------------------------
  | Get Active Turnaround Plans
  |--------------------------------------------------------------------------
  | CUSTOMER / PUBLIC CATALOG
  |
  | GET /api/v1/turnaround-plans
  */

  getActivePlans = asyncHandler(async (_req: Request, res: Response) => {
    const plans = await turnaroundPlanService.getActivePlans();

    return res.status(200).json({
      success: true,
      message: "Active turnaround plans retrieved successfully.",
      data: plans,
    });
  });

  /*
  |--------------------------------------------------------------------------
  | Get All Turnaround Plans
  |--------------------------------------------------------------------------
  | ADMIN ONLY
  |
  | GET /api/v1/turnaround-plans/admin/all
  */

  getAll = asyncHandler(async (_req: Request, res: Response) => {
    const plans = await turnaroundPlanService.getAllPlans();

    return res.status(200).json({
      success: true,
      message: "Turnaround plans retrieved successfully.",
      data: plans,
    });
  });

  /*
  |--------------------------------------------------------------------------
  | Get Turnaround Plan By ID
  |--------------------------------------------------------------------------
  |
  | GET /api/v1/turnaround-plans/:id
  */

  getById = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid turnaround plan ID.",
      });
    }

    const plan = await turnaroundPlanService.getById(id);

    return res.status(200).json({
      success: true,
      message: "Turnaround plan retrieved successfully.",
      data: plan,
    });
  });

  /*
  |--------------------------------------------------------------------------
  | Update Turnaround Plan
  |--------------------------------------------------------------------------
  | ADMIN ONLY
  |
  | PATCH /api/v1/turnaround-plans/:id
  */

  update = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid turnaround plan ID.",
      });
    }

    const plan = await turnaroundPlanService.update(id, req.body);

    return res.status(200).json({
      success: true,
      message: "Turnaround plan updated successfully.",
      data: plan,
    });
  });

  /*
  |--------------------------------------------------------------------------
  | Activate Turnaround Plan
  |--------------------------------------------------------------------------
  | ADMIN ONLY
  |
  | PATCH /api/v1/turnaround-plans/:id/activate
  */

  activate = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid turnaround plan ID.",
      });
    }

    const plan = await turnaroundPlanService.activate(id);

    return res.status(200).json({
      success: true,
      message: "Turnaround plan activated successfully.",
      data: plan,
    });
  });

  /*
  |--------------------------------------------------------------------------
  | Deactivate Turnaround Plan
  |--------------------------------------------------------------------------
  | ADMIN ONLY
  |
  | PATCH /api/v1/turnaround-plans/:id/deactivate
  */

  deactivate = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid turnaround plan ID.",
      });
    }

    const plan = await turnaroundPlanService.deactivate(id);

    return res.status(200).json({
      success: true,
      message: "Turnaround plan deactivated successfully.",
      data: plan,
    });
  });
}

export const turnaroundPlanController = new TurnaroundPlanController();
