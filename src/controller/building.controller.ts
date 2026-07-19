import { Response } from "express";
import { IReqUser } from "../utils/interface";
import response from "../utils/response";
import { PrismaClient, Prisma } from "../../generated/prisma";
import {
  BuildingSchema,
  CreateBuildingDTO,
  UpdateBuildingDTO,
} from "../validations/building.validation";

const prisma = new PrismaClient();

export default {
  async create(req: IReqUser, res: Response) {
    try {
      const io = req.app.get("io");
      const data: CreateBuildingDTO = BuildingSchema.parse(req.body);

      const result = await prisma.building.create({
        data: {
          name: data.name,
          location: data.location,
          creator: {
            connect: {
              id: req.user!.id,
            },
          },
        },
      });

      io.emit("buildingCreated", result);
      response.success(res, result, "Success Create Building");
    } catch (error) {
      const err = error as Error;
      response.error(res, err, "Failed to create building");
    }
  },
  async findAll(req: IReqUser, res: Response) {
    try {
      const page = Number(req.query.page ?? 1);
      const limit = Number(req.query.limit ?? 10);
      const search = String(req.query.search ?? "");

      const skip = (page - 1) * limit;

      const where: Prisma.BuildingWhereInput = {};

      if (search) {
        where.OR = [
          {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        ];
      }

      const [data, totalData] = await prisma.$transaction([
        prisma.building.findMany({
          where,
          skip,
          take: limit,
          orderBy: {
            createdAt: "desc",
          },
          include: {
            creator: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        }),
        prisma.building.count({
          where,
        }),
      ]);

      response.success(
        res,
        {
          data,
          meta: {
            page,
            limit,
            totalData,
            totalPage: Math.ceil(totalData / limit),
          },
        },
        "Success Get All Building",
      );
    } catch (error) {
      const err = error as Error;
      response.error(res, err, "Failed to find all building");
    }
  },
  async findOne(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;

      if (!id || Array.isArray(id))
        return response.notFound(res, "User is not found");

      const result = await prisma.building.findUnique({
        where: {
          id,
        },
        include: {
          creator: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });

      if (!result) return response.notFound(res, "Data Not Found");

      response.success(res, result, "Success Get one Data");
    } catch (error) {
      const err = error as Error;
      response.error(res, err, "Failed to find one building");
    }
  },
  async update(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;
      const data: UpdateBuildingDTO = BuildingSchema.parse(req.body);
      const io = req.app.get("io");

      if (!id || Array.isArray(id))
        return response.notFound(res, "User is not found");

      const updateData: Prisma.BuildingUpdateInput = {};

      if (data.name !== undefined) {
        updateData.name = data.name;
      }

      if (data.location !== undefined) {
        updateData.location = data.location;
      }

      updateData.updater = {
        connect: {
          id: req.user!.id,
        },
      };

      const result = await prisma.building.update({
        where: {
          id,
        },
        data: updateData,
        include: {
          creator: {
            select: {
              name: true,
              email: true,
            },
          },
          updater: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });

      io.emit("buildingUpdated", result);
      response.success(res, result, "Success Update Building");
    } catch (error) {
      const err = error as Error;
      response.error(res, err, "Failed to update building");
    }
  },
  async delete(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;
      const io = req.app.get("io");

      if (!id || Array.isArray(id))
        return response.notFound(res, "User is not found");

      const result = await prisma.building.delete({
        where: {
          id,
        },
      });

      io.emit("buildingDeleted", result);
      response.success(res, result, "Success Delete User");
    } catch (error) {
      const err = error as Error;
      response.error(res, err, "Failed to delete building");
    }
  },
};
