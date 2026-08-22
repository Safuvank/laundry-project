import { Types } from "mongoose";
import { Address } from "../models/address.model.js";
import type { IAddress } from "../interfaces/IAddress.js";

class AddressRepository {
  /**
   * Create a new address
   */
  async create(data: Partial<IAddress>): Promise<IAddress> {
    return Address.create(data);
  }

  /**
   * Find address by ID
   */
  async findById(id: string | Types.ObjectId): Promise<IAddress | null> {
    return Address.findById(id);
  }

  /**
   * Find all addresses of a user
   */
  async findAllByUser(userId: string | Types.ObjectId): Promise<IAddress[]> {
    return Address.find({
      userId,
    }).sort({
      isDefault: -1,
      createdAt: -1,
    });
  }

  /**
   * Find all addresses
   *
   * Admin use
   */
  async findAll(): Promise<IAddress[]> {
    return Address.find().populate("userId").sort({
      createdAt: -1,
    });
  }

  /**
   * Find default address of a user
   */
  async findDefaultByUser(
    userId: string | Types.ObjectId,
  ): Promise<IAddress | null> {
    return Address.findOne({
      userId,
      isDefault: true,
    });
  }

  /**
   * Count user's addresses
   */
  async countByUser(userId: string | Types.ObjectId): Promise<number> {
    return Address.countDocuments({
      userId,
    });
  }

  /**
   * Update address
   */
  async update(
    id: string | Types.ObjectId,
    data: Partial<IAddress>,
  ): Promise<IAddress | null> {
    return Address.findByIdAndUpdate(id, data, {
      returnDocument: "after",
      runValidators: true,
    });
  }

  /**
   * Delete address
   */
  async delete(id: string | Types.ObjectId): Promise<IAddress | null> {
    return Address.findByIdAndDelete(id);
  }

  /**
   * Remove default flag from all addresses of a user
   */
  async clearDefaultAddress(userId: string | Types.ObjectId): Promise<void> {
    await Address.updateMany(
      {
        userId,
        isDefault: true,
      },
      {
        $set: {
          isDefault: false,
        },
      },
    );
  }

  /**
   * Set an address as default
   */
  async setDefaultAddress(
    id: string | Types.ObjectId,
  ): Promise<IAddress | null> {
    return Address.findByIdAndUpdate(
      id,
      {
        isDefault: true,
      },
      {
        returnDocument: "after",
      },
    );
  }

  /**
   * Find all addresses belonging to a user
   */
  async findByUserId(userId: string | Types.ObjectId): Promise<IAddress[]> {
    return Address.find({
      userId,
      isActive: true,
    }).sort({
      isDefault: -1,
      createdAt: -1,
    });
  }

  /**
   * Remove default status from all user addresses
   */
  async clearDefault(userId: string | Types.ObjectId): Promise<void> {
    await Address.updateMany(
      {
        userId,
        isActive: true,
      },
      {
        $set: {
          isDefault: false,
        },
      },
    );
  }

  /**
   * Set an address as default
   */
  async setDefault(id: string | Types.ObjectId): Promise<IAddress | null> {
    return Address.findByIdAndUpdate(
      id,
      {
        $set: {
          isDefault: true,
        },
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );
  }

  /**
   * Deactivate address
   */
  async deactivate(id: string | Types.ObjectId): Promise<IAddress | null> {
    return Address.findByIdAndUpdate(
      id,
      {
        $set: {
          isActive: false,
          isDefault: false,
        },
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );
  }
}

export const addressRepository = new AddressRepository();
