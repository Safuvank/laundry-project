import { api } from "@/lib/api/axios";

import type {
  DeliveryAssignment,
  DeliveryAssignmentsResponse,
  DeliveryAssignmentResponse,
  RejectAssignmentPayload,
} from "../types/delivery-assignment.types";

/* -------------------------------------------------------------------------- */
/*                         GET MY ASSIGNMENTS                                 */
/* -------------------------------------------------------------------------- */

/**
 * Get assignments belonging to the authenticated delivery agent.
 *
 * GET /api/v1/delivery-assignments/me
 */
export const getMyAssignments = async (): Promise<DeliveryAssignment[]> => {
  const response = await api.get<DeliveryAssignmentsResponse>(
    "/delivery-assignments/me",
  );

  return response.data.data;
};

/* -------------------------------------------------------------------------- */
/*                              ACCEPT                                        */
/* -------------------------------------------------------------------------- */

/**
 * Accept a delivery assignment.
 *
 * PATCH /api/v1/delivery-assignments/:id/accept
 */
export const acceptAssignment = async (
  assignmentId: string,
): Promise<DeliveryAssignment> => {
  const response = await api.patch<DeliveryAssignmentResponse>(
    `/delivery-assignments/${assignmentId}/accept`,
  );

  return response.data.data;
};

/* -------------------------------------------------------------------------- */
/*                              REJECT                                        */
/* -------------------------------------------------------------------------- */

/**
 * Reject a delivery assignment.
 *
 * PATCH /api/v1/delivery-assignments/:id/reject
 */
export const rejectAssignment = async (
  assignmentId: string,
  payload?: RejectAssignmentPayload,
): Promise<DeliveryAssignment> => {
  const response = await api.patch<DeliveryAssignmentResponse>(
    `/delivery-assignments/${assignmentId}/reject`,
    payload,
  );

  return response.data.data;
};

/* -------------------------------------------------------------------------- */
/*                            START PICKUP                                    */
/* -------------------------------------------------------------------------- */

/**
 * Start pickup.
 *
 * PATCH /api/v1/delivery-assignments/:id/start-pickup
 */
export const startPickup = async (
  assignmentId: string,
): Promise<DeliveryAssignment> => {
  const response = await api.patch<DeliveryAssignmentResponse>(
    `/delivery-assignments/${assignmentId}/start-pickup`,
  );

  return response.data.data;
};

/* -------------------------------------------------------------------------- */
/*                           START DELIVERY                                   */
/* -------------------------------------------------------------------------- */

/**
 * Start delivery.
 *
 * PATCH /api/v1/delivery-assignments/:id/start-delivery
 */
export const startDelivery = async (
  assignmentId: string,
): Promise<DeliveryAssignment> => {
  const response = await api.patch<DeliveryAssignmentResponse>(
    `/delivery-assignments/${assignmentId}/start-delivery`,
  );

  return response.data.data;
};

/* -------------------------------------------------------------------------- */
/*                              COMPLETE                                      */
/* -------------------------------------------------------------------------- */

/**
 * Complete pickup or delivery assignment.
 *
 * PATCH /api/v1/delivery-assignments/:id/complete
 */
export const completeAssignment = async (
  assignmentId: string,
): Promise<DeliveryAssignment> => {
  const response = await api.patch<DeliveryAssignmentResponse>(
    `/delivery-assignments/${assignmentId}/complete`,
  );

  return response.data.data;
};


export const completePickup = async (
  assignmentId: string,
): Promise<DeliveryAssignment> => {
  const response = await api.patch<DeliveryAssignmentResponse>(
    `/delivery-assignments/${assignmentId}/complete`,
  );

  return response.data.data;
};

export const completeDelivery = async (
  assignmentId: string,
): Promise<DeliveryAssignment> => {
  const response = await api.patch<DeliveryAssignmentResponse>(
    `/delivery-assignments/${assignmentId}/complete`,
  );

  return response.data.data;
};