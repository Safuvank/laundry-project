import type { ILaundryService } from "../interfaces/ILaundryService.js";

import { LaundryService } from "../models/laundryService.model.js";

export class LaundryServiceRepository {
  /*
  |--------------------------------------------------------------------------
  | Create Laundry Service
  |--------------------------------------------------------------------------
  */

  async create(data: Partial<ILaundryService>) {
    return LaundryService.create(data);
  }

  /*
  |--------------------------------------------------------------------------
  | Find All Active Services
  |--------------------------------------------------------------------------
  */

  async findAllActive() {
    return LaundryService.find({
      isActive: true,
    }).sort({
      sortOrder: 1,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Find All Services
  |--------------------------------------------------------------------------
  */

  async findAll() {
    return LaundryService.find().sort({
      sortOrder: 1,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Find Service By ID
  |--------------------------------------------------------------------------
  */

  async findById(id: string) {
    return LaundryService.findById(id);
  }

  /*
  |--------------------------------------------------------------------------
  | Find Service By Code
  |--------------------------------------------------------------------------
  */

  async findByCode(code: string) {
    return LaundryService.findOne({
      code,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Update Service
  |--------------------------------------------------------------------------
  */

  async update(
    id: string,
    data: Partial<ILaundryService>,
  ) {
    return LaundryService.findByIdAndUpdate(
      id,
      {
        $set: data,
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Activate Service
  |--------------------------------------------------------------------------
  */

  async activate(id: string) {
    return LaundryService.findByIdAndUpdate(
      id,
      {
        $set: {
          isActive: true,
        },
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Deactivate Service
  |--------------------------------------------------------------------------
  */

  async deactivate(id: string) {
    return LaundryService.findByIdAndUpdate(
      id,
      {
        $set: {
          isActive: false,
        },
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );
  }
}

export const laundryServiceRepository =
  new LaundryServiceRepository();