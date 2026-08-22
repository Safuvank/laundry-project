

import { Document, Types } from "mongoose";

import { DeliveryAgentStatus } from "../constants/deliveryAgentStatus.js";

export interface IDeliveryAgent extends Document {
  userId: Types.ObjectId;

  status: DeliveryAgentStatus;

  phoneNumber: string;

  currentLocation: {
    type: "Point";
    coordinates: [number, number];
  };

  isActive: boolean;

  createdAt: Date;

  updatedAt: Date;
}
