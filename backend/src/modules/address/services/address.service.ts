import { Types } from "mongoose";

import type { IAddress } from "../interfaces/IAddress.js";

import { addressRepository } from "../repositories/address.repository.js";

import { AddressType } from "../constants/addresstype.js";

import { ValidationError } from "../../../shared/errors/ValidationError.js";
import { NotFoundError } from "../../../shared/errors/NotFoundErrror.js";

/* -------------------------------------------------------------------------- */
/*                         CREATE / UPDATE DATA                               */
/* -------------------------------------------------------------------------- */

interface CreateAddressData {
  fullName: string;

  phoneNumber: string;

  addressLine1: string;

  addressLine2?: string;

  city: string;

  state: string;

  postalCode: string;

  country: string;

  addressType: AddressType;

  location: {
    type: "Point";
    coordinates: [number, number];
  };

  isDefault?: boolean;
}

/* -------------------------------------------------------------------------- */
/*                              ADDRESS SERVICE                              */
/* -------------------------------------------------------------------------- */

class AddressService {
  /* ------------------------------------------------------------------------ */
  /*                            PRIVATE HELPERS                              */
  /* ------------------------------------------------------------------------ */

  /**
   * Validate address ObjectId
   */
  private validateObjectId(id: string): void {
    if (!Types.ObjectId.isValid(id)) {
      throw new ValidationError("Invalid address id.");
    }
  }

  /**
   * Validate user ObjectId
   */
  private validateUserId(userId: string): void {
    if (!Types.ObjectId.isValid(userId)) {
      throw new ValidationError("Invalid user id.");
    }
  }

  /**
   * Validate GeoJSON location
   *
   * Coordinates:
   *
   * [longitude, latitude]
   */
  private validateLocation(location: {
    type: "Point";
    coordinates: [number, number];
  }): void {
    if (location.type !== "Point") {
      throw new ValidationError('Location type must be "Point".');
    }

    const longitude = location.coordinates[0];

    const latitude = location.coordinates[1];

    if (longitude === undefined || latitude === undefined) {
      throw new ValidationError(
        "Location must contain longitude and latitude.",
      );
    }

    /* ---------------------------------------------------------------------- */
    /*                         NUMBER VALIDATION                              */
    /* ---------------------------------------------------------------------- */

    if (!Number.isFinite(longitude) || !Number.isFinite(latitude)) {
      throw new ValidationError(
        "Longitude and latitude must be valid numbers.",
      );
    }

    /* ---------------------------------------------------------------------- */
    /*                         ZERO LOCATION PROTECTION                       */
    /* ---------------------------------------------------------------------- */

    if (longitude === 0 && latitude === 0) {
      throw new ValidationError(
        "Valid pickup location is required.",
      );
    }

    /* ---------------------------------------------------------------------- */
    /*                         RANGE VALIDATION                               */
    /* ---------------------------------------------------------------------- */

    if (longitude < -180 || longitude > 180) {
      throw new ValidationError(
        "Longitude must be between -180 and 180.",
      );
    }

    if (latitude < -90 || latitude > 90) {
      throw new ValidationError(
        "Latitude must be between -90 and 90.",
      );
    }
  }

  /**
   * Get address or throw error
   */
  private async getAddressOrFail(addressId: string): Promise<IAddress> {
    this.validateObjectId(addressId);

    const address = await addressRepository.findById(addressId);

    if (!address) {
      throw new NotFoundError("Address not found.");
    }

    return address;
  }

  /* ------------------------------------------------------------------------ */
  /*                                  CREATE                                  */
  /* ------------------------------------------------------------------------ */

  /**
   * Create address
   */
  async create(
    userId: string,
    data: CreateAddressData,
  ): Promise<IAddress> {
    this.validateUserId(userId);

    this.validateLocation(data.location);

    const longitude = data.location.coordinates[0];

    const latitude = data.location.coordinates[1];

    if (longitude === undefined || latitude === undefined) {
      throw new ValidationError(
        "Location must contain longitude and latitude.",
      );
    }

    /*
     * If this address should become the default,
     * remove default status from existing addresses.
     */
    if (data.isDefault === true) {
      await addressRepository.clearDefault(userId);
    }

    const address = await addressRepository.create({
      userId: new Types.ObjectId(userId),

      fullName: data.fullName,

      phoneNumber: data.phoneNumber,

      addressLine1: data.addressLine1,

      ...(data.addressLine2 !== undefined && {
        addressLine2: data.addressLine2,
      }),

      city: data.city,

      state: data.state,

      postalCode: data.postalCode,

      country: data.country,

      addressType: data.addressType,

      location: {
        type: "Point",

        coordinates: [longitude, latitude],
      },

      isDefault: data.isDefault ?? false,

      isActive: true,
    });

    return address;
  }

  /* ------------------------------------------------------------------------ */
  /*                                  GET ALL                                 */
  /* ------------------------------------------------------------------------ */

  /**
   * Get all addresses
   *
   * Admin operation
   */
  async getAll(): Promise<IAddress[]> {
    return addressRepository.findAll();
  }

  /* ------------------------------------------------------------------------ */
  /*                                GET BY ID                                 */
  /* ------------------------------------------------------------------------ */

  /**
   * Get user's address by ID
   */
  async getById(
    userId: string,
    addressId: string,
  ): Promise<IAddress> {
    this.validateUserId(userId);

    const address = await this.getAddressOrFail(addressId);

    /*
     * Security:
     * Make sure this address belongs
     * to the logged-in user.
     */
    if (address.userId.toString() !== userId) {
      throw new ValidationError(
        "Address does not belong to this user.",
      );
    }

    return address;
  }

  /* ------------------------------------------------------------------------ */
  /*                           GET MY ADDRESSES                               */
  /* ------------------------------------------------------------------------ */

  /**
   * Get all addresses belonging to user
   */
  async getMyAddresses(userId: string): Promise<IAddress[]> {
    this.validateUserId(userId);

    return addressRepository.findByUserId(userId);
  }

  /* ------------------------------------------------------------------------ */
  /*                                  UPDATE                                  */
  /* ------------------------------------------------------------------------ */

  /**
   * Update user's address
   */
  async update(
    userId: string,
    addressId: string,
    data: Partial<CreateAddressData>,
  ): Promise<IAddress> {
    this.validateUserId(userId);

    const address = await this.getById(userId, addressId);

    const updateData: Partial<IAddress> = {};

    /* ---------------------------------------------------------------------- */
    /*                         BASIC INFORMATION                              */
    /* ---------------------------------------------------------------------- */

    if (data.fullName !== undefined) {
      updateData.fullName = data.fullName;
    }

    if (data.phoneNumber !== undefined) {
      updateData.phoneNumber = data.phoneNumber;
    }

    if (data.addressLine1 !== undefined) {
      updateData.addressLine1 = data.addressLine1;
    }

    if (data.addressLine2 !== undefined) {
      updateData.addressLine2 = data.addressLine2;
    }

    if (data.city !== undefined) {
      updateData.city = data.city;
    }

    if (data.state !== undefined) {
      updateData.state = data.state;
    }

    if (data.postalCode !== undefined) {
      updateData.postalCode = data.postalCode;
    }

    if (data.country !== undefined) {
      updateData.country = data.country;
    }

    if (data.addressType !== undefined) {
      updateData.addressType = data.addressType;
    }

    /* ---------------------------------------------------------------------- */
    /*                              LOCATION                                  */
    /* ---------------------------------------------------------------------- */

    if (data.location !== undefined) {
      this.validateLocation(data.location);

      const longitude = data.location.coordinates[0];

      const latitude = data.location.coordinates[1];

      if (longitude === undefined || latitude === undefined) {
        throw new ValidationError(
          "Location must contain longitude and latitude.",
        );
      }

      updateData.location = {
        type: "Point",

        coordinates: [longitude, latitude],
      };
    }

    /* ---------------------------------------------------------------------- */
    /*                              DEFAULT                                   */
    /* ---------------------------------------------------------------------- */

    if (data.isDefault === true) {
      await addressRepository.clearDefault(userId);

      updateData.isDefault = true;
    }

    if (data.isDefault === false) {
      updateData.isDefault = false;
    }

    /* ---------------------------------------------------------------------- */
    /*                               DATABASE                                 */
    /* ---------------------------------------------------------------------- */

    const updated = await addressRepository.update(
      address._id,
      updateData,
    );

    if (!updated) {
      throw new NotFoundError("Address not found.");
    }

    return updated;
  }

  /* ------------------------------------------------------------------------ */
  /*                              SET DEFAULT                                 */
  /* ------------------------------------------------------------------------ */

  /**
   * Set user's address as default
   */
  async setDefault(
    userId: string,
    addressId: string,
  ): Promise<IAddress> {
    this.validateUserId(userId);

    const address = await this.getById(userId, addressId);

    /*
     * Remove default from all
     * existing addresses.
     */
    await addressRepository.clearDefault(userId);

    /*
     * Set selected address as default.
     */
    const updated = await addressRepository.setDefault(address._id);

    if (!updated) {
      throw new NotFoundError("Address not found.");
    }

    return updated;
  }

  /* ------------------------------------------------------------------------ */
  /*                              DEACTIVATE                                 */
  /* ------------------------------------------------------------------------ */

  /**
   * Soft delete / deactivate address
   */
  async deactivate(
    userId: string,
    addressId: string,
  ): Promise<IAddress> {
    this.validateUserId(userId);

    const address = await this.getById(userId, addressId);

    const updated = await addressRepository.deactivate(
      address._id,
    );

    if (!updated) {
      throw new NotFoundError("Address not found.");
    }

    return updated;
  }

  /* ------------------------------------------------------------------------ */
  /*                                  DELETE                                  */
  /* ------------------------------------------------------------------------ */

  /**
   * Delete address
   *
   * We use soft delete instead of
   * permanently removing the document.
   */
  async delete(
    userId: string,
    addressId: string,
  ): Promise<IAddress> {
    this.validateUserId(userId);

    const address = await this.getAddressOrFail(addressId);

    const deleted = await addressRepository.delete(address._id);

    if (!deleted) {
      throw new NotFoundError("Address not found.");
    }

    return deleted;
  }
}

/* -------------------------------------------------------------------------- */
/*                              EXPORT SERVICE                                */
/* -------------------------------------------------------------------------- */

export const addressService = new AddressService();