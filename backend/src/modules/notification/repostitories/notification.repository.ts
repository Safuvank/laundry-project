// import { Types } from "mongoose";

// import { Notification } from "../models/notification.model.js";

// import type { INotification } from "../interfaces/INotification.js";

// class NotificationRepository {
//   /* -------------------------------------------------------------------------- */
//   /*                                  CREATE                                    */
//   /* -------------------------------------------------------------------------- */

//   /**
//    * Create notification
//    */
//   async create(data: Partial<INotification>): Promise<INotification> {
//     return Notification.create(data);
//   }

//   /* -------------------------------------------------------------------------- */
//   /*                                FIND BY ID                                  */
//   /* -------------------------------------------------------------------------- */

//   /**
//    * Find notification by ID
//    */
//   async findById(id: string | Types.ObjectId): Promise<INotification | null> {
//     return Notification.findById(id).populate("userId").populate("orderId");
//   }

//   /* -------------------------------------------------------------------------- */
//   /*                           FIND BY USER ID                                  */
//   /* -------------------------------------------------------------------------- */

//   /**
//    * Find all notifications for a user
//    *
//    * Newest notifications first.
//    */
//   async findByUserId(
//     userId: string | Types.ObjectId,
//   ): Promise<INotification[]> {
//     return Notification.find({
//       userId,
//     }).sort({
//       createdAt: -1,
//     });
//   }

//   /* -------------------------------------------------------------------------- */
//   /*                         FIND UNREAD BY USER                                */
//   /* -------------------------------------------------------------------------- */

//   /**
//    * Find unread notifications for a user
//    */
//   async findUnreadByUserId(
//     userId: string | Types.ObjectId,
//   ): Promise<INotification[]> {
//     return Notification.find({
//       userId,
//       isRead: false,
//     }).sort({
//       createdAt: -1,
//     });
//   }

//   /* -------------------------------------------------------------------------- */
//   /*                           COUNT UNREAD                                     */
//   /* -------------------------------------------------------------------------- */

//   /**
//    * Count unread notifications for a user
//    */
//   async countUnreadByUserId(userId: string | Types.ObjectId): Promise<number> {
//     return Notification.countDocuments({
//       userId,
//       isRead: false,
//     });
//   }

//   /* -------------------------------------------------------------------------- */
//   /*                              MARK AS READ                                  */
//   /* -------------------------------------------------------------------------- */

//   /**
//    * Mark one notification as read
//    */
//   async markAsRead(id: string | Types.ObjectId): Promise<INotification | null> {
//     return Notification.findByIdAndUpdate(
//       id,
//       {
//         $set: {
//           isRead: true,
//           readAt: new Date(),
//         },
//       },
//       {
//         returnDocument: "after",
//         runValidators: true,
//       },
//     );
//   }

//   /* -------------------------------------------------------------------------- */
//   /*                          MARK ALL AS READ                                  */
//   /* -------------------------------------------------------------------------- */

//   /**
//    * Mark all notifications of a user as read
//    */
//   async markAllAsRead(userId: string | Types.ObjectId): Promise<void> {
//     await Notification.updateMany(
//       {
//         userId,
//         isRead: false,
//       },
//       {
//         $set: {
//           isRead: true,
//           readAt: new Date(),
//         },
//       },
//     );
//   }

//   /* -------------------------------------------------------------------------- */
//   /*                                  DELETE                                    */
//   /* -------------------------------------------------------------------------- */

//   /**
//    * Delete notification
//    */
//   async delete(id: string | Types.ObjectId): Promise<INotification | null> {
//     return Notification.findByIdAndDelete(id);
//   }
// }

// export const notificationRepository = new NotificationRepository();

import { Types } from "mongoose";

import { Notification } from "../models/notification.model.js";

import type { INotification } from "../interfaces/INotification.js";

class NotificationRepository {
  /* -------------------------------------------------------------------------- */
  /*                                  CREATE                                    */
  /* -------------------------------------------------------------------------- */

  /**
   * Create notification
   */
  async create(data: Partial<INotification>): Promise<INotification> {
    return Notification.create(data);
  }

  /* -------------------------------------------------------------------------- */
  /*                                FIND BY ID                                  */
  /* -------------------------------------------------------------------------- */

  /**
   * Find notification by ID
   *
   * Password is explicitly excluded from the populated user.
   */
  async findById(id: string | Types.ObjectId): Promise<INotification | null> {
    return Notification.findById(id)
      .populate("userId", "-password")
      .populate("orderId");
  }

  /* -------------------------------------------------------------------------- */
  /*                           FIND BY USER ID                                  */
  /* -------------------------------------------------------------------------- */

  /**
   * Find all notifications for a user
   *
   * Newest notifications first.
   *
   * The query is scoped to the provided userId.
   */
  async findByUserId(
    userId: string | Types.ObjectId,
  ): Promise<INotification[]> {
    return Notification.find({
      userId,
    }).sort({
      createdAt: -1,
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                         FIND UNREAD BY USER                                */
  /* -------------------------------------------------------------------------- */

  /**
   * Find unread notifications for a user
   */
  async findUnreadByUserId(
    userId: string | Types.ObjectId,
  ): Promise<INotification[]> {
    return Notification.find({
      userId,
      isRead: false,
    }).sort({
      createdAt: -1,
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                           COUNT UNREAD                                     */
  /* -------------------------------------------------------------------------- */

  /**
   * Count unread notifications for a user
   */
  async countUnreadByUserId(userId: string | Types.ObjectId): Promise<number> {
    return Notification.countDocuments({
      userId,
      isRead: false,
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                              MARK AS READ                                  */
  /* -------------------------------------------------------------------------- */

  /**
   * Mark one notification as read
   *
   * IMPORTANT:
   * The notification must belong to the given user.
   */
  async markAsRead(
    id: string | Types.ObjectId,
    userId: string | Types.ObjectId,
  ): Promise<INotification | null> {
    return Notification.findOneAndUpdate(
      {
        _id: id,
        userId,
      },
      {
        $set: {
          isRead: true,
          readAt: new Date(),
        },
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );
  }

  /* -------------------------------------------------------------------------- */
  /*                          MARK ALL AS READ                                  */
  /* -------------------------------------------------------------------------- */

  /**
   * Mark all notifications of a user as read
   *
   * Only notifications belonging to the given user
   * will be updated.
   */
  async markAllAsRead(userId: string | Types.ObjectId): Promise<void> {
    await Notification.updateMany(
      {
        userId,
        isRead: false,
      },
      {
        $set: {
          isRead: true,
          readAt: new Date(),
        },
      },
    );
  }

  /* -------------------------------------------------------------------------- */
  /*                                  DELETE                                    */
  /* -------------------------------------------------------------------------- */

  /**
   * Delete notification
   *
   * IMPORTANT:
   * The notification must belong to the given user.
   */
  async delete(
    id: string | Types.ObjectId,
    userId: string | Types.ObjectId,
  ): Promise<INotification | null> {
    return Notification.findOneAndDelete({
      _id: id,
      userId,
    });
  }
}

export const notificationRepository = new NotificationRepository();
