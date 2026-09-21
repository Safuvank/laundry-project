import { asyncHandler } from "../../../shared/utils/asyncHandler.js";
import { addressService } from "../services/address.service.js";
class AddressController {
    /*
    |--------------------------------------------------------------------------
    | Create Address
    |--------------------------------------------------------------------------
    */
    create = asyncHandler(async (req, res) => {
        const address = await addressService.create(req.user.userId, req.body);
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
    getAll = asyncHandler(async (req, res) => {
        const addresses = await addressService.getAll();
        return res.status(200).json({
            success: true,
            message: "Addresses retrieved successfully.",
            data: addresses,
        });
    });
    /*
    |--------------------------------------------------------------------------
    | Get My Addresses
    |--------------------------------------------------------------------------
    */
    getMyAddresses = asyncHandler(async (req, res) => {
        const addresses = await addressService.getMyAddresses(req.user.userId);
        return res.status(200).json({
            success: true,
            message: "Your addresses retrieved successfully.",
            data: addresses,
        });
    });
    /*
    |--------------------------------------------------------------------------
    | Get Address By ID
    |--------------------------------------------------------------------------
    */
    getById = asyncHandler(async (req, res) => {
        const id = req.params.id;
        if (typeof id !== "string") {
            return res.status(400).json({
                success: false,
                message: "Invalid address ID.",
            });
        }
        const address = await addressService.getById(req.user.userId, id);
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
    update = asyncHandler(async (req, res) => {
        const id = req.params.id;
        if (typeof id !== "string") {
            return res.status(400).json({
                success: false,
                message: "Invalid address ID.",
            });
        }
        const address = await addressService.update(req.user.userId, id, req.body);
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
    delete = asyncHandler(async (req, res) => {
        const id = req.params.id;
        if (typeof id !== "string") {
            return res.status(400).json({
                success: false,
                message: "Invalid address ID.",
            });
        }
        await addressService.delete(req.user.userId, id);
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
    setDefault = asyncHandler(async (req, res) => {
        const id = req.params.id;
        if (typeof id !== "string") {
            return res.status(400).json({
                success: false,
                message: "Invalid address ID.",
            });
        }
        const address = await addressService.setDefault(req.user.userId, id);
        return res.status(200).json({
            success: true,
            message: "Default address updated successfully.",
            data: address,
        });
    });
    /*
    |--------------------------------------------------------------------------
    | Deactivate Address
    |--------------------------------------------------------------------------
    */
    deactivate = asyncHandler(async (req, res) => {
        const id = req.params.id;
        if (typeof id !== "string") {
            return res.status(400).json({
                success: false,
                message: "Invalid address ID.",
            });
        }
        const address = await addressService.deactivate(req.user.userId, id);
        return res.status(200).json({
            success: true,
            message: "Address deactivated successfully.",
            data: address,
        });
    });
}
export const addressController = new AddressController();
//# sourceMappingURL=address.controller.js.map