import type { IPricingRule } from "../interfaces/IPricingRule.js";
import { PricingType } from "../constants/pricingType.js";
declare class PricingRepository {
    /**
     * Create Pricing Rule
     */
    create(data: Partial<IPricingRule>): Promise<IPricingRule>;
    /**
     * Get All Active Pricing Rules
     */
    findAllActive(): Promise<IPricingRule[]>;
    /**
     * Get All Pricing Rules
     */
    findAll(): Promise<IPricingRule[]>;
    /**
     * Find Pricing Rule By ID
     */
    findById(id: string): Promise<IPricingRule | null>;
    /**
     * Find Pricing Rules By Laundry Service
     */
    findByLaundryService(laundryServiceId: string): Promise<IPricingRule[]>;
    /**
     * Find Pricing Rule By Laundry Service + Pricing Type
     */
    findByLaundryServiceAndType(laundryServiceId: string, pricingType: PricingType): Promise<IPricingRule | null>;
    /**
     * Update Pricing Rule
     */
    update(id: string, data: Partial<IPricingRule>): Promise<IPricingRule | null>;
    /**
     * Activate Pricing Rule
     */
    activate(id: string): Promise<IPricingRule | null>;
    /**
     * Deactivate Pricing Rule
     */
    deactivate(id: string): Promise<IPricingRule | null>;
}
export declare const pricingRepository: PricingRepository;
export {};
//# sourceMappingURL=pricing.repository.d.ts.map