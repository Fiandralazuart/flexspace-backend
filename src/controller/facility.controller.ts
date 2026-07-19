import { Response } from "express";
import { Prisma, PrismaClient } from "../../generated/prisma";
import { IReqUser } from "../utils/interface";
import response from "../utils/response";
import {
  createFacilitySchema,
  updateFacilitySchema,
} from "../validations/facility.validation";

const prisma = new PrismaClient();

export default {
  async create(req: IReqUser, res: Response) {
    try {
      const io = req.app.get("io");
      const data = createFacilitySchema.parse(req.body);

      const result = await prisma.facility.create({
        data: {
          name: data.name,
          type: data.type,
          status: data.status,
		  channel: data.channel,

          ...(data.value !== undefined && {
            value: data.value,
          }),

          device: {
            connect: {
              id: data.deviceId,
            },
          },

          creator: {
            connect: {
              id: req.user!.id,
            },
          },
        },
        include: {
          device: {
            select: {
              id: true,
              name: true,
              serialNumber: true,
              space: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });

      io.emit("facilityCreated", result);

      response.success(res, result, "Success create facility");
    } catch (error) {
      const err = error as Error;
      response.error(res, err, "Failed to create facility");
    }
  },

  async findAll(req: IReqUser, res: Response) {
    try {
      const result = await prisma.facility.findMany({
        include: {
          device: {
            select: {
              id: true,
              name: true,
              serialNumber: true,
              space: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });

      if (result.length === 0)
        return response.notFound(res, "Database is empty");

      response.success(res, result, "Success find all data");
    } catch (error) {
      const err = error as Error;
      response.error(res, err, "Failed");
    }
  },

  async findOne(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;

      if (!id || Array.isArray(id))
        return response.notFound(res, "User is not found");

      const result = await prisma.facility.findUnique({
        where: {
          id,
        },
        include: {
          device: {
            select: {
              id: true,
              name: true,
              serialNumber: true,
              space: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });

      if (!result) return response.notFound(res, "Facility not found");

      response.success(res, result, "Success find one data");
    } catch (error) {
      const err = error as Error;
      response.error(res, err, "Failed");
    }
  },

  async update(req: IReqUser, res: Response) {
    try {
      const io = req.app.get("io");
      const { id } = req.params;

      if (!id || Array.isArray(id))
        return response.notFound(res, "User is not found");

      const data = updateFacilitySchema.parse(req.body);

      const updateData: Prisma.FacilityUpdateInput = {};

      if (data.name !== undefined) {
        updateData.name = data.name;
      }

      if (data.type !== undefined) {
        updateData.type = data.type;
      }

      if (data.status !== undefined) {
        updateData.status = data.status;
      }

      if (data.value !== undefined) {
        updateData.value = data.value;
      }

      if (data.deviceId !== undefined) {
        updateData.device = {
          connect: {
            id: data.deviceId,
          },
        };
      }

      updateData.updater = {
        connect: {
          id: req.user!.id,
        },
      };

      const result = await prisma.facility.update({
        where: {
          id,
        },
        data: updateData,
        include: {
          device: {
            select: {
              id: true,
              name: true,
              serialNumber: true,
              space: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });

      io.emit("facilityUpdated", result);

      response.success(res, result, "Success update facility");
    } catch (error) {
      const err = error as Error;
      response.error(res, err, "Failed to update facility");
    }
  },

  async delete(req: IReqUser, res: Response) {
    try {
      const io = req.app.get("io");
      const { id } = req.params;

      if (!id || Array.isArray(id))
        return response.notFound(res, "User is not found");

      const result = await prisma.facility.delete({
        where: {
          id,
        },
      });

      io.emit("facilityDeleted", {
        id: result.id,
      });

      response.success(res, result, "Success delete facility");
    } catch (error) {
      const err = error as Error;
      response.error(res, err, "Failed to delete facility");
    }
  },
};
