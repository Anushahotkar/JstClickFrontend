/*index.jsx*/

// Import Dependencies
import { dashboards } from "./dashboards";
import { productRoutesNavigation } from "./productRoutesNavigation";
import { serviceRoutesNavigation } from "./serviceRoutesNavigation";
import { stockRoutesNavigation } from "./stockRoutesNavigation";

// Main navigation array
export const navigation = [
  dashboards,
  serviceRoutesNavigation,
  productRoutesNavigation,
  stockRoutesNavigation, // add Services navigation here
];

// Re-export base navigation if needed
export { baseNavigation } from "./baseNavigation";
