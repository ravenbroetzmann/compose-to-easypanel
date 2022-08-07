/**
 * this code defines the different easypanel schemas
 * This Code comes from the github repo easypanel/easypanel-templates
 * main contributor and developer of easypanel: https://github.com/deiucanta
 */

import { z } from "zod";
import { randomBytes } from "crypto";
export const randomPassword = () => randomBytes(10).toString("hex");

export const projectNameRule = z
  .string()
  .regex(
    /^[a-z0-9-_]+$/,
    "Invalid name. Use lowercase letters (a-z), digits (0-9), dash (-), underscore (_)."
  );
export const serviceNameRule = z
  .string()
  .regex(
    /^[a-z0-9-_]+$/,
    "Invalid name. Use lowercase letters (a-z), digits (0-9), dash (-), underscore (_)."
  );
export const volumeNameRule = z
  .string()
  .regex(
    /^[a-z0-9-_]+$/,
    "Invalid name. Use lowercase letters (a-z), digits (0-9), dash (-), underscore (_)."
  );
export const domainRule = z.string().regex(/^[a-z0-9.-]+$/);
export const portRule = z.number().min(0).max(65535);
export const passwordRule = z.string().default(randomPassword);

export const appMountsSchema = z
  .array(
    z.union([
      z.object({
        type: z.literal("bind"),
        hostPath: z.string().min(1),
        mountPath: z.string().min(1),
      }),
      z.object({
        type: z.literal("volume"),
        name: volumeNameRule,
        mountPath: z.string().min(1),
      }),
      z.object({
        type: z.literal("file"),
        content: z.string(),
        mountPath: z.string().min(1),
      }),
    ])
  )
  .default([]);

export const appDeploySchema = z
  .object({
    replicas: z.number().default(1),
    command: z.string().nullable().default(null),
    zeroDowntime: z.boolean().default(true),
  })
  .default({});

export const appSchema = z.object({
  projectName: projectNameRule,
  serviceName: serviceNameRule,
  source: z
    .union([
      z.object({
        type: z.literal("image"),
        image: z.string(),
      }),
      z.object({
        type: z.literal("github"),
        owner: z.string(),
        repo: z.string(),
        ref: z.string(),
        path: z.string(),
        autoDeploy: z.boolean(),
      }),
    ])
    .optional(),
  env: z.string().default(""),
  proxy: z
    .object({
      port: z.number().default(80),
      secure: z.boolean().default(true),
    })
    .default({}),
  deploy: appDeploySchema,
  domains: z
    .array(
      z.object({
        name: domainRule,
      })
    )
    .default([]),
  mounts: appMountsSchema,
  ports: z
    .array(
      z.object({
        published: z.number(),
        target: z.number(),
      })
    )
    .default([]),
});

export const mongoSchema = z.object({
  projectName: projectNameRule,
  serviceName: serviceNameRule,
  image: z.string().optional(),
  password: passwordRule,
});

export const mysqlSchema = z.object({
  projectName: projectNameRule,
  serviceName: serviceNameRule,
  image: z.string().optional(),
  password: passwordRule,
  rootPassword: passwordRule,
});

export const mariadbSchema = z.object({
  projectName: projectNameRule,
  serviceName: serviceNameRule,
  image: z.string().optional(),
  password: passwordRule,
  rootPassword: passwordRule,
});

export const postgresSchema = z.object({
  projectName: projectNameRule,
  serviceName: serviceNameRule,
  image: z.string().optional(),
  password: passwordRule,
});

export const redisSchema = z.object({
  projectName: projectNameRule,
  serviceName: serviceNameRule,
  image: z.string().optional(),
  password: passwordRule,
});

export const singleServiceSchema = z.union([
  z.object({
    type: z.literal("app"),
    data: appSchema,
  }),
  z.object({
    type: z.literal("mysql"),
    data: mysqlSchema,
  }),
  z.object({
    type: z.literal("mariadb"),
    data: mariadbSchema,
  }),
  z.object({
    type: z.literal("mongo"),
    data: mongoSchema,
  }),
  z.object({
    type: z.literal("postgres"),
    data: postgresSchema,
  }),
  z.object({
    type: z.literal("redis"),
    data: redisSchema,
  }),
]);

export const templateSchema = z.object({
  services: z.array(singleServiceSchema),
});

export const supportedServiceTypes: Array<
  "app" | "postgres" | "mongo" | "redis" | "mysql"
> = ["app", "postgres", "mongo", "redis", "mysql"];

export const supportedComposeProps = [
  "container_name",
  "image",
  "command",
  "ports",
  "environment",
  "volumes",
];
