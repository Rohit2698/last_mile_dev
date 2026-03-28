
import { OptionType } from "@/components/fields/type";

export const RouteOptimizationOptions: OptionType[] = [
    { value: "minimiseTime", label: "Minimize Time" },
    { value: "minimizeDistance", label: "Minimize Distance" },
    { value: "balanced", label: "Balanced (Time + Distance)" },
    { value: "minimizeFuelConsumption", label: "Minimize Fuel Consumption" }
];

// Options for select fields
export const paymentMethodOptions = [
    { value: 'rate_per_delivery', label: 'Rate Per Delivery' },
    { value: 'flat_fee_per_delivery', label: 'Flat Fee per Delivery' },
    { value: 'percentage_of_subtotal', label: 'Percentage Of Sub Total' },
    { value: 'flat_rate', label: 'Flat Rate' },
  ];
  
  export const billingCycleOptions = [
    { value: 'monthly', label: 'Monthly' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'bi_weekly', label: 'Bi Weekly' },
  ];
  
  export const scheduleTypeOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'custom', label: 'Custom' },
  ];
  
  export const dayOptions = [
    { value: 'monday', label: 'Monday' },
    { value: 'tuesday', label: 'Tuesday' },
    { value: 'wednesday', label: 'Wednesday' },
    { value: 'thursday', label: 'Thursday' },
    { value: 'friday', label: 'Friday' },
    { value: 'saturday', label: 'Saturday' },
    { value: 'sunday', label: 'Sunday' },
  ];
  
  
  // Category options for the select field
      export const categoryOptions: OptionType[] = [
          { value: "trip_start", label: "Trip Start" },
          { value: "trip_end", label: "Trip End" },
          { value: "point_of_delivery", label: "Point of Delivery" }
      ];
  
      // Question type options
      export const typeOptions: OptionType[] = [
          { value: "yes_no", label: "Yes/No" },
          { value: "text", label: "Text" },
          { value: "number", label: "Number" },
          { value: "select", label: "Select (Multiple Choice)" }
      ];
  