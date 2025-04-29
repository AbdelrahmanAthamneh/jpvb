import * as React from "react";
import { motion } from "framer-motion";

const TabsContext = React.createContext(null);

const Tabs = ({ defaultValue, onValueChange, children, className }) => {
  const [value, setValue] = React.useState(defaultValue);

  const handleValueChange = (newValue) => {
    setValue(newValue);
    onValueChange?.(newValue);
  };

  return (
    <TabsContext.Provider value={{ value, onValueChange: handleValueChange }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
};

const TabsList = ({ className, children }) => {
  return (
    <div
      className={`inline-flex items-center justify-center rounded-md bg-gray-100 p-1 ${className}`}
    >
      {children}
    </div>
  );
};

const TabsTrigger = ({ value, children, className }) => {
  const context = React.useContext(TabsContext);
  const isActive = context?.value === value;

  return (
    <button
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
        isActive
          ? "bg-white text-gray-950 shadow-sm"
          : "text-gray-500 hover:text-gray-900"
      } ${className}`}
      onClick={() => context?.onValueChange(value)}
    >
      {children}
    </button>
  );
};

const TabsContent = ({ value, children, className }) => {
  const context = React.useContext(TabsContext);
  const isActive = context?.value === value;

  if (!isActive) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export { Tabs, TabsList, TabsTrigger, TabsContent };
