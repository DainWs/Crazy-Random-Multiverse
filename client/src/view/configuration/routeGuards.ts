import { IS_DEVELOPMENT } from "@/env";
import { NavigationGuardNext, RouteLocationNormalized } from "vue-router";

const developmentOnly = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  if (IS_DEVELOPMENT) return next();
}

export { developmentOnly }