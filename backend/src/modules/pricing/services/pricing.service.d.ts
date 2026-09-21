import type { IPricingRule } from "../interfaces/IPricingRule.js";
export declare class PricingService {
    /**
     * Validate Pricing Rule ID
     */
    private validateObjectId;
    /**
     * Get Pricing Rule or Throw Error
     */
    private getPricingRuleOrFail;
    /**
     * Create Pricing Rule
     */
    create(data: Partial<IPricingRule>): Promise<IPricingRule>;
    /**
     * Customer
     *
     * Get Active Pricing Rules
     */
    getActivePricingRules(): Promise<IPricingRule[]>;
    /**
     * Admin
     *
     * Get All Pricing Rules
     */
    getAll(): Promise<IPricingRule[]>;
    /**
     * Get Pricing Rule By ID
     */
    getById(id: string): Promise<IPricingRule>;
    /**
     * Update Pricing Rule
     */
    update(id: string, data: Partial<IPricingRule>): Promise<IPricingRule>;
    /**
     * Activate Pricing Rule
     */
    activate(id: string): Promise<IPricingRule>;
    /**
     * Deactivate Pricing Rule
     */
    deactivate(id: string): Promise<IPricingRule>;
}
export declare const pricingService: PricingService;
//# sourceMappingURL=pricing.service.d.ts.map