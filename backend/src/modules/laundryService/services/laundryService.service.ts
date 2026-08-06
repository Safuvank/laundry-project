import mongoose from "mongoose";

import { laundryServiceRepository } from "../repositories/laundryService.repository.js";

import type { ILaundryService } from "../interfaces/ILaundryService.js";

import { NotFoundError } from "../../../shared/errors/NotFoundErrror.js";
import { ValidationError } from "../../../shared/errors/ValidationError.js";

export class LaundryServiceService {
  /*
  |--------------------------------------------------------------------------
  | Private Helper - Validate MongoDB ObjectId
  |--------------------------------------------------------------------------
  */

  private validateObjectId(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ValidationError("Invalid laundry service id.");
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Private Helper - Get Service Or Fail
  |--------------------------------------------------------------------------
  */

  private async getServiceOrFail(id: string) {
    this.validateObjectId(id);

    const service = await laundryServiceRepository.findById(id);

    if (!service) {
      throw new NotFoundError("Laundry service not found.");
    }

    return service;
  }

  /*
  |--------------------------------------------------------------------------
  | Create Laundry Service
  |--------------------------------------------------------------------------
  */

  async create(data: Partial<ILaundryService>) {
    const existingService = await laundryServiceRepository.findByCode(
      data.code!,
    );

    if (existingService) {
      throw new ValidationError(
        "Laundry service with this code already exists.",
      );
    }

    return laundryServiceRepository.create(data);
  }

  /*
  |--------------------------------------------------------------------------
  | Get Active Laundry Services - Customer
  |--------------------------------------------------------------------------
  */

  async getActiveServices() {
    return laundryServiceRepository.findAllActive();
  }

  /*
  |--------------------------------------------------------------------------
  | Get All Laundry Services - Admin
  |--------------------------------------------------------------------------
  */

  async getAll() {
    return laundryServiceRepository.findAll();
  }

  /*
  |--------------------------------------------------------------------------
  | Get Laundry Service By ID
  |--------------------------------------------------------------------------
  */

  async getById(id: string) {
    return this.getServiceOrFail(id);
  }

  /*
  |--------------------------------------------------------------------------
  | Update Laundry Service
  |--------------------------------------------------------------------------
  */

  async update(id: string, data: Partial<ILaundryService>) {
    await this.getServiceOrFail(id);

    /*
    |--------------------------------------------------------------------------
    | Prevent code modification
    |--------------------------------------------------------------------------
    */

    if (data.code !== undefined) {
      throw new ValidationError("Laundry service code cannot be changed.");
    }

    /*
    |--------------------------------------------------------------------------
    | Prevent active status modification through normal update
    |--------------------------------------------------------------------------
    */

    if (data.isActive !== undefined) {
      throw new ValidationError(
        "Use activate or deactivate operation to change service status.",
      );
    }

    const updatedService = await laundryServiceRepository.update(id, data);

    if (!updatedService) {
      throw new NotFoundError("Laundry service not found.");
    }

    return updatedService;
  }

  /*
  |--------------------------------------------------------------------------
  | Activate Laundry Service
  |--------------------------------------------------------------------------
  */

  async activate(id: string) {
    const service = await this.getServiceOrFail(id);

    if (service.isActive) {
      throw new ValidationError("Laundry service is already active.");
    }

    const updatedService = await laundryServiceRepository.activate(id);

    if (!updatedService) {
      throw new NotFoundError("Laundry service not found.");
    }

    return updatedService;
  }

  /*
  |--------------------------------------------------------------------------
  | Deactivate Laundry Service
  |--------------------------------------------------------------------------
  */

  async deactivate(id: string) {
    const service = await this.getServiceOrFail(id);

    if (!service.isActive) {
      throw new ValidationError("Laundry service is already inactive.");
    }

    const updatedService = await laundryServiceRepository.deactivate(id);

    if (!updatedService) {
      throw new NotFoundError("Laundry service not found.");
    }

    return updatedService;
  }
}

export const laundryServiceService = new LaundryServiceService();
