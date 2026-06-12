import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const steps = [
    { name: "Order Placed", description: "on Thu, 11 Jul", value: "PLACED" },
    { name: "Packed", description: "Item Packed in Dispatch Warehouse", value: "CONFIRMED" },
    { name: "Shipped", description: "by Mon, 15 Jul", value: "SHIPPED" },
    { name: "Arriving", description: "by 16 Jul - 18 Jul", value: "ARRIVING" },
    { name: "Arrived", description: "by 16 Jul - 18 Jul", value: "DELIVERED" },
];

const canceledStep = [
    { name: "Order Placed", description: "on Thu, 11 Jul", value: "PLACED" },
    { name: "Order Canceled", description: "on Thu, 11 Jul", value: "CANCELLED" },
];

const currentStep = 2; // Change this value based on the current step

const OrderStepper = ({ orderStatus }: any) => {
    const [statusStep, setStatusStep] = useState(steps);

    useEffect(() => {
        if (orderStatus === 'CANCELLED') {
            setStatusStep(canceledStep)
        } else {
            setStatusStep(steps)
        }
    }, [orderStatus])

    return (
        <Box className="mx-auto my-10 max-w-md">
            {statusStep.map((step, index) => (
                <div key={index} className="flex px-4">
                    <div className="flex flex-col items-center">
                        <Box
                            sx={{ zIndex: 1 }}
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                index <= currentStep
                                    ? "bg-brand-gold/10 text-brand-gold border border-brand-gold/40"
                                    : "bg-gray-100 text-gray-400 border border-gray-200"
                            }`}
                        >
                            {step.value === orderStatus ? (
                                <CheckCircleIcon sx={{ fontSize: '1.2rem' }} />
                            ) : (
                                <FiberManualRecordIcon sx={{ fontSize: '0.8rem' }} />
                            )}
                        </Box>
                        {index < statusStep.length - 1 && (
                            <div
                                className={`h-16 w-[1.5px] ${
                                    index < currentStep
                                        ? "bg-brand-gold/40"
                                        : "bg-gray-200"
                                }`}
                            ></div>
                        )}
                    </div>

                    <div className="ml-4 w-full pb-6">
                        <div
                            className={`${
                                step.value === orderStatus
                                    ? "bg-matte-black border border-brand-gold/25 p-3 text-white -translate-y-2"
                                    : "pt-1"
                            } ${
                                (orderStatus === "CANCELLED" && step.value === orderStatus)
                                    ? "bg-red-950 border-red-500"
                                    : ""
                            } w-full`}
                        >
                            <p className="font-sans text-xs tracking-wider uppercase font-bold">
                                {step.name}
                            </p>
                            <p
                                className={`${
                                    step.value === orderStatus
                                        ? "text-brand-gold"
                                        : "text-charcoal/50"
                                } text-[11px] font-sans mt-0.5`}
                            >
                                {step.description}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </Box>
    );
};

export default OrderStepper;
