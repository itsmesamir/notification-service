import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { addSubscription, removeSubscription } from "../services/subscription";
import logger from "../middleware/logger";

export const subscribe = (req: Request, res: Response): void => {
  try {
    const { userId, eventType } = req.body;
    logger.info(`Subscribing ${userId} to ${eventType}`);

    res.json(addSubscription(userId, eventType));
  } catch (error) {
    logger.error(error);
    if (error instanceof Error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    } else {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "An unknown error occurred" });
    }
  }
};

export const unsubscribe = (req: Request, res: Response) => {
  try {
    const { userId, eventType } = req.body;
    res.json(removeSubscription(userId, eventType));
  } catch (error) {
    if (error instanceof Error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    } else {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "An unknown error occurred" });
    }
  }
};
