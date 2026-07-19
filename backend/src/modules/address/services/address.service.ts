import { Types } from "mongoose";

import { addressRepository } from "../repositories/address.repository.js";
import type{ IAddress } from "../interfaces/IAddress.js";

import { NotFoundError } from "../../../shared/errors/NotFoundErrror.js";
import { ForbiddenError } from "../../../shared/errors/ForbiddenError.js";
import { ValidationError } from "../../../shared/errors/ValidationError.js";

class AddressService {
  private readonly MAX_ADDRESSES = 10;

  /**
   * Get address or throw error.
   */
  private async getAddressOrFail(
    id: string,
    userId: string,
  ): Promise<IAddress> {
    const address = await addressRepository.findById(id);

    if (!address) {
      throw new NotFoundError("Address not found.");
    }

    if (address.userId.toString() !== userId) {
      throw new ForbiddenError("You are not allowed to access this address.");
    }

    return address;
  }

  /**
   * Create Address
   */
  async create(userId: string, data: Partial<IAddress>): Promise<IAddress> {
    const totalAddresses = await addressRepository.countByUser(userId);

    if (totalAddresses >= this.MAX_ADDRESSES) {
      throw new ValidationError(
        "You have reached the maximum number of addresses.",
      );
    }

    // First address becomes default automatically
    if (totalAddresses === 0) {
      data.isDefault = true;
    }

    // User explicitly chooses default
    if (data.isDefault) {
      await addressRepository.clearDefaultAddress(userId);
    }

    return addressRepository.create({
      ...data,
      userId: new Types.ObjectId(userId),
    });
  }

  /**
   * Get all addresses
   */
  async getAll(userId: string): Promise<IAddress[]> {
    return addressRepository.findAllByUser(userId);
  }

  /**
   * Get single address
   */
  async getById(id: string, userId: string): Promise<IAddress> {
    return this.getAddressOrFail(id, userId);
  }

  /**
   * Update address
   */
  async update(
    id: string,
    userId: string,
    data: Partial<IAddress>,
  ): Promise<IAddress> {
    await this.getAddressOrFail(id, userId);

    if (data.isDefault) {
      await addressRepository.clearDefaultAddress(userId);
    }

    const updatedAddress = await addressRepository.update(id, data);

    if (!updatedAddress) {
      throw new NotFoundError("Address not found.");
    }

    return updatedAddress;
  }

  /**
   * Delete address
   */
  async delete(id: string, userId: string): Promise<void> {
    const address = await this.getAddressOrFail(id, userId);

    await addressRepository.delete(address._id);

    // Optional:
    // If the deleted address was default,
    // you may later assign another address as default.
  }

  /**
   * Set default address
   */
  async setDefault(id: string, userId: string): Promise<IAddress> {
    await this.getAddressOrFail(id, userId);

    await addressRepository.clearDefaultAddress(userId);

    const address = await addressRepository.setDefaultAddress(id);

    if (!address) {
      throw new NotFoundError("Address not found.");
    }

    return address;
  }
}

export const addressService = new AddressService();
