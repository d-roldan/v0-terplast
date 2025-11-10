// Este archivo ayuda a TypeScript a entender los módulos que no tienen tipos definidos

declare module "framer-motion" {
  export const AnimatePresence: React.FC<{
    children?: React.ReactNode;
  }>;
}

declare module "vaul" {
  export const Drawer: React.FC<any>;
  export const DrawerContent: React.FC<any>;
  export const DrawerTrigger: React.FC<any>;
  export const DrawerClose: React.FC<any>;
}