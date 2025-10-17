/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as badgeActions from "../badgeActions.js";
import type * as badgeMutations from "../badgeMutations.js";
import type * as badges from "../badges.js";
import type * as fetches from "../fetches.js";
import type * as fontData from "../fontData.js";
import type * as http from "../http.js";
import type * as svgGenerator from "../svgGenerator.js";
import type * as testBadge from "../testBadge.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  badgeActions: typeof badgeActions;
  badgeMutations: typeof badgeMutations;
  badges: typeof badges;
  fetches: typeof fetches;
  fontData: typeof fontData;
  http: typeof http;
  svgGenerator: typeof svgGenerator;
  testBadge: typeof testBadge;
}>;
declare const fullApiWithMounts: typeof fullApi;

export declare const api: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "internal">
>;

export declare const components: {};
