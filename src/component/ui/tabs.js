import React, { useState } from "react";

export function Tabs({
  children,
  defaultValue,
  onValueChange,
  className = "",
}) {
  const [value, setValue] = useState(defaultValue);

  const handleChange = (newValue) => {
    setValue(newValue);
    onValueChange && onValueChange(newValue);
  };

  return (
    <div className={className}>
      {React.Children.map(children, (child) =>
        React.cloneElement(child, { value, onValueChange: handleChange })
      )}
    </div>
  );
}

export function TabsList({ children }) {
  return <div className="flex space-x-2">{children}</div>;
}

export function TabsTrigger({ children, value, onValueChange }) {
  const isActive = value === children.props?.value || value === children;
  return (
    <button
      onClick={() => onValueChange(children.props?.value || children)}
      className={`px-4 py-2 rounded-md border ${
        isActive ? "bg-blue-500 text-white" : "bg-white text-black"
      } hover:bg-blue-100 transition`}
    >
      {children}
    </button>
  );
}
