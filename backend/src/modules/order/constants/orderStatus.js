export var OrderStatus;
(function (OrderStatus) {
    OrderStatus["DRAFT"] = "DRAFT";
    OrderStatus["BOOKED"] = "BOOKED";
    OrderStatus["PICKUP_ASSIGNED"] = "PICKUP_ASSIGNED";
    OrderStatus["OUT_FOR_PICKUP"] = "OUT_FOR_PICKUP";
    OrderStatus["PICKED_UP"] = "PICKED_UP";
    OrderStatus["RECEIVED_AT_FACILITY"] = "RECEIVED_AT_FACILITY";
    OrderStatus["INSPECTION_IN_PROGRESS"] = "INSPECTION_IN_PROGRESS";
    OrderStatus["PRICE_FINALIZED"] = "PRICE_FINALIZED";
    OrderStatus["CUSTOMER_APPROVAL_PENDING"] = "CUSTOMER_APPROVAL_PENDING";
    OrderStatus["PROCESSING"] = "PROCESSING";
    OrderStatus["QUALITY_CHECK"] = "QUALITY_CHECK";
    OrderStatus["READY_FOR_DELIVERY"] = "READY_FOR_DELIVERY";
    OrderStatus["DELIVERY_ASSIGNED"] = "DELIVERY_ASSIGNED";
    OrderStatus["OUT_FOR_DELIVERY"] = "OUT_FOR_DELIVERY";
    OrderStatus["DELIVERED"] = "DELIVERED";
    OrderStatus["COMPLETED"] = "COMPLETED";
    OrderStatus["CANCELLED"] = "CANCELLED";
    OrderStatus["PICKUP_FAILED"] = "PICKUP_FAILED";
    OrderStatus["DELIVERY_FAILED"] = "DELIVERY_FAILED";
    OrderStatus["ON_HOLD"] = "ON_HOLD";
})(OrderStatus || (OrderStatus = {}));
//# sourceMappingURL=orderStatus.js.map