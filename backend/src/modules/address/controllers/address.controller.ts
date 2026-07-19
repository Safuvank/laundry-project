


import type { Request, Response } from "express";

import { asyncHandler } from "../../../shared/utils/asyncHandler.js";
import { addressService } from "../services/address.service.js";

class AddressController {
  /*
  |--------------------------------------------------------------------------
  | Create Address
  |--------------------------------------------------------------------------
  */

  create = asyncHandler(async (req: Request, res: Response) => {
    const address = await addressService.create(
      req.user!.userId,
      req.body,
    );

    return res.status(201).json({
      success: true,
      message: "Address created successfully.",
      data: address,
    });
  });

  /*
  |--------------------------------------------------------------------------
  | Get All Addresses
  |--------------------------------------------------------------------------
  */

  getAll = asyncHandler(async (req: Request, res: Response) => {
    const addresses = await addressService.getAll(
      req.user!.userId,
    );

    return res.status(200).json({
      success: true,
      message: "Addresses retrieved successfully.",
      data: addresses,
    });
  });

  /*
  |--------------------------------------------------------------------------
  | Get Address By ID
  |--------------------------------------------------------------------------
  */

  getById = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid address ID.",
      });
    }

    const address = await addressService.getById(
      id,
      req.user!.userId,
    );

    return res.status(200).json({
      success: true,
      message: "Address retrieved successfully.",
      data: address,
    });
  });

  /*
  |--------------------------------------------------------------------------
  | Update Address
  |--------------------------------------------------------------------------
  */

  update = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid address ID.",
      });
    }

    const address = await addressService.update(
      id,
      req.user!.userId,
      req.body,
    );

    return res.status(200).json({
      success: true,
      message: "Address updated successfully.",
      data: address,
    });
  });

  /*
  |--------------------------------------------------------------------------
  | Delete Address
  |--------------------------------------------------------------------------
  */

  delete = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid address ID.",
      });
    }

    await addressService.delete(
      id,
      req.user!.userId,
    );

    return res.status(200).json({
      success: true,
      message: "Address deleted successfully.",
    });
  });

  /*
  |--------------------------------------------------------------------------
  | Set Default Address
  |--------------------------------------------------------------------------
  */

  setDefault = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid address ID.",
      });
    }

    const address = await addressService.setDefault(
      id,
      req.user!.userId,
    );

    return res.status(200).json({
      success: true,
      message: "Default address updated successfully.",
      data: address,
    });
  });
}

export const addressController = new AddressController();